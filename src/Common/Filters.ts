import { SemanticInput, FilterFn } from "ph/Hadoken";
import { InputSnapshot, ReplaceKey } from "ph/InputSnapshot"

/**
 * Takes a series of filters that should be applied to an input snapshot and
 * combines them into a single filter function that passes the result of
 * filter[0] into filter[1] etc.
 */
export function NewChain(...filters: FilterFn[]): FilterFn {
  return (input: InputSnapshot) => filters.reduce(
    (acc, nextFn) => nextFn(acc),
    input,
  )
}

export type CoalesseMapping = {
  [key: string]: SemanticInput[],
}

/**
 * Combines multiple inputs into a single combined direction with a pressed
 * timestamp of the most recent input registered, e.g., when both up and right
 * are pressed you could replace both with `up+right'.
 */
export function CoalesseInputs(mappings: CoalesseMapping): FilterFn {
  return function(input: InputSnapshot): InputSnapshot {
    const hasAll = (set: string[]): boolean => set.every(k => !!output[k])

    const output = { ...input.state }

    Object.keys(mappings).forEach(k => {
      if (hasAll(mappings[k])) {
        let timeStamp = 0
        mappings[k].forEach(e => {
          if (output[e].pressed > timeStamp) {
            timeStamp = output[e].pressed
          }
          delete output[e]
        })
        output[k] = { pressed: timeStamp }
      }
    })

    return { timestamp: input.timestamp, state: output }
  }
}

/**
 * Of the specified inputs only the most recent will be included in the
 * resulting input snapshot, e.g., if you press punch:light and punch:hard
 * only the most recent punch will be registered.
 */
export function OnlyMostRecent(inputs: SemanticInput[]): FilterFn {
  const inputLookup: { [key: string]: boolean } = {}
  inputs.forEach(k => { inputLookup[k] = true })

  return function(input: InputSnapshot): InputSnapshot {
    const output: InputSnapshot = { timestamp: input.timestamp, state: {} }
    Object.keys(input.state).filter(k => !inputLookup[k]).forEach(k => {
      output.state[k] = input.state[k]
    })
    const mostRecent = inputs.reduce(
      (acc: [string, number] | null, cur: string) => {
        if (!input.state[cur]) {
          return acc
        }

        if (acc === null || acc[1] < input.state[cur].pressed) {
          return [cur, input.state[cur].pressed]
        }

        return acc
      },
      null,
    )
    if (mostRecent !== null) {
      const k = mostRecent[0]
      output.state[k] = input.state[k]
    }
    return output
  }
}

/**
 * Converts fixed direction input into relative direction input based on a
 * provided function  that returns whether the character in facing right
 * or left.
 *
 * @param getFacing A function that returns which direction (right or left)
 * should be considered "forward"
 */
export function MapToFacing(getFacing: () => 'right' | 'left'): FilterFn {
  return function (input: InputSnapshot): InputSnapshot {
    const facing = getFacing()
    let output = { ...input, state: { ...input.state } }

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
  };
}