import { InputSnapshot, InputState, NewInputs } from 'ph/InputSnapshot'
import { MatchFn, SemanticInput } from 'ph/Hadoken'

type MatchPredicate = (input: InputState) => boolean

type MoveDef = {
  name: string,
  inputToleranceMS?: number,
  moveMatcher: MatchFn,
}

// Priority ordered series of move definitions
type MoveList = MoveDef[]

// Looks for _one_ pressed button of a given class
function oneClass(n: string): MatchPredicate {
  return function (input: InputState): boolean {
    return Object.keys(input).filter(i => i.indexOf(n) === 0).length === 1
  }
}

// Verifies that none of the represented classes are present
function noClass(n: string): MatchPredicate {
  return function (input: InputState): boolean {
    return Object.keys(input).filter(i => i.indexOf(n) === 0).length === 0
  }
}

function multiKey(...matchers: (SemanticInput | MatchPredicate)[]): MatchPredicate {
  return (input: InputState): boolean =>
    matchers.reduce(
      (acc, cur) => {
        if (typeof cur === 'string') {
          return acc && !!input[cur]
        }

        return acc && cur(input)
      },
      true,
    )
}

function hasOneClass(
  ss: InputSnapshot,
  keyClass: string,
): SemanticInput | null {
  const prospective = Object.keys(ss.state).filter(k => k.indexOf(keyClass) === 0)
  if (prospective.length !== 1) {
    return null
  }
  return prospective[0]
}

const simpleSubsetMatchOptionsDefault = {
  stepDelay: 250,
  totalDelay: 3000,
}

// TODO: lol, this should be checking a full snapshot, not a single input
type InputPredicate = (history: InputSnapshot[], curIdx: number) => boolean
type InputCheck = SemanticInput | InputPredicate

function check(ck: InputCheck, history: InputSnapshot[], curIdx: number): boolean {
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

export function NKeys(input: SemanticInput[]): InputPredicate {
  return function() { return false }
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
  if (!check(ck, history, historyIdx)) {
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

      if (check(ck, history, historyIdx)) {
        results.push(historyIdx)
        prevInputTS = thisInputTS
        break
      }
    }
  }

  return results.length == sequence.length ? results : null
}

export function NewSimple(
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