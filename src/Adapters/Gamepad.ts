import {
  AdapterSyncFn,
  Hadoken as HadokenBase,
  HadokenData,
  HadokenPipelineConfig,
  MaybeBatchUpdate,
} from 'ph/Hadoken'
import { isStandardMapping } from 'ph/Common/Gamepad';

// AnalogContainer holds point-in-time data for controller analog inputs
type AnalogContainer = {
  stick: {
    [name: string]: {
      angle: number,
      value: number,
    }
  },
  trigger: {
    [name: string]: number
  },
}

/**
 * Hadoken implementation to support receiving inputs from gamepads.
 */
export class Hadoken extends HadokenBase<GamepadHadokenConfig> {
  // exposes processed data from a controller's analog inputs
  analogData: AnalogContainer

  /**
   *
   * @param scn {Phaser.Scene} the scene this input manager belongs in
   * @param cfg {GamepadHadokenConfig}
   */
  constructor(scn: Phaser.Scene, cfg: GamepadHadokenConfig) {
    const data = { stick: {}, trigger: {} }
    super(scn, cfg, mkControllerSync(data))
    this.analogData = data
  }

  /**
   * Returns true or false if we can determine that the wrapped gamepad
   * supports the standard gamepad mapping used by StandardButtons and
   * specified in https://w3c.github.io/gamepad/#remapping.
   *
   * If we're unable to be certain that the standard mapping is (or is not)
   * supported then null is returned.
   */
  isStandardMapping(): boolean | null {
    return isStandardMapping(this.hadokenData.config.gamepad)
  }
}

export type ButtonDef = StickDef | TriggerDef | DigitalDef

export function isStick(b: ButtonDef): b is StickDef { return b.type === 'stick' }
export function isTrigger(b: ButtonDef): b is TriggerDef { return b.type === 'trigger' }
export function isDigital(b: ButtonDef): b is DigitalDef { return b.type === 'digital' }

export type GamepadHadokenConfig = HadokenPipelineConfig & {
  // the gamepad this config is handling
  gamepad: Phaser.Input.Gamepad.Gamepad,

  // maps from a keypad button id to a button name
  buttonMap: ButtonMap,
}

export type ButtonMap = ButtonDef[]

// DigitalDef specifies a button that has a binary on/off state
export type DigitalDef = {
  type: 'digital',
  // which button is used for this switch
  idx: number,
  // what is this button called
  mapping: string,
}

export type TriggerMapper = (value: number) => string | null

// TriggerDef specifies an analog input that may have a value between 0 and 1
export type TriggerDef = {
  type: 'trigger',
  // which button is used as the trigger
  idx: number,
  // this is the name of the trigger; it will be used to expose the value value
  // data on the Gamepad.Hadoken's AnalogContainer attribute
  name: string,

  // function that converts some trigger value into an input
  triggerMapper: TriggerMapper,
  // all possible values that can be mapped from this trigger
  allMapped: string[],
}

export type StickMapper = (angle: number, value: number) => string | null

// StickDef describes the configuration of a 2-axis analog joystick on the
// gamepad.
export type StickDef = {
  type: 'stick',
  // this is the name of the stick; it will be used to expose raw angle + value
  // data on the Gamepad.Hadoken's AnalogContainer attribute
  name: string,

  // defines a vertical axis for the stick input
  verticalAxis: {
    // which pad axis should be used
    idx: number,
    // indicate if "up" is +1 or -1 on this axis
    up: 1 | -1,
  },
  // defines a horizontal axis for the stick input
  horizontalAxis: {
    // which pad axis should be used
    idx: number,
    // indicates if "right" in +1 or -1 on this axis
    right: 1 | -1,
  },

  // maps an angle + magnitude to an input
  angleMapper: StickMapper,
  // a list of all possible values that could be produced by angleMapper
  allMapped: string[],
}

// mkControllerSync produces a function that will check a controller state
// and send updates back to the hadoken context. Additionally it reports
// analog state back into the provided data object which is queryable from
// a Gamepad.Hadoken
function mkControllerSync(data: AnalogContainer): AdapterSyncFn<GamepadHadokenConfig> {
  return function (ctx: HadokenData<GamepadHadokenConfig>) {
    const cfg = ctx.config
    const pad = cfg.gamepad

    // aggregate all pressed/notpressed then apply a single update
    const [pressed, notPressed] = cfg.buttonMap.reduce(
      (acc: [string[], string[]], def: ButtonDef) => {
        if (isStick(def)) {
          if (pad.axes.length > Math.max(def.verticalAxis.idx, def.horizontalAxis.idx)) {
            const angle = getStickAngle(def, pad)
            const value = getStickMagnitude(def, pad)
            data.stick[def.name] = { angle, value }

            const mapping = def.angleMapper(angle, value)
            const unmappedKeys = def.allMapped.filter(k => mapping === null || k !== mapping)
            return [
              [...acc[0], ...(mapping !== null ? [mapping] : [])],
              [...acc[1], ...unmappedKeys],
            ]
          } else {
            data.stick[def.name] = { angle: 0, value: 0 }
            return [acc[0], [...acc[1], ...def.allMapped]]
          }
        }
        if (isTrigger(def)) {
          if (pad.buttons.length > def.idx) {
            const value = pad.buttons[def.idx].value || 0
            data.trigger[def.name] = value

            const mapping = def.triggerMapper(value)
            const unmappedKeys = def.allMapped.filter(k => mapping === null || k !== mapping)
            return [
              [...acc[0], ...(mapping !== null ? [mapping] : [])],
              [...acc[1], ...unmappedKeys],
            ]
          } else {
            data.trigger[def.name] = 0
            return [acc[0], [...acc[1], ...def.allMapped]]
          }
        }
        if (isDigital(def)) {
          if (pad.buttons.length > def.idx) {
            const pressed = pad.buttons[def.idx].pressed
            if (pressed) {
              return [[...acc[0], def.mapping], acc[1]]
            } else {
              return [acc[0], [...acc[1], def.mapping]]
            }
          }
        }
        console.error(`Unhandled button definition: ${JSON.stringify(def)}`)
        return acc
      },
      [[], []],
    )
    MaybeBatchUpdate(ctx, pressed, notPressed, pad.timestamp)
  }
}

function clamp(n: number, min: number, max: number): number {
  return Math.min(Math.max(n, min), max)
}

function getStickAngle(def: StickDef, pad: Phaser.Input.Gamepad.Gamepad): number {
  const vAxis = pad.axes[def.verticalAxis.idx]
  const hAxis = pad.axes[def.horizontalAxis.idx]

  const xVal = hAxis.value * def.horizontalAxis.right
  const yVal = vAxis.value * def.verticalAxis.up * -1
  let deg = Math.atan(yVal / xVal) * 57.295827

  // quad 2 / 3
  if (xVal < 0) { deg = 180 + deg }

  if (deg < 0) { deg += 360 }
  if (deg >= 360) { deg -= 360 }

  // TODO: need to test w/ other controllers that have different axis mappings

  return deg
}

function getStickMagnitude(def: StickDef, pad: Phaser.Input.Gamepad.Gamepad): number {
  const vAxis = pad.axes[def.verticalAxis.idx]
  const hAxis = pad.axes[def.horizontalAxis.idx]

  const xVal = hAxis.value * def.horizontalAxis.right
  const yVal = vAxis.value * def.verticalAxis.up * -1

  const x = Math.sqrt(xVal * xVal + yVal * yVal)
  return clamp(x, 0, 1)

}