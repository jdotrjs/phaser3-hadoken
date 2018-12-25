import { Events, Hadoken as HadokenBase, MatchData, HadokenPipelineConfig } from 'ph/Hadoken'
import * as Keyboard from 'ph/Adapters/Keyboard'
import * as Gamepad from 'ph/Adapters/Gamepad'
import * as Filters from "ph/Common/Filters"
import { isStandardMapping } from './Common/Gamepad';
import * as KeyboardCommon from 'ph/Common/Keyboard'
import * as SimpleMatcher from 'ph/Common/SimpleMatcher'
import * as Cfg from 'ph/ExampleConfig'

class Scene1 extends Phaser.Scene {
  // --- The following three attributes are related to hadoken ---
  // reference to the hadoken library
  hadoken: HadokenBase<HadokenPipelineConfig> | null

  // TODO: update docs now that I'm swapping between gamepads
  gph: Gamepad.Hadoken | null
  kbh: Keyboard.Hadoken | null

  // indicates which direction the character is facing (so that "forward"
  // means something reasonable)
  facing: 'right' | 'left'
  // which keymap do we want to use for attacks
  keymap: 'dvorak' | 'qwerty'

  // -- The remainder are used to build the demo interface ---

  // reference to the last matched move being displayed
  lastMatched: Phaser.GameObjects.Text | null

  // grid of images that will be used to display key inputs
  boxG: Phaser.GameObjects.Image[][]

  // letters that map to the attack input
  controls: Phaser.GameObjects.Text[]

  // how many steps of input we display
  displayCount: number

  constructor() {
    super('scene1')
    this.facing = 'right'
    this.keymap = 'qwerty'
    this.displayCount = 12
    this.hadoken = null
    this.kbh = null
    this.gph = null
  }

  preload() {
    ['1', '2', '3', '4', '6', '7', '8', '9', 'punch', 'punch_hard', 'kick', 'kick_hard', 'guard'].forEach(n => {
      this.load.image(`input_${n}`, `./assets/${n}.png`)
    })
  }

  create() {
    this._constructUI()
    this._connectKB()
    this.g = this.add.graphics()
    this.g.lineStyle(3, 0xff0000)
    this.at = this.add.text(20, 70, '')
  }

  _connectPad() {
    if (this.kbh !== null) {
      this.kbh.pause()
    }

    if (this.gph !== null) {
      this.hadoken = this.gph
      this.hadoken.resume()
      return
    }

    const ch = this.cameras.main.height
    const txt = this.add.text(
      0,
      ch / 2,
      'Waiting for Gamepad',
      { fontFamily: "Impact, ArialBlack", fontSize: 50, color: '#3300cc', align: 'center' },
    )
    txt.setX(this.cameras.main.width / 2 - txt.width / 2)
    txt.setY(ch / 2 - txt.height / 2)

    const tween = this.add.tween({
      targets: txt,
      alpha: .4,
      duration: 500,
      easy: 'Power2',
      repeat: -1,
      yoyo: -1,
    })

    const attach = (pad: Phaser.Input.Gamepad.Gamepad) => {
      tween.stop()
      txt.destroy()

      console.log(pad)
      if (!isStandardMapping(pad)) {
        alert('Gamepad + browser combination does not support standard mapping')
        selectInput('keyboard')
        return
      }

      this.gph = new Gamepad.Hadoken(this, {
        bufferLimitType: 'time',
        bufferLimit: 5000,
        gamepad: pad,
        buttonMap: Cfg.GamepadInputs,
        filters: Filters.NewChain(
          // convert two directional inputs into a diagonal, if applicable
          Filters.CoalesseInputs(Cfg.DPAD_COMBINATIONS),
          // change formats from right/left to forward/backward based on the
          // player's facing
          Filters.MapToFacing(() => this.facing),
          // only accept the most recent direction
          Filters.OnlyMostRecent(Cfg.DIRECTIONS),
          // and the most recent attack
          Filters.OnlyMostRecent(Cfg.ATTACKS),
        ),
        // defines a set of moves to register
        matchers: [
          { name: 'hadoken', match: SimpleMatcher.New(Cfg.HADOKEN), },
          { name: 'huricane_kick', match: SimpleMatcher.New(Cfg.HURICANE_KICK), },
          {
            name: 'summon_suffering',
            match: SimpleMatcher.New(Cfg.SS, { stepDelay: 800, totalDelay: 6000 }),
          }
        ],
      })

      // hadoken will emit a match event when a move's input sequence is matched
      this.gph.emitter.on(Events.Match, this._onMoveMatched, this)
      this.hadoken = this.gph
    }

    if (this.input.gamepad.total > 0) {
      attach(this.input.gamepad.pad1)
    } else {
      this.input.gamepad.once('connected', attach)
    }
  }

