import {
  InputSnapshot,
  NewInputSnapshot,
  HasSameKeys,
} from './InputSnapshot'

export type SemanticInput = string
export type CoalesseFn = (input: InputSnapshot, timestamp: number) => InputSnapshot
export type FilterFn = (input: InputSnapshot) => InputSnapshot
export type MatchFn = (history: [InputSnapshot]) => void

export type HadokenPipelineConfig = {
  bufferLimitType: 'depth' | 'time',
  bufferLimit: number,
  coalesseFn?: CoalesseFn,
  filters?: FilterFn,
  matchFn?: MatchFn,
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
  rawHistory: InputSnapshot[],
  processedHistory: InputSnapshot[],
}

export function NewHadoken<Cfg extends HadokenPipelineConfig>(
  scn: Phaser.Scene,
  cfg: Cfg,
): Hadoken<Cfg> {
  return {
    scene: scn,
    config: cfg,
    rawHistory: [NewInputSnapshot()],
    processedHistory: [],
  }
}