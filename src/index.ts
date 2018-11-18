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
const ATTACKS = [...PUNCHES, ...KICKS]


class Scene1 extends Phaser.Scene {
  hadoken: Keyboard.KeyboardHadoken
  facing: 'right' | 'left'
  lastMatched: Phaser.GameObjects.Text | null
  boxG: Phaser.GameObjects.Image[][]
  displayCount: number

  constructor() {
    super('scene1')
    this.facing = 'right'
  }

  preload() {
    ['1', '2', '3', '4', '6', '7', '8', '9', 'punch', 'kick', 'guard'].forEach(n => {
      this.load.image(`input_${n}`, `./assets/${n}.png`)
    })
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
        Filters.OnlyMostRecent(ATTACKS),
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
    })

    const ch = this.cameras.main.height
    const cw = this.cameras.main.width
    this.displayCount = 12
    const boxesCount = this.displayCount
    const boxBorder = 12
    const bb2 = boxBorder / 2
    const offsetX = 40
    const offsetY = 3/5 * ch
    const boxWidth = (cw - boxesCount * boxBorder - 2 * offsetX) / 12
    const boxHeight = boxWidth
    this.lastMatched = null

    this.boxG = []
    for (let i = 0; i < boxesCount; i++) {
      this.boxG.push([])
      for (let j = 0; j < 3; j++) {
        const bx = offsetX + i * ((i === 0 ? bb2 : boxBorder) + boxWidth)
        const by = offsetY + j * (boxHeight + bb2)
        const img = this.add.image(bx, by, 'input_6')
        img.setOrigin(0)
        img.setDisplaySize(boxWidth, boxHeight)
        this.boxG[i].push(img)
      }
    }

    this.hadoken.emitter.on(Events.Match, (data: MatchData) => {
      if (this.lastMatched) {
        this.lastMatched.setVisible(false)
      }

      const txt = this.add.text(
        0,
        ch / 3,
        data.name,
        { fontFamily: "Impact, ArialBlack", fontSize: 74, color: '#3300cc', align: 'center' },
      )

      this.lastMatched = txt
      txt.setShadow(2, 2, "#333333", 2, true, true)
      txt.setOrigin(0)
      txt.setX(this.cameras.main.width / 2 - (txt.width / 2))

      this.add.tween({
        targets: txt,
        alpha: 0,
        delay: 500,
        duration: 1200,
        ease: 'Power2',
      })
    })
  }

  drawInputHistory() {
    const nameMapping : { [n: string]: string }= {
      'down+backward': '1',
      'down': '2',
      'down+forward': '3',
      'backward': '4',
      'forward': '6',
      'up+backward': '7',
      'up': '8',
      'up+forward': '8',
      'punch:light': 'punch',
      'punch:hard': 'punch',
      'kick:light': 'kick',
      'kick:hard': 'kick',
      'guard': 'guard',
    }
    const history = this.hadoken.hadokenData.processedHistory.filter(h => Object.keys(h.state).length).slice(-1 * this.displayCount)
    let i = 0
    for (; i < history.length; i++) {
      const state = history[i].state
      const inputs = Object.keys(state)
      const col = this.boxG[i]
      if (inputs.length > 3) {
        console.error(`inputs > 3: [${inputs.join(', ')}]`)
      }
      const directions = DIRECTIONS.filter(i => inputs.indexOf(i) !== -1)
      const attacks = ATTACKS.filter(i => inputs.indexOf(i) !== -1)
      const guard = inputs.indexOf('guard') == -1 ? [] : ['guard']
      let j = 0
      if (directions.length) {
        col[j].setTexture(`input_${nameMapping[directions[0]]}`)
        col[j].setVisible(true)
        j++
      }
      if (attacks.length) {
        col[j].setTexture(`input_${nameMapping[attacks[0]]}`)
        col[j].setVisible(true)
        j++
      }
      if (guard.length) {
        col[j].setTexture(`input_${nameMapping[guard[0]]}`)
        col[j].setVisible(true)
        j++
      }
      for (; j < 3; j++) {
        col[j].setVisible(false)
      }
    }
    for (; i < this.displayCount; i++) {
      for (let j = 0; j < 3; j++) {
        this.boxG[i][j].setVisible(false)
      }
    }
  }

  update() {
    this.drawInputHistory()
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