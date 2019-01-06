import {
  InputSnapshot,
  NewInputs,
  RemovedInputs,
  HasSameKeys,
} from './InputSnapshot'

import { FilterFn } from 'ph/Common/Filters'

export type SemanticInput = string

/**
 * Checks a given array of Inputs to determine if it matches some expected
 * pattern.
 *
 * It should return a tuple:
 *   [0] - a boolean indicating whether or not the input matched
 *   [1] - an untyped object that the matcher make use to return any necessary
 *         metadata about the match, or null if not used
 */
export type MatchFn = (history: InputSnapshot[]) => [boolean, object | null]

// Defines a move that Hadoken should understand
export type MoveDef = {
  name: string,
  match: MatchFn,
}

export type HadokenPipelineConfig = {
  // indicates how Hadoken should cull the input buffer. If 'depth' then
  // bufferLimit is the raw number of input states to store; if 'time' then
  // we will drop frames older than bufferLimit milliseconds
  bufferLimitType: 'depth' | 'time',

  // argument whose meaning is determined by bufferLimitType
  bufferLimit: number,

  // a collection of filters that will be applied to the raw input states to
  // collect the processed state which will be fed into the matchers
  filters?: FilterFn,

  // list of matchers that will be run in priority order, the first matcher
  // that returns true will result stop matching process
  matchers?: MoveDef[],
}

// A collection of events that Hadoken will emit
export const Events = {
  // Emited  when input state changes, i.e., when a key is pressed or released.
  // When InputUpdate is emited it will be paired with data of type
  // InputUpdateData.
  InputUpdate: 'inputupdate',

  // Emited when a move is matched against the recent input buffer. When Match
  // is emited it will be paired with data of type MatchData.
  Match: 'match',
}


export type InputUpdateData = {
  // The inputs that were added relative to the last frame
  add: SemanticInput[],

  // TODO: add boolean indicating if it was initial press (or add as specific
  // event that gets emitted)

  // the inputs that were removed relative to the last frame
  remove: SemanticInput[],
}

export type MatchData = {
  // the name of the move that was matched
  name: string,

  // If any metadata returned from the matcher it goes here. If the matcher
  // didn't return metadata this attribute is unset.
  meta?: object,
}

export type HadokenData<T extends HadokenPipelineConfig> = {
  scene: Phaser.Scene,
  config: T,
  sync: AdapterSyncFn<T> | null,

  emitter: Phaser.Events.EventEmitter,
  matchedMove: string | null,
  isPaused: boolean,

  rawHistory: InputSnapshot[],
  processedHistory: InputSnapshot[],
}

export type AdapterSyncFn<T extends HadokenPipelineConfig> =
  (data: HadokenData<T>) => void

// TODO: rewrite so that you can use multiple adapters per Hadoken
export abstract class Hadoken<T extends HadokenPipelineConfig, M> {
  hadokenData: HadokenData<T>
  emitter: Phaser.Events.EventEmitter

  constructor(
    parent: Phaser.Scene,
    cfg: T,
    sync: AdapterSyncFn<T> | null = null,
  ) {
    this.hadokenData = NewHadoken(parent, cfg, sync)
    this.emitter = this.hadokenData.emitter
  }

  pause() {
    HadokenPause(this.hadokenData)
  }

  resume() {
    HadokenResume(this.hadokenData)
  }

  clear() {
    HadokenDataClear(this.hadokenData)
  }

  pressed(): SemanticInput[] {
    if (this.hadokenData.processedHistory.length === 0) {
      return []
    }

    return Object.keys(this.hadokenData.processedHistory.slice(-1)[0].state)
  }

  /**
   * This changes the button mapping for the Hadoken implementation. It won't
   * impact any previously simpled inputs but all future data will be
   * interpreted using it.
   *
   * If the player was holding down a previously mapped button but is not post
   * remapping then it will appear as if the released the input.
   *
   * It's the responsibility of a particular Hadoken adapter implementation to
   * understand how to apply a remapping.
   *
   * @param {M} newMapping the new gamepad mapping that should be used for
   *   processing input
   */
  abstract remap(newMapping: M): void
}

export function NewHadoken<Cfg extends HadokenPipelineConfig>(
  scn: Phaser.Scene,
  cfg: Cfg,
  sync: AdapterSyncFn<Cfg> | null,
): HadokenData<Cfg> {
  const state = {
    scene: scn,
    config: cfg,
    sync,
    matchedMove: null,
    emitter: new Phaser.Events.EventEmitter(),
    isPaused: false,
    rawHistory: [],
    processedHistory: [],
  }
  scn.events.on('preupdate', mkHadokenUpdate(state))
  return state
}

/**
 * mkHadokenUpdate constructs the function that converts any raw inputs
 * collected since the list pass and applies any filters to them. It then
 * passes the current buffer of processed inputs through the move macher
 * collection.
 *
 * When a new input is added or removed Hadoken.Events.InputUpdate is emitted.
 * When an input update results in a move Hadoken.match Events.Match is emitted.
 *
 * @param {HadokenData<HadokenPipelineConfig>} ctx a Hadoken context
 */
