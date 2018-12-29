import { InputSnapshot, HasKey } from 'ph/InputSnapshot'
import { InputCheck, InputPredicate } from 'ph/Common/SimpleMatcher'

// Checks to see of there is exactly one input with a given prefix
export function OneWithPrefix(n: string): InputPredicate {
  return function (ss: InputSnapshot[], idx: number): boolean {
    const state = ss[idx].state
    return Object.keys(state).filter(i => i.indexOf(n) === 0).length === 1
  }
}

// Verifies no input is pressed with the given prefix
export function NoneWithPrefix(n: string): InputPredicate {
  return function (input: InputSnapshot[], idx: number): boolean {
    const state = input[idx].state
    return Object.keys(state).filter(i => i.indexOf(n) === 0).length === 0
  }
}

// Ensure that all the provided matches return true
export function All(...matchers: InputCheck[]): InputPredicate {
  return (input: InputSnapshot[], idx: number): boolean =>
    matchers.reduce(
      (acc, cur) => {
        if (!acc) { return false }
        return typeof cur === 'string'
          ? HasKey(input[idx], cur)
          : cur(input, idx)
      },
      true,
    )
}