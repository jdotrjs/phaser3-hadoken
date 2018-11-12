import {
  InputSnapshot,
  NewInputSnapshot,
  NewInputs,
  RemovedInputs,
  HasSameKeys,
} from './InputSnapshot'


export type SemanticInput = string
export type CoalesseFn = (input: InputSnapshot, timestamp: number) => InputSnapshot
export type FilterFn = (input: InputSnapshot) => InputSnapshot
export type MatchFn = (history: InputSnapshot[]) => [boolean, object | null]
export type MoveList = {
  name: string,
  match: MatchFn
}

export type HadokenPipelineConfig = {
  bufferLimitType: 'depth' | 'time',
  bufferLimit: number,
  coalesseFn?: CoalesseFn,
  filters?: FilterFn,
  matchers?: MoveList[],
}

export type InputUpdateData = {
  add: SemanticInput[],
  remove: SemanticInput[],
}

export type MatchData = {
  name: string,
  meta?: object,
}

export const Events = {
  InputUpdate: 'inputupdate',
  Match: 'match',
}

export function filterChain(...filters: FilterFn[]): FilterFn {
  return (input: InputSnapshot) => filters.reduce(
    (acc, nextFn) => nextFn(acc),
    input,
  )
}

export type Hadoken<T extends HadokenPipelineConfig> = {
  scene: Phaser.Scene,
  config: T,
  emitter: Phaser.Events.EventEmitter,

  rawHistory: InputSnapshot[],
  processedHistory: InputSnapshot[],
}

export function NewHadoken<Cfg extends HadokenPipelineConfig>(
  scn: Phaser.Scene,
  cfg: Cfg,
): Hadoken<Cfg> {
  const state = {
    scene: scn,
    config: cfg,
    emitter: new Phaser.Events.EventEmitter(),
    rawHistory: [NewInputSnapshot()],
    processedHistory: [],
  }
  scn.events.on('preupdate', mkHadokenUpdate(state))
  return state
}

function last<T>(arr: T[]): T | null {
  if (!arr.length) {
    return null
  }

  return arr.slice(-1)[0]
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
 * @param ctx a Hadoken context
 */
function mkHadokenUpdate(ctx: Hadoken<HadokenPipelineConfig>): () => void {
  const checkMatch = (matched: [string, object | null], cur: MoveList): [string, object | null] => {
    if (matched[0] !== '') {
      return matched
    }
    const [match, meta] = cur.match(ctx.processedHistory)
    return match ? [cur.name, meta] : matched
  }

  const maybeEmitUpdates = () => {
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

  const maybeEmitMatched = (matchResult: [string, object | null]) => {
    if (matchResult[0] !== '') {
      const meta = matchResult[1] ? { meta: matchResult[1] } : null
      ctx.emitter.emit(Events.Match, { name: matchResult[0], ...meta })
    }
  }

  const noopCoalesse = function (e: InputSnapshot): InputSnapshot { return e }

  return () => {
    const coalesse = ctx.config.coalesseFn || noopCoalesse
    // TODO: if raw history exceeds processed history be > 1 frame it suggests
    // multiple input events within a 1-frame period; should we collapse these
    // into a single processed frame?
    for (
      let i = ctx.processedHistory.length;
      i < ctx.rawHistory.length;
      i++
    ) {
      const state = ctx.rawHistory[i]
      const coalessed = coalesse(state, state.timestamp)
      const filters = ctx.config.filters
      const filtered = filters ? filters(coalessed) : coalessed
      ctx.processedHistory.push(filtered)


      const matchers = ctx.config.matchers || []

      maybeEmitUpdates()
      maybeEmitMatched(matchers.reduce(checkMatch, ['', null]))
    }
  }
}

/**
 * Adds a key to the hadoken context with some timestamp if it was not already
 * considered pressed. If the key had already been added and not removed then
 * no change is made.
 */
export function maybeAddKey(ctx: Hadoken<HadokenPipelineConfig>, key: SemanticInput, ts: number) {
  const now = Date.now()

  const lastState = ctx.rawHistory.slice(-1)[0]
  const newSnapshot = {
    timestamp: now,
    state: {
      [key]: { pressed: ts },
      ...lastState.state,
    }
  }

  if (!HasSameKeys(newSnapshot, lastState)) {
    ctx.rawHistory.push(newSnapshot)
  }
}

/**
 * If a key was previously thought to be pressed this will remove it from a
 * pressed state in the hadoken context. If the key was not considered pressed
 * no change will be made.
 */
export function maybeRemoveKey(ctx: Hadoken<HadokenPipelineConfig>, key: SemanticInput) {
  const lastSnapshot = ctx.rawHistory.slice(-1)[0]
  const state = { ...lastSnapshot.state }
  delete state[key]

  if (!HasSameKeys(lastSnapshot, state)) {
    const newState: InputSnapshot = {
      timestamp: Date.now(),
      state,
    }
    ctx.rawHistory.push(newState)
  }
}

/**
 * Returns the keys that are pressed in the most recent state.
 */
export function curKeys(ctx: Hadoken<HadokenPipelineConfig>, processed: boolean = true): SemanticInput[] {
  const history = processed ? ctx.processedHistory : ctx.rawHistory
  return Object.keys(history.slice(-1)[0].state)
}