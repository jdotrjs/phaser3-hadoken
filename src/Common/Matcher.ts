import difference from 'lodash/difference'

import { InputSnapshot, InputState, HasKey } from 'ph/InputSnapshot'
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
  return function(input: InputState): boolean {
    return Object.keys(input).filter(i => i.indexOf(n) === 0).length === 1
  }
}

// Verifies that none of the represented classes are present
function noClass(n: string): MatchPredicate {
  return function(input: InputState): boolean {
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

function newInputs(oldSS: InputSnapshot, newSS: InputSnapshot): SemanticInput[] {
  const oldKeys = Object.keys(oldSS.state)
  const newKeys = Object.keys(newSS.state)
  return difference(newKeys, oldKeys)
}

function remInputs(oldSS: InputSnapshot, newSS: InputSnapshot): SemanticInput[] {
  const oldKeys = Object.keys(oldSS.state)
  const newKeys = Object.keys(newSS.state)
  return difference(oldKeys, newKeys)
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
  sequence: SemanticInput[],
  options: {
    stepDelay: number,
    totalDelay: number,
  } = simpleSubsetMatchOptionsDefault,
): number[] | null {
  const { stepDelay, totalDelay } = options
  if (!history || !history.length || !sequence || !sequence.length) {
    return null
  }

  let historyIdx = history.length - 1
  let lastLocation: InputSnapshot = {state: {}, timestamp: 0}
  let curLoaction = history[historyIdx]
  let wantMv = sequence[0]

  const mvIndices = []

  // check to see if the most recent frame finishes the move sequence
  if (newInputs(lastLocation, curLoaction).indexOf(wantMv) === -1) {
    // if not then this slice of history can't be an input match
    return null
  }
  mvIndices.push(historyIdx)

  const lastInputTS = curLoaction.state[wantMv].pressed

  let curMv = 1
  let prevMvTS = lastInputTS

  for (; curMv < sequence.length; curMv++) {
    wantMv = sequence[curMv]
    for (; historyIdx >= 0; historyIdx--) {
      lastLocation = curLoaction
      curLoaction = history[historyIdx]
      const newKeys = newInputs(lastLocation, curLoaction)

      if (newKeys.indexOf(wantMv) !== -1) {
        const { pressed } = curLoaction.state[wantMv]
        const brokeStep = prevMvTS - pressed > stepDelay
        const brokeTotal = lastInputTS - pressed > totalDelay
        if (brokeStep || brokeTotal) {
          return null
        }
        prevMvTS = pressed
        mvIndices.push(historyIdx)
        break
      }
    }
  }

  return mvIndices.length === sequence.length
    ? mvIndices
    : null
}

export function NewSimple(
  sequence: SemanticInput[],
  options: {
    stepDelay: number,
    totalDelay: number,
  } = simpleSubsetMatchOptionsDefault,
): MatchFn {
  if (sequence.length === 0) {
    return () => false
  }

  const seq = [...sequence]
  seq.reverse()

  return function (history: InputSnapshot[]): boolean {
    const mvIndicies = simpleSubsetMatch(history, seq, options)
    if (mvIndicies !== null) {
      for (let i = mvIndicies.slice(-1)[0]; i < history.length; i++) {
        if (null !== simpleSubsetMatch(history.slice(0, i), seq, options)) {
          return false
        }
      }
    }

    return !!mvIndicies
  }
}