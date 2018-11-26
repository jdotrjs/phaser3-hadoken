 import {
  HadokenPipelineConfig,
  SemanticInput,
  MaybeAddKey,
  MaybeRemoveKey,
  Hadoken as HadokenBase,
  HadokenData,
} from 'ph/Hadoken'

const StockConfigs = Phaser.Input.Gamepad.Configs

const x360 = StockConfigs.XBOX_360 as { [keyname: string]: number }


const def = (
  idx: number,
  mapping: string,
  t: number | null = null,
): ButtonDef => ({
  idx,
  mapping,
  ...(t ? { threshold: t }: {}),
})

export const Xbox360: ButtonMap = [
  def(x360.UP,    'up'),
  def(x360.DOWN,  'down'),
  def(x360.LEFT,  'left'),
  def(x360.RIGHT, 'right'),
  def(x360.A,     'punch:light'),
  def(x360.B,     'punch:hard'),
  def(x360.X,     'kick:light'),
  def(x360.Y,     'kick:hard'),
  def(x360.LB,    'guard'),
]


type ButtonDef = {
  idx: number,
  threshold?: number,
  mapping: string,
}

type ButtonMap = ButtonDef[]

export type GamepadHadokenConfig = HadokenPipelineConfig & {
  gamepad: Phaser.Input.Gamepad.Gamepad,

  // maps from a keypad button id to a button name
  buttonMap: ButtonMap,
}

function controllerSync(ctx: HadokenData<GamepadHadokenConfig>) {
  const cfg = ctx.config
  const pad = cfg.gamepad

  cfg.buttonMap.forEach(def => {
    const btn = pad.buttons[def.idx]
    const pastThreshold = def.threshold && btn.value >= def.threshold
    const pressed = btn.pressed && !def.threshold || pastThreshold

    if (pressed) {
      MaybeAddKey(ctx, def.mapping, pad.timestamp)
    } else {
      MaybeRemoveKey(ctx, def.mapping)
    }
  })
}

export class Hadoken extends HadokenBase<GamepadHadokenConfig> {
  constructor(scn: Phaser.Scene, cfg: GamepadHadokenConfig) {
    super(scn, cfg, controllerSync)
  }
}