  _connectKB() {
    if (this.gph !== null) {
      this.gph.pause()
    }

    if (this.kbh !== null) {
      this.hadoken = this.kbh
      this.hadoken.resume()
      return
    }

    const dvorakMapper = KeyboardCommon.NewSimpleMapper(Cfg.DVORAK_LAYOUT)
    const qwertykMapper = KeyboardCommon.NewSimpleMapper(Cfg.QWERTY_LAYOUT)

    this.kbh = new Keyboard.Hadoken(this, {
      bufferLimitType: 'time',
      bufferLimit: 5000,
      keymapFn: code => this.keymap === 'dvorak'
        ? dvorakMapper(code)
        : qwertykMapper(code),
      filters: Filters.NewChain(
        // convert two directional inputs into a diagonal, if applicable
        Filters.CoalesseInputs(Cfg.DPAD_COMBINATIONS),
        // change formats from right/left to forward/backward based on the
        // player's facing
        Filters.MapToFacing(() => this.facing),
        // only accept the most recent direction
        Filters.OnlyMostRecent(Cfg.DIRECTIONS),
        // and the most recent attack
        Filters.OnlyMostRecent(Cfg.ATTACKS),
      ),
      // defines a set of moves to register
      matchers: [
        { name: 'hadoken', match: SimpleMatcher.New(Cfg.HADOKEN), },
        { name: 'huricane_kick', match: SimpleMatcher.New(Cfg.HURICANE_KICK), },
        {
          name: 'summon_suffering',
          match: SimpleMatcher.New(Cfg.SS, { stepDelay: 800, totalDelay: 6000 }),
        }
      ],
    })

    // hadoken will emit a match event when a move's input sequence is matched
    this.kbh.emitter.on(Events.Match, this._onMoveMatched, this)
    this.hadoken = this.kbh
  }

  g: Phaser.GameObjects.Graphics
  at: Phaser.GameObjects.Text

  _constructUI() {
    const ch = this.cameras.main.height
    const cw = this.cameras.main.width
    const boxesCount = this.displayCount
    const boxBorder = 12
    const bb2 = boxBorder / 2
    const offsetX = 40
    const offsetY = 3/5 * ch
    const boxWidth = (cw - boxesCount * boxBorder - 2 * offsetX) / boxesCount
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
    const row1 = this.controls[0].height / 2
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
  }

