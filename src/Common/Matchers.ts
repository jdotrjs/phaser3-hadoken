/*
// TODO: revisit this file

import { InputSnapshot, InputState, NewInputs } from 'ph/InputSnapshot'
import { MatchFn, SemanticInput } from 'ph/Hadoken'

export type MatchPredicate = (input: InputState) => boolean

export type MoveDef = {
  name: string,
  inputToleranceMS?: number,
  moveMatcher: MatchFn,
}

// Priority ordered series of move definitions
export type MoveList = MoveDef[]

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

export function NKeys(input: SemanticInput[]): InputPredicate {
  return function() { return false }
}
*/