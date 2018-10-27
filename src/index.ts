import { InputSnapshot } from 'ph/InputSnapshot'
// TODO: index should resolve automatically...
import { HadokenKeyboard } from 'ph/Keyboard/index'
import * as Simple from 'ph/Keyboard/Simple'
import { filterChain } from './Hadoken';

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
        keymapFn: Simple.Mapper,
        coalesseFn: Simple.Coalesse,
        filters: filterChain(
          Simple.NewFacingFilter(() => this.facing)
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