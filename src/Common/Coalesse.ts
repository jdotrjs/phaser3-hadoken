import { SemanticInput, FilterFn } from "ph/Hadoken";
import { InputSnapshot, ReplaceKey } from "ph/InputSnapshot"

export type CoalesseMapping = {
  [key: string]: SemanticInput[],
}

export const DPAD_COMBINATIONS: CoalesseMapping = {
  'down+left':  ['down', 'left' ],
  'down+right': ['down', 'right'],
  'up+left':    ['up',   'left' ],
  'up+right':   ['up',   'right'],
}

export function Coalesse(input: InputSnapshot, timestamp: number): InputSnapshot {
  const output = { ...input.state }
  const hasKey = (i: string): boolean => {
    return !!output[i]
  }
  const hasAll = (set: string[]): boolean => set.every(hasKey)
  Object.keys(DPAD_COMBINATIONS).forEach(k => {
    if (hasAll(DPAD_COMBINATIONS[k])) {
      DPAD_COMBINATIONS[k].forEach(e => delete output[e]);
      output[k] = { pressed: timestamp, meta: null };
    }
  })
  return { timestamp: input.timestamp, state: output };
}

export function NewFacingFilter(getFacing: () => 'right' | 'left'): FilterFn {
  return function (input: InputSnapshot): InputSnapshot {
    const facing = getFacing();
    let output = { ...input, state: { ...input.state } };
    if (facing === 'right') {
      output = ReplaceKey(output, 'right', 'forward');
      output = ReplaceKey(output, 'down+right', 'down+forward');
      output = ReplaceKey(output, 'up+right', 'up+forward');
      output = ReplaceKey(output, 'left', 'backward');
      output = ReplaceKey(output, 'down+left', 'down+backward');
      output = ReplaceKey(output, 'up+left', 'up+backward');
    }
    else {
      output = ReplaceKey(output, 'left', 'forward');
      output = ReplaceKey(output, 'down+left', 'down+forward');
      output = ReplaceKey(output, 'up+left', 'up+forward');
      output = ReplaceKey(output, 'right', 'backward');
      output = ReplaceKey(output, 'down+right', 'down+backward');
      output = ReplaceKey(output, 'up+right', 'up+backward');
    }
    return output;
  };
}