import { InputSnapshot, InputState, HasKey } from 'ph/InputSnapshot'
import { MatchFn, SemanticInput } from 'ph/Hadoken'

type MatchPredicate = (input: InputState) => boolean
type MoveName = string

type MoveDef = {
  name: string,
  inputToleranceMS?: number,
  sequence: (SemanticInput | MatchPredicate)[],
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

const QFC = ['down', 'down+forward', 'forward']
const QBC = ['down', 'down+backward', 'backward']
const SS = [
  'down+forward',
  'up+back',
  'forward',
  'down',
  'down+forward',
  'down+back',
  multiKey(
    oneClass('punch'),
    noClass('kick'),
    'guard',
  ),
]

export function NoopMatch(): void {}

export const simpleMoveList: MoveList = [
  {
    name: 'summon_suffering',
    inputToleranceMS: 16 * 50,
    sequence: SS,
  },
  {
    name: 'hadoken',
    sequence: [...QFC, oneClass('punch')],
  },
  {
    name: 'huricane_kick',
    sequence: [...QBC, oneClass('kick')],
  },
]

function matchInput(state: InputState, matcher: SemanticInput | MatchPredicate, reqFrame: boolean): boolean {
  if (typeof matcher === 'string') {
    return !!state[matcher] &&
      Object.keys(state).length === 1 &&
      (!reqFrame || state[matcher].frameAdded)
  }
  return matcher(state)
}

export function NewMatcher(moves: MoveList, defaultToleranceMS: number = 2): MatchFn {
  const moveList = moves.reduce(
    (acc: MoveList, cur: MoveDef) => {
      const sequence = [...cur.sequence]
      sequence.reverse()
      return [
        ...acc,
        { name: cur.name, sequence },
      ]
    },
    [],
  )

  return function(input: InputSnapshot[]): void {
    console.log(input)
    const lastInput = input.slice(-1)[0]
    const matchedMove = moveList.reduce((matched, tgtMove) => {
      if (matched !== '') {
        return matched
      }

      const tolerance = tgtMove.inputToleranceMS || defaultToleranceMS
      const { sequence } = tgtMove
      let lastMatch = 0

      // Check to see if we're at the end of this move; if not then it's not worth checking anything else
      if (!matchInput(lastInput.state, sequence[0], true)) {
        return ''
      } else {
        lastMatch = lastInput.timestamp
        if (input.length === 1) {
          return tgtMove.name
        }
      }

      let i = 1
      let j = input.length - 2
      for (; i < sequence.length; i++) {
        for (; j >= 0; j--) {
          if (matchInput(input[j].state, sequence[i], false)) {
            const newMatchTS = input[j].timestamp
            if (lastMatch - newMatchTS <= tolerance) {
              lastMatch = newMatchTS
            }
          }
        }
      }

      if (i === sequence.length) {
        return tgtMove.name
      }

      return ''
    }, '')

    if (matchedMove !== '') {
      const str: string[] = []
      input.forEach(i => {
        str.push(Object.keys(i.state).join(', '))
      })
      console.log(str.join(' / '))
      console.log(`${Date.now()} - matched ${matchedMove}`)
    }
  }
}