// TODO: rewrite for reduced dist size
import { difference } from 'lodash'

import { SemanticInput } from "./Hadoken"

export type InputData = {
  pressed: number,
}

// Maps input by name to tracked data about it
export type InputState = {
  [name: string]: InputData,
}

// Represents a single point at time and the state of any input
export type InputSnapshot = {
  timestamp: number,
  state: InputState,
}

/**
 * Returns true if a snapshot has a given key pressed
 */
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

export function NewInputs(oldSS: InputSnapshot, newSS: InputSnapshot): SemanticInput[] {
  const oldKeys = Object.keys(oldSS.state)
  const newKeys = Object.keys(newSS.state)
  return difference(newKeys, oldKeys)
}

export function RemovedInputs(oldSS: InputSnapshot, newSS: InputSnapshot): SemanticInput[] {
  const oldKeys = Object.keys(oldSS.state)
  const newKeys = Object.keys(newSS.state)
  return difference(oldKeys, newKeys)
}
