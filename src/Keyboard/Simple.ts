import { SemanticInput, FilterFn } from "../Hadoken"
import { InputSnapshot, HasKey, ReplaceKey } from "../InputSnapshot"

const c = Phaser.Input.Keyboard.KeyCodes

export function Mapper(keycode: number): SemanticInput | null {
  const mapping = {
    [c.DOWN]:  'down',
    [c.UP]:    'up',
    [c.RIGHT]: 'right',
    [c.LEFT]:  'left',
    [c.A]:     'punch:light',
    [c.O]:     'punch:hard',
    [c.E]:     'kick:light',
    [c.U]:     'kick:hard',
  }

  return mapping[keycode] || null
}

export type CoalesseMapping = {
  [key: string]: SemanticInput[],
}

export const DPAD_COMBINATIONS: CoalesseMapping = {
  'down+left':  ['down', 'left' ],
  'down+right': ['down', 'right'],
  'up+left':    ['up',   'left' ],
  'up+right':   ['up',   'right'],
}

export function Coalesse(
  input: InputSnapshot,
  timestamp: number,
): InputSnapshot {
  const output = {...input.state}

  const hasKey = (i: string): boolean => {
    return !!output[i]
  }

  const hasAll = (set: string[]): boolean => set.every(hasKey)

  Object.keys(DPAD_COMBINATIONS).forEach(k => {
    if (hasAll(DPAD_COMBINATIONS[k])) {
      DPAD_COMBINATIONS[k].forEach(e => delete output[e])
      output[k] = { pressed: timestamp, meta: null }
    }
  })

  return { timestamp: input.timestamp, state: output }
}

export function NewFacingFilter(getFacing: () => 'right' | 'left'): FilterFn {
  return function(input: InputSnapshot): InputSnapshot {
    const facing = getFacing()
    let output = { ...input, state: { ...input.state }}
    if (facing === 'right') {
      output = ReplaceKey(output, 'right', 'forward')
      output = ReplaceKey(output, 'down+right', 'down+forward')
      output = ReplaceKey(output, 'up+right', 'up+forward')
      output = ReplaceKey(output, 'left', 'backward')
      output = ReplaceKey(output, 'down+left', 'down+backward')
      output = ReplaceKey(output, 'up+left', 'up+backward')
    } else {
      output = ReplaceKey(output, 'left', 'forward')
      output = ReplaceKey(output, 'down+left', 'down+forward')
      output = ReplaceKey(output, 'up+left', 'up+forward')
      output = ReplaceKey(output, 'right', 'backward')
      output = ReplaceKey(output, 'down+right', 'down+backward')
      output = ReplaceKey(output, 'up+right', 'up+backward')
    }
    return output
  }
}