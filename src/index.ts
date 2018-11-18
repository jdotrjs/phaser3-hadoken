import { Events, InputUpdateData, MatchData } from 'ph/Hadoken'
// TODO: index should resolve automatically...
import * as Keyboard from 'ph/Keyboard/index'
import * as Filters from "ph/Common/Filters"
import * as SimpleMatcher from 'ph/Common/SimpleMatcher'

const c = Phaser.Input.Keyboard.KeyCodes

const keymapArrows = {
  [c.DOWN]:  'down',
  [c.UP]:    'up',
  [c.RIGHT]: 'right',
  [c.LEFT]:  'left',
}

const DPAD_COMBINATIONS: Filters.CoalesseMapping = {
  'down+left':  ['down', 'left' ],
  'down+right': ['down', 'right'],
  'up+left':    ['up',   'left' ],
  'up+right':   ['up',   'right'],
}

const keymapDvorak = {
  [c.A]: 'punch:light',
  [c.O]: 'punch:hard',
  [c.E]: 'kick:light',
  [c.U]: 'kick:hard',
  [c.I]: 'guard',
}
const keymapQwerty = {
  [c.A]: 'punch:light',
  [c.S]: 'punch:hard',
  [c.D]: 'kick:light',
  [c.F]: 'kick:hard',
  [c.G]: 'guard',
}

const DIRECTIONS = [
  'up',
  'up+forward',
  'forward',
  'down+forward',
  'down',
  'down+backward',
  'backward',
  'up+backward',
]
const QFC = ['down', 'down+forward', 'forward']
const QBC = ['down', 'down+backward', 'backward']
const SS = [
  'down+forward',
  'up+backward',
  'forward',
  'down',
  'down+forward',
  'down+backward',
]
const PUNCHES = ['punch:light', 'punch:hard']
const KICKS = ['kick:light', 'kick:hard']


class Scene1 extends Phaser.Scene {
  hadoken: Keyboard.KeyboardHadoken
  facing: 'right' | 'left'
  boxG: Phaser.GameObjects.Image[]

  constructor() {
    super('scene1')
    this.facing = 'right'
  }


  create() {
    this.hadoken = new Keyboard.KeyboardHadoken(this, {
        bufferLimitType: 'time',
        bufferLimit: 5000,
        keymapFn: Keyboard.NewSimpleMapper({ ...keymapArrows, ...keymapDvorak }),
        filters: Filters.NewChain(
          Filters.CoalesseInputs(DPAD_COMBINATIONS),
          Filters.MapToFacing(() => this.facing),
          Filters.OnlyMostRecent(DIRECTIONS),
          Filters.OnlyMostRecent([...PUNCHES, ...KICKS]),
        ),
        matchers: [
          {
            name: 'hadoken',
            match: SimpleMatcher.New([...QFC, 'punch:light']),
          },
          {
            name: 'huricane_kick',
            match: SimpleMatcher.New([...QBC, 'kick:light']),
          },
          {
            name: 'summon_suffering',
            match: SimpleMatcher.New(
              [...SS, 'punch:light', 'guard'],
              { stepDelay: 800, totalDelay: 6000 },
            ),
          }
        ],
      },
    )

    const boxesCount = 12
    const boxWidth = 64
    const boxBorder = 12
    const ch = this.cameras.main.height
    const cw = this.cameras.main.width

    this.boxG = []
    for (let i = 0; i < boxesCount; i++) {
      this.boxG.push(
        this.add.image(0, 0, ''),
      )
    }

    this.hadoken.emitter.on(Events.InputUpdate, (data: InputUpdateData) => {
      // console.log(data.add)
    })

    this.hadoken.emitter.on(Events.Match, (data: MatchData) => {
      console.log(`matched: ${data.name}`)
    })
  }
}

let phaserConfig = {
  type: Phaser.AUTO,
  parent: 'phaser-display',
  backgroundColor: '0x9a9a9a',
  width: 800,
  height: 600,
  scene: [ Scene1 ],
  input: {
    gamepad: true,
  }
}

new Phaser.Game(phaserConfig)