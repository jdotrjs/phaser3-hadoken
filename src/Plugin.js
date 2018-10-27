import Phaser from 'phaser'

export default class Plugin extends Phaser.Plugins.BasePlugin {
  constructor(mgr) {
    super(mgr)
    // mgr.registerGameObject('hadoken', this.addNineSlice, this.makeNineSlice)
  }
}

// Plugin.DefaultCfg = DefaultCfg