 import {
  Hadoken,
  HadokenPipelineConfig,
  NewHadoken,
  SemanticInput,
  MaybeAddKey,
  MaybeRemoveKey,
} from 'ph/Hadoken'

import { InputSnapshot } from 'ph/InputSnapshot'

export function NewSimpleMapper(
  map: { [key: string]: SemanticInput },
): MappingFn {
  return function(keycode: number): SemanticInput | null {
    return map[keycode] || null
  }
}

export type MappingFn = (keycode: number) => SemanticInput | null

type HadokenKeyboardConfig = HadokenPipelineConfig & {
  keymapFn: MappingFn,
}

export class KeyboardHadoken {
  hadokenData: Hadoken<HadokenKeyboardConfig>
  emitter: Phaser.Events.EventEmitter

  constructor(scn: Phaser.Scene, cfg: HadokenKeyboardConfig) {
    this.hadokenData = NewHadoken(scn, cfg)
    this.emitter = this.hadokenData.emitter

    scn.input.keyboard.on('keydown', this.keydown, this)
    scn.input.keyboard.on('keyup', this.keyup, this)
  }

  keydown(e: KeyboardEvent) {
    const sem = this.hadokenData.config.keymapFn(e.keyCode)
    if (!sem) {
      return
    }

    MaybeAddKey(this.hadokenData, sem, e.timeStamp)
  }

  keyup(e: KeyboardEvent) {
    const sem = this.hadokenData.config.keymapFn(e.keyCode)
    if (!sem) {
      return
    }

    MaybeRemoveKey(this.hadokenData, sem)
  }

  lastState(): InputSnapshot {
    if (this.hadokenData.processedHistory.length === 0) {
      return { state: {}, timestamp: Date.now() }
    }

    return this.hadokenData.processedHistory.slice(-1)[0]
  }
}