 import {
  HadokenPipelineConfig,
  SemanticInput,
  MaybeAddKey,
  MaybeRemoveKey,
  Hadoken,
} from 'ph/Hadoken'

import { InputSnapshot } from 'ph/InputSnapshot'


type MappingFn = (keycode: number) => SemanticInput | null

/**
 * constructs a simple translation function between a keyboard input keycode
 * to some input that has meaning in your game.
 *
 * If an input is not present in `map` then it won't be tracked
 */
export function NewSimpleMapper(
  map: { [key: number]: SemanticInput },
): MappingFn {
  return function(keycode: number): SemanticInput | null {
    return map[keycode] || null
  }
}

type HadokenKeyboardConfig = HadokenPipelineConfig & {
  // responsible for converting from a keycode to game-relevant input
  keymapFn: MappingFn,
}

/**
 * Hadoken implementation that supports keyboard input.
 */
export class KeyboardHadoken extends Hadoken<HadokenKeyboardConfig> {
  constructor(scn: Phaser.Scene, cfg: HadokenKeyboardConfig) {
    super(scn, cfg)

    scn.input.keyboard.on('keydown', this._keydown, this)
    scn.input.keyboard.on('keyup', this._keyup, this)
  }

  _keydown(e: KeyboardEvent) {
    // checks for semantic input based on the provided keycode
    const sem = this.hadokenData.config.keymapFn(e.keyCode)
    if (!sem) {
      // if no mapping is found then we don't care about this keypress
      return
    }

    MaybeAddKey(this.hadokenData, sem, e.timeStamp)
  }

  _keyup(e: KeyboardEvent) {
    // checks for semantic input based on the provided keycode
    const sem = this.hadokenData.config.keymapFn(e.keyCode)
    if (!sem) {
      // if no mapping is found then we don't care about this key release
      return
    }

    MaybeRemoveKey(this.hadokenData, sem)
  }
}