function mkHadokenUpdate(ctx: HadokenData<HadokenPipelineConfig>): () => void {
  const checkMatch = (matched: [string, object | null], cur: MoveDef): [string, object | null] => {
    if (matched[0] !== '') {
      return matched
    }
    const [match, meta] = cur.match(ctx.processedHistory)
    return match ? [cur.name, meta] : matched
  }

  const maybeEmitUpdates = () => {
    if (ctx.processedHistory.length === 0) {
      return
    }

    const states = ctx.processedHistory.slice(-2)
    const [prev, cur] = states.length < 2
      ? [{ timestamp: 0, state: {} }, states[0]]
      : states

    const newKeys = NewInputs(prev, cur)
    const remKeys = RemovedInputs(prev, cur)

    if (newKeys.length || remKeys.length) {
      ctx.emitter.emit(Events.InputUpdate, {
        add: newKeys,
        removed: remKeys,
      })
    }
  }

  const processMatchResults = (matchResult: [string, object | null]) => {
    if (matchResult !== null && matchResult[0] !== '') {
      const meta = matchResult[1] ? { meta: matchResult[1] } : null
      ctx.matchedMove = matchResult[0]
      ctx.emitter.emit(Events.Match, { name: matchResult[0], ...meta })
    }
  }

  return () => {
    if (ctx.sync) {
      ctx.sync(ctx)
    }

    ctx.matchedMove = null

    // TODO: if raw history exceeds processed history be > 1 frame it suggests
    // multiple input events within a 1-frame period; should we collapse these
    // into a single processed frame?
    for (
      let i = ctx.processedHistory.length;
      i < ctx.rawHistory.length;
      i++
    ) {
      const state = ctx.rawHistory[i]
      const filters = ctx.config.filters
      const filtered = filters ? filters(state) : state
      ctx.processedHistory.push(filtered)

      const matchers = ctx.config.matchers || []

      if (!ctx.isPaused) {
        maybeEmitUpdates()
        processMatchResults(matchers.reduce(checkMatch, ['', null]))
      }
    }
    maybeCullHistory(ctx)
  }
}

// TODO: history culling isn't well tested yet (both the actual function and
// also the implication that now history may be empty instead of always having
// at lesat one frame)
function maybeCullHistory(ctx: HadokenData<HadokenPipelineConfig>) {
  const limit = ctx.config.bufferLimit
  const rhLen = ctx.rawHistory.length
  if (ctx.config.bufferLimitType === 'depth') {
    const remove = rhLen - limit
    if (remove > 0) {
      ctx.rawHistory = ctx.rawHistory.slice(remove)
      ctx.processedHistory = ctx.processedHistory.slice(remove)
    }
  } else {
    const now = Date.now()
    let marker = 0
    for (; marker < rhLen; marker++) {
      if (now - ctx.rawHistory[marker].timestamp < limit) {
        break
      }
    }
    if (marker !== 0) {
      ctx.rawHistory = ctx.rawHistory.slice(marker)
      ctx.processedHistory = ctx.processedHistory.slice(marker)
    }
  }
}

/**
 * Processes a new adapter state for potentially several state changes at once.
 * This is used so that we can create a new record of change when more than
 * one input state has been updated since the last time we were able to check
 * the adapter.
 *
 * A concrete reason we might use this is if we have to poll an adapter for
 * input state (e.g. the gamepad) vs listening for adapter events (e.g.
 * keyboard).
 *
 * The hadoken context is mutated as a result of this update
 *
 * @param {HadokenData<HadokenPipelineConfig>} ctx the underlying data object
 *   for Hadoken that is used to track input state; this will be mutated as
 *   a result of calling batch update
 * @param {SemanticInput[]} keysAdded newly engaged inputs
 * @param {SemanticInput[]} keysRemoved things that are no longer being pressed
 * @param {number} ts an adapter sourced timestamp to track when this reading
 *   was taken
 */
export function MaybeBatchUpdate(
  ctx: HadokenData<HadokenPipelineConfig>,
  keysAdded: SemanticInput[],
  keysRemoved: SemanticInput[],
  ts: number,
) {
  if (ctx.isPaused) {
    return
  }

  const now = Date.now()

  const hasHistory = ctx.rawHistory.length > 0

  const lastState = hasHistory
    ? ctx.rawHistory.slice(-1)[0]
    : { timestamp: now - 1, state: {} }

  const newSnapshot: InputSnapshot = keysAdded.reduce(
    (acc, cur) => ({
      timestamp: acc.timestamp,
      state: {
        [cur]: { pressed: ts },
        ...acc.state,
      }
    }),
    { timestamp: now, state: { ...lastState.state } },
  )
  keysRemoved.forEach(k => {
    // if another source adds a key then go ahead and let that preempt removal
    if (keysAdded.indexOf(k) === -1) {
      delete newSnapshot.state[k]
    }
  })

  if (!HasSameKeys(newSnapshot, lastState)) {
    ctx.rawHistory.push(newSnapshot)
  }
}

/**
 * Adds a key to the hadoken context with some timestamp if it was not already
 * considered pressed. If the key had already been added and not removed then
 * no change is made.
 */
export function MaybeAddKey(ctx: HadokenData<HadokenPipelineConfig>, key: SemanticInput, ts: number) {
  MaybeBatchUpdate(ctx, [key], [], ts)
}

/**
 * If a key was previously thought to be pressed this will remove it from a
 * pressed state in the hadoken context. If the key was not considered pressed
 * no change will be made.
 */
export function MaybeRemoveKey(ctx: HadokenData<HadokenPipelineConfig>, key: SemanticInput) {
  MaybeBatchUpdate(ctx, [], [key], Date.now())
}

export function HadokenPause(data: HadokenData<HadokenPipelineConfig>) {
  data.isPaused = true
}

export function HadokenResume(data: HadokenData<HadokenPipelineConfig>) {
  data.isPaused = false
}

export function HadokenDataClear(data: HadokenData<HadokenPipelineConfig>) {
  data.rawHistory = []
  data.processedHistory = []
}

/**
 * Returns the keys that are pressed in the most recent state.
 */
export function curKeys(
  ctx: HadokenData<HadokenPipelineConfig>,
  processed: boolean = true,
): SemanticInput[] {
  const history = processed ? ctx.processedHistory : ctx.rawHistory
  return history.length > 0
    ? Object.keys(history.slice(-1)[0].state)
    : []
}