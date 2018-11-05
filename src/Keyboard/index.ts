import {
  Hadoken,
  HadokenPipelineConfig,
  NewHadoken,
  SemanticInput,
} from 'ph/Hadoken'

import { HasSameKeys, InputSnapshot } from 'ph/InputSnapshot'

export type MappingFn = (keycode: number) => SemanticInput | null

type HadokenKeyboardConfig = HadokenPipelineConfig & {
  keymapFn: MappingFn,
}

export class HadokenKeyboard {
  state: Hadoken<HadokenKeyboardConfig>

  constructor(scn: Phaser.Scene, cfg: HadokenKeyboardConfig) {
    this.state = NewHadoken(scn, cfg)

    scn.input.keyboard.on('keydown', this.keydown, this)
    scn.input.keyboard.on('keyup', this.keyup, this)
    scn.events.on('preupdate', this.preupdate, this)
  }

  preupdate() {
    const coalesse = this.state.config.coalesseFn || function(e: InputSnapshot): InputSnapshot { return e }
    for (
      let i = this.state.processedHistory.length;
      i < this.state.rawHistory.length;
      i++
    ) {
      const state = this.state.rawHistory[i]
      const coalessed = coalesse(state, state.timestamp)
      const filters = this.state.config.filters
      const filtered = filters ? filters(coalessed) : coalessed
      this.state.processedHistory.push(filtered)

      const matchers = this.state.config.matchers || []
      const matched = matchers.reduce((matched, cur) => {
        if (matched !== '') {
          return matched
        }
        return cur.match(this.state.processedHistory)
          ? cur.name
          : ''
      }, '')

      if (matched !== '') {
        console.log(`matched ${matched}`)
      }
    }
  }

  keydown(e: KeyboardEvent) {
    const sem = this.state.config.keymapFn(e.keyCode)
    if (!sem) {
      return
    }

    const now = Date.now()

    const lastState = this.state.rawHistory.slice(-1)[0]
    const newSnapshot = {
      timestamp: now,
      state: {
        [sem]: { pressed: e.timeStamp },
        ...lastState.state,
      }
    }

    if (!HasSameKeys(newSnapshot, lastState)) {
      this.state.rawHistory.push(newSnapshot)
    }
  }

  keyup(e: KeyboardEvent) {
    const sem = this.state.config.keymapFn(e.keyCode)
    if (!sem) {
      return
    }

    const lastSnapshot = this.state.rawHistory.slice(-1)[0]
    const state = { ...lastSnapshot.state }
    delete state[sem]

    if (!HasSameKeys(lastSnapshot, state)) {
      const newState: InputSnapshot = {
        timestamp: Date.now(),
        state,
      }
      this.state.rawHistory.push(newState)
    }
  }

  lastState(): InputSnapshot | null {
    if (this.state.processedHistory.length === 0) {
      return null
    }
    return this.state.processedHistory.slice(-1)[0]
  }
}