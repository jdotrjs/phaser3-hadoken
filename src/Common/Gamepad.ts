import {
  ButtonDef,
  StickDef,
  StickMapper,
  TriggerMapper,
  TriggerDef,
} from 'ph/Adapters/Gamepad'

// checks to see if the phaser exposed gamepad supports the standard mapping
export const isStandardMapping = (
  phaserPad: Phaser.Input.Gamepad.Gamepad,
): boolean | null => {
  const { pad } = phaserPad
  if (!pad) {
    return null
  }

  const { mapping } = pad
  if (typeof mapping === 'string') {
    return mapping === 'standard'
  }

  return null
}

/**
 * Produces a definition for one of the buttons on the controller.
 *
 * @param {number} idx The index in the button array that should be mapped to
 *   some input; standard button mappings can be found in StandardButton and
 *   related objects.
 * @param {string} mapping what does this button mean
 */
export const mkButtonInput = (
  idx: number,
  mapping: string,
): ButtonDef => ({
  type: 'digital',
  idx,
  mapping,
})

/**
 * This creates a config object for a a trigger button. Does no validation that
 * the button passed in is likely to actually be a trigger.
 *
 * @param {number} idx the index in the controller's button array that should
 *   be mapped to some input; standard indices can be found in StandardButton
 *   and related objects.
 * @param {string} name the name of this trigger; used to expose the raw value
 *   in the AnalogContainer
 * @param {Triggermapper} triggerMapper maps from an 0->1 value into some input
 * @param {string[]} allMapped all possible values that triggerMapper may
 *   produce
 */
export const mkTriggerInput = (
  idx: number,
  name: string,
  triggerMapper: TriggerMapper,
  allMapped: string[],
): TriggerDef => ({
  type: 'trigger',
  idx,
  name,
  triggerMapper,
  allMapped,
})

export const mkStandardLeftStickInput = (
  name: string,
  angleMapper: StickMapper,
  allMapped: string[],
): StickDef => mkStandardStickInput(name, 'left', angleMapper, allMapped)

export const mkStandardRightStickInput = (
  name: string,
  angleMapper: StickMapper,
  allMapped: string[],
): StickDef => mkStandardStickInput(name, 'right', angleMapper, allMapped)

/**
 * This produces a definition for one of the two (left/right) 2-axis joysticks
 * available on the "standard" gamepad. For more information see MDN at
 * https://w3c.github.io/gamepad/#remapping
 * @param {string} name the name of this stick, used to expose processed
 *   snapshot data in the AnalogContainer
 * @param { 'left' | 'right' } stick which stick on the "standard controller"
 *   we're providing a specification for
 * @param {StickMapper} angleMapper maps from a stick angle+magnitude into
 *   some input
 * @param {string[]} allMapped all possible inputs that could be mapped from
 *   angleMapper
 * @returns {StickDef} a complete definition of a Hadoken Gamepad stick input
 */
export const mkStandardStickInput = (
  name: string,
  stick: 'left' | 'right',
  angleMapper: StickMapper,
  allMapped: string[],
): StickDef => {
  if (stick === 'left') {
    return mkStickInput(name, 0, 1, 1, -1, angleMapper, allMapped)
  }
  if (stick === 'right') {
    return mkStickInput(name, 2, 1, 3, -1, angleMapper, allMapped)
  }

  throw new Error(`${name}: Unsupported stick location ${stick}`)
}

/**
 * @param {string} name the name of this stick, used to expose processed
 *   snapshot data in the AnalogContainer
 * @param {number} horizIdx index of the horizontal axis
 * @param {1|-1} right is a "right" position indicated by 1 or -1
 * @param {number} vertIdx index of the vertical axis
 * @param {1|-1} up is an "up" position indicated by 1 or -1
 * @param {StickMapper} angleMapper maps from a stick angle+magnitude into
 *   some input
 * @param {string[]} allMapped all possible inputs that could be mapped from
 *   angleMapper
 * @returns {StickDef} a complete definition of a Hadoken Gamepad stick input
 */
export const mkStickInput = (
  name: string,
  horizIdx: number,
  right: 1 | -1,
  vertIdx: number,
  up: 1 | -1,
  angleMapper: StickMapper,
  allMapped: string[],
): StickDef => ({
  type: 'stick',
  name,
  verticalAxis: {
    idx: vertIdx,
    up,
  },
  horizontalAxis: {
    idx: horizIdx,
    right,
  },
  angleMapper,
  allMapped,
})

/**
 * Produces a StickMapper that knows how to slice up a circle into 8 directions
 * inputs: right, down+right, down, down+left, left, up+left, up, up+right.
 *
 * Right begins at 0° and progresses cockwise, e.g.
 *   0°   -> right
 *   90°  -> down
 *   220° -> up+lift
 *
 * @param {number} threshold how far does the stick need to be pushed before it
 *   registeres as moving in that direction.
 * @param {string} prefix if set this causes all inputs to be prefixed with this
 *   argument
 */
export const mkBasicStickDpadMapper = (
  threshold: number = 0.5,
  prefix: string = '',
): StickMapper => {
  return function (angle: number, value: number): string | null {
    if (value < threshold) {
      return null
    }

    if (angle >= 337.5 || angle <= 22.5) {
      return `${prefix}right`
    }

    if (angle > 22.5 && angle < 67.5) {
      return `${prefix}down+right`
    }

    if (angle >= 67.5 && angle <= 112.5) {
      return `${prefix}down`
    }

    if (angle > 112.5 && angle < 157.5) {
      return `${prefix}down+left`
    }

    if (angle >= 157.5 && angle <= 202.5) {
      return `${prefix}left`
    }

    if (angle > 202.5 && angle < 247.5) {
      return `${prefix}up+left`
    }

    if (angle >= 247.5 && angle <= 292.5) {
      return `${prefix}up`
    }

    if (angle > 292.5 && angle < 337.5) {
      return `${prefix}up+right`
    }

    return null
  }
}