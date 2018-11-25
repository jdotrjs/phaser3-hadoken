import { InputSnapshot, NewInputs } from 'ph/InputSnapshot'
import { MatchFn, SemanticInput } from 'ph/Hadoken'

export type InputPredicate = (history: InputSnapshot[], curIdx: number) => boolean
export type InputCheck = SemanticInput | InputPredicate

function singleKeyCheck(ck: InputCheck, history: InputSnapshot[], curIdx: number): boolean {
  if (typeof ck === 'string') {
    const isLast = curIdx == 0
    const prev = isLast ? { timestamp: 0, state: {} } : history[curIdx - 1]
    const cur = history[curIdx]
    const keys = NewInputs(prev, cur)
    const ckIdx = findIndex(keys, ck)
    return ckIdx !== -1
  }
  return ck(history, curIdx)
}

function findIndex(input: string[], ck: string): number {
  for (let i = 0; i < input.length; i++) {
    if (input[i] == ck) {
      return i
    }
  }
  return -1
}

const simpleSubsetMatchOptionsDefault = {
  stepDelay: 250,
  totalDelay: 3000,
}

/**
 * Checks if a sequence exists within some historic snapshot.
 *
 * @param history An array of input states ordered oldest-to-newest
 * @param sequence An array of inputs that composes a move sequence; ordered last to first
 * @returns indexes of the sequence match if one is found, null otherwise
 */
function simpleSubsetMatch(
  history: InputSnapshot[],
  sequence: InputCheck[],
  options: {
    stepDelay: number,
    totalDelay: number,
  } = simpleSubsetMatchOptionsDefault,
): number[] | null {
  const { stepDelay, totalDelay } = options
  if (!history || !history.length || !sequence || !sequence.length) {
    return null
  }

  let ck = sequence[0]
  let historyIdx = history.length - 1

  const lastInputTS = history[historyIdx].timestamp
  let prevInputTS = lastInputTS

  const results = []
  if (!singleKeyCheck(ck, history, historyIdx)) {
    return null
  }
  results.push(historyIdx)
  historyIdx--

  let inTime = true

  for (let i = 1; inTime && i < sequence.length; i++) {
    ck = sequence[i]
    for (; historyIdx >= 0; historyIdx--) {
      const thisInputTS = history[historyIdx].timestamp
      const brokeFullInput = lastInputTS - thisInputTS > totalDelay
      const brokeStepInput = prevInputTS - thisInputTS > stepDelay
      inTime = !(brokeFullInput || brokeStepInput)

      if (!inTime) {
        break
      }

      if (singleKeyCheck(ck, history, historyIdx)) {
        results.push(historyIdx)
        prevInputTS = thisInputTS
        break
      }
    }
  }

  return results.length == sequence.length ? results : null
}

/**
 * Constructs a simple subset matcher for a given sequence. The maximum amount
 * of delay betwen each input and for the entire sequence. These delay values
 * are specified in the options parameter and are specified as a number of
 * milliseconds. If no input is provided the defaults are:
 *   stepDelay: 250ms
 *   totalyDelay: 3000ms
 *
 * The actual match just looks for the sequence of inputs in the correct order
 * regardless of any intervening input states. This means you can match a move
 * sequence of "a, a, b" with input states of "a, c, a, b."
 *
 * A sequence step can be either a string, in which case we will look for an
 * input state that contains that input, or an InputPredicate. See type docs
 * on how that is used.
 */
export function New(
  sequence: InputCheck[],
  options: {
    stepDelay: number,
    totalDelay: number,
  } = simpleSubsetMatchOptionsDefault,
): MatchFn {
  if (sequence.length === 0) {
    return () => [false, null]
  }

  const seq = [...sequence]
  seq.reverse()

  return function (history: InputSnapshot[]): [boolean, object | null] {
    const mvIndicies = simpleSubsetMatch(history, seq, options)
    if (mvIndicies !== null) {
      for (let i = mvIndicies.slice(-1)[0]; i < history.length; i++) {
        if (null !== simpleSubsetMatch(history.slice(0, i), seq, options)) {
          return [false, null]
        }
      }
    }

    return [!!mvIndicies, null]
  }
}