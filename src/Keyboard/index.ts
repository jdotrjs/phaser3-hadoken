 import {
  Hadoken,
  HadokenPipelineConfig,
  NewHadoken,
  SemanticInput,
  maybeAddKey,
  maybeRemoveKey,
} from 'ph/Hadoken'

import { InputSnapshot } from 'ph/InputSnapshot'

export type MappingFn = (keycode: number) => SemanticInput | null

type HadokenKeyboardConfig = HadokenPipelineConfig & {
  keymapFn: MappingFn,
}

export class HadokenKeyboard {
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

    maybeAddKey(this.hadokenData, sem, e.timeStamp)
  }

  keyup(e: KeyboardEvent) {
    const sem = this.hadokenData.config.keymapFn(e.keyCode)
    if (!sem) {
      return
    }

    maybeRemoveKey(this.hadokenData, sem)
  }

  lastState(): InputSnapshot {
    if (this.hadokenData.processedHistory.length === 0) {
      return { state: {}, timestamp: Date.now() }
    }

    return this.hadokenData.processedHistory.slice(-1)[0]
  }
}