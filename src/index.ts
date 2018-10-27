import { InputSnapshot } from 'ph/InputSnapshot'
// TODO: index should resolve automatically...
import { HadokenKeyboard } from 'ph/Keyboard/index'
import * as Mapper from 'ph/Keyboard/Mapper'
import * as Coalesse from "ph/Common/Coalesse";
import { filterChain } from './Hadoken';

const c = Phaser.Input.Keyboard.KeyCodes

const keymap = {
  [c.DOWN]:  'down',
  [c.UP]:    'up',
  [c.RIGHT]: 'right',
  [c.LEFT]:  'left',
  [c.A]:     'punch:light',
  [c.O]:     'punch:hard',
  [c.E]:     'kick:light',
  [c.U]:     'kick:hard',
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
        keymapFn: Mapper.NewSimpleMapper(keymap),
        coalesseFn: Coalesse.Coalesse,
        filters: filterChain(
          Coalesse.NewFacingFilter(() => this.facing)
        )
      },
    )
  }

  ls: InputSnapshot | null
  update() {
    const ls = this.hadoken.lastState()
    if (ls && ls !== this.ls) {
      this.ls = ls
      console.log(Object.keys(ls.state))
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