  _onMoveMatched(data: MatchData) {
    if (this.lastMatched) {
      this.lastMatched.setVisible(false)
    }

    const ch = this.cameras.main.height
    const txt = this.add.text(
      0,
      ch / 3,
      data.name,
      { fontFamily: "Impact, ArialBlack", fontSize: 64, color: '#3300cc', align: 'center' },
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

    if (this.hadoken !== null) {
      const hData = this.hadoken.hadokenData
      const m = data.meta as {indicies: number[]}
      m.indicies.forEach(idx => {
        const state = hData.processedHistory[idx].state
        console.log(`  ${idx} => [${Object.keys(state).join(', ')}]`)
      })
    }
  }

  _drawInputHistory() {
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

    this.at.setText('')
    if (this.g) { this.g.clear() }
    if (this.g && this.hadoken instanceof Gamepad.Hadoken) {
      this.g.lineStyle(2, 0xff0000, 1)
      this.g.strokeCircle(40, 40, 25)
      const stickData = this.hadoken.analogData.stick
      const { angle, value } = stickData['left-stick'] || { angle: 0, value: 0 }
      const angleRad = angle / 57.295827

      const x2 = (value * 25) * Math.cos(angleRad) + 40
      const y2 = (value * 25) * Math.sin(angleRad) + 40

      this.g.lineStyle(2, 0xff0000, 1)
      this.g.strokeLineShape(new Phaser.Geom.Line(40, 40, x2, y2))
      this.at.setText(`${angle}\n${value}`)
    }

    const history = this.hadoken !== null
      ? this.hadoken.hadokenData.processedHistory.filter(h => Object.keys(h.state).length).slice(-1 * this.displayCount)
      : []

    let i = 0
    for (; i < history.length; i++) {
      const state = history[i].state
      const inputs = Object.keys(state)
      const col = this.boxG[i]
      if (inputs.length > 3) {
        console.error(`inputs > 3: [${inputs.join(', ')}]`)
      }
      const directions = Cfg.DIRECTIONS.filter(i => inputs.indexOf(i) !== -1)
      const attacks = Cfg.ATTACKS.filter(i => inputs.indexOf(i) !== -1)
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

  switchInputTo(typ: string) {
    if (typ === 'keyboard') {
      this._connectKB()
    }

    if (typ === 'gamepad') {
      this._connectPad()
    }
  }

  update() {
    this._drawInputHistory()
    if (this.hadoken && this.hadoken.hadokenData.matchedMove !== null) {
      console.log(`matched: ${this.hadoken.hadokenData.matchedMove}`)
    }
  }
}

let phaserConfig = {
  type: Phaser.AUTO,
  parent: 'phaser-display',
  backgroundColor: '0x9a9a9a',
  width: 800,
  height: 400,
  scene: [ Scene1 ],
  input: {
    gamepad: true,
  }
}

const game = new Phaser.Game(phaserConfig)

// hook for demo page to swap keymaps
export function selectKeymap(newmap: 'qwerty' | 'dvorak') {
  const scn = <Scene1>game.scene.getScene('scene1')
  scn.keymap = newmap

  const nowQwerty = newmap === 'qwerty'
  const letters = nowQwerty
    ? ['A', 'S', 'D', 'F', 'G']
    : ['A', 'O', 'E', 'U', 'I']
  letters.forEach((l, i) => { scn.controls[i].setText(` : ${l}`) })

  const qwEle = <HTMLElement>document.getElementById('keymap-qwerty')
  qwEle.className = 'selectable' + (nowQwerty ? ' selected' : '')

  const dvEle = <HTMLElement>document.getElementById('keymap-dvorak')
  dvEle.className  = 'selectable' + (nowQwerty ? '' : ' selected')
}

export function selectInput(typ: string) {
  const scn = <Scene1>game.scene.getScene('scene1')
  scn.switchInputTo(typ)

  const nowKB = typ === 'keyboard'

  const kbEle = <HTMLElement>document.getElementById('input-keyboard')
  kbEle.className = 'selectable' + (nowKB ? ' selected' : '')

  const gpEle = <HTMLElement>document.getElementById('input-gamepad')
  gpEle.className = 'selectable' + (nowKB ? '' : ' selected')

  const keymapEle = <HTMLElement>document.getElementById('keymap-select-section')
  if (nowKB) {
    keymapEle.style.display = 'block'
    selectKeymap(scn.keymap)
  } else {
    const letters = ['A', 'B', 'X', 'Y', 'LS']
    letters.forEach((l, i) => { scn.controls[i].setText(` : ${l}`) })
    keymapEle.style.display = 'none'
  }
}
