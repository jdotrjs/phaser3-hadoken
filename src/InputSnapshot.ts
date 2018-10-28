import { SemanticInput } from "./Hadoken";

export type InputData = {
  pressed: number,
  frameAdded: boolean,
}

export type InputState = {
  [name: string]: InputData,
}

export type InputSnapshot = {
  timestamp: number,
  state: InputState,
}

export function sameKeys(s1: InputState, s2: InputState): boolean {
  const nkeys = Object.keys(s1)
  const okeys = Object.keys(s2)

  return !(
    nkeys.length !== okeys.length ||
    nkeys.some(k => okeys.indexOf(k) === -1)
  )
}

export function HasKey(s: InputSnapshot, key: SemanticInput): boolean {
  return !!s.state[key]
}

export function ReplaceKey(
  s: InputSnapshot,
  oldKey: SemanticInput,
  newKey: SemanticInput,
): InputSnapshot {
  const output = { timestamp: s.timestamp, state: { ...s.state } }
  if (!s.state[oldKey]) {
    return output
  }

  output.state[newKey] = s.state[oldKey]
  delete output.state[oldKey]

  return output
}

export function HasSameKeys(
  ss: InputSnapshot,
  other: InputSnapshot | InputState,
): boolean {
  const state = ss.state
  const otherState = other.state ? other.state : other

  const nkeys = Object.keys(state)
  const okeys = Object.keys(otherState)

  return !(
    nkeys.length !== okeys.length ||
    nkeys.some(k => okeys.indexOf(k) === -1)
  )
}

export function NewInputSnapshot(): InputSnapshot {
  return {
    timestamp: Date.now(),
    state: {},
  }
}