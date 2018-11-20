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
  keymap: 'dvorak' | 'qwerty'
  lastMatched: Phaser.GameObjects.Text | null
  boxG: Phaser.GameObjects.Image[][]
  displayCount: number

  constructor() {
    super('scene1')
    this.facing = 'right'
    this.keymap = 'qwerty'
  }

  preload() {
    ['1', '2', '3', '4', '6', '7', '8', '9', 'punch', 'punch_hard', 'kick', 'kick_hard', 'guard'].forEach(n => {
      this.load.image(`input_${n}`, `./assets/${n}.png`)
    })
  }

  create() {
    const dvorakMapper = Keyboard.NewSimpleMapper({ ...keymapArrows, ...keymapDvorak })
    const qwertykMapper = Keyboard.NewSimpleMapper({ ...keymapArrows, ...keymapQwerty })
    this.hadoken = new Keyboard.KeyboardHadoken(this, {
      bufferLimitType: 'time',
      bufferLimit: 5000,
      keymapFn: code => this.keymap === 'dvorak'
        ? dvorakMapper(code)
        : qwertykMapper(code),
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

    this.controls = []
    const txtCfg = { fontFamily: "Impact, ArialBlack", fontSize: 35, color: '#3300cc', align: 'center' }
    const col1 = cw / 3
    const col2 = cw / 2
    const col3 = 2 /3 * cw
    this.controls.push(this.add.text(col1, 0, ' : A', txtCfg))
    const row1 = this.controls[0].height
    this.controls[0].setY(row1)
    const row2 = row1 +this.controls[0].height + 4
    this.controls.push(this.add.text(col1, row2, ' : S', txtCfg))
    this.controls.push(this.add.text(col2, row1, ' : D', txtCfg))
    this.controls.push(this.add.text(col2, row2, ' : F', txtCfg))
    this.controls.push(this.add.text(col3, row1 + (row2 - row1) / 2, ' : G', txtCfg))

    const offset = this.controls[0].width
    const sz = this.controls[0].height

    this.add.image(col1 - offset, row1, 'input_punch').setDisplaySize(sz, sz).setOrigin(0)
    this.add.image(col2 - offset, row1, 'input_punch_hard').setDisplaySize(sz, sz).setOrigin(0)
    this.add.image(col1 - offset, row2, 'input_kick').setDisplaySize(sz, sz).setOrigin(0)
    this.add.image(col2 - offset, row2, 'input_kick_hard').setDisplaySize(sz, sz).setOrigin(0)
    this.add.image(col3 - offset, row1 + (row2 - row1) / 2, 'input_guard').setDisplaySize(sz, sz).setOrigin(0)

    this.hadoken.emitter.on(Events.Match, this.matchMove, this)
  }

  controls: Phaser.GameObjects.Text[]

  matchMove(data: MatchData) {
    if (this.lastMatched) {
      this.lastMatched.setVisible(false)
    }

    const ch = this.cameras.main.height
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
      'up+forward': '9',
      'punch:light': 'punch',
      'punch:hard': 'punch_hard',
      'kick:light': 'kick',
      'kick:hard': 'kick_hard',
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

  drawKeymap() {

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

const game = new Phaser.Game(phaserConfig)

export function selectKeymap(newmap: 'qwerty' | 'dvorak') {
  const scn = <Scene1>game.scene.getScene('scene1')
  scn.keymap = newmap

  const nowQwerty = newmap === 'qwerty'
  const letters = nowQwerty
    ? ['A', 'S', 'D', 'F', 'G']
    : ['A', 'O', 'E', 'U', 'I']
  letters.forEach((l, i) => { scn.controls[i].setText(` : ${l}`) })

  const qwEle = <HTMLElement>document.getElementById('keymap-qwerty')
  qwEle.className = 'selectable' + (nowQwerty ? ' selected_keymap' : '')

  const dvEle = <HTMLElement>document.getElementById('keymap-dvorak')
  dvEle.className  = 'selectable' + (nowQwerty ? '' : ' selected_keymap')

}
