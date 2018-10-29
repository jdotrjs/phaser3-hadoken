import { filterChain } from 'ph/Hadoken'
import { InputSnapshot } from 'ph/InputSnapshot'
// TODO: index should resolve automatically...
import { HadokenKeyboard } from 'ph/Keyboard/index'
import * as Mapper from 'ph/Keyboard/Mapper'
import * as Filters from "ph/Common/Filters"
import * as Match from 'ph/Common/Matcher'

const c = Phaser.Input.Keyboard.KeyCodes

const keymapArrows = {
  [c.DOWN]:  'down',
  [c.UP]:    'up',
  [c.RIGHT]: 'right',
  [c.LEFT]:  'left',
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

class Scene1 extends Phaser.Scene {
  hadoken: HadokenKeyboard
  facing: 'right' | 'left'

  constructor() {
    super('scene1')
    this.facing = 'right'
    console.log(this)
  }

  create() {
    this.hadoken = new HadokenKeyboard(
      this,
      {
        bufferLimitType: 'time',
        bufferLimit: 500,
        keymapFn: Mapper.NewSimpleMapper({ ...keymapArrows, ...keymapDvorak }),
        filters: filterChain(
          Filters.CoalesseDirections,
          Filters.AsFacing(() => this.facing),
        ),
        matchers: [], // Match.NewMatcher(Match.simpleMoveList),
      },
    )
  }

  ls: InputSnapshot | null
  update() {
    const ls = this.hadoken.lastState()
    if (ls && ls !== this.ls) {
      this.ls = ls
    }
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