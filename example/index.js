let phaserConfig = {
  type: Phaser.AUTO,
  parent: 'phaser-display',
  backgroundColor: '0x9a9a9a',
  width: 800,
  height: 600,
  scene: [ Scene1 ],
  input: {
    gamepad: true,
  },
}

new Phaser.Game(phaserConfig)