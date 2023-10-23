import * as Settings from './settings';

export class GameMain extends Phaser.Scene {
  constructor() {
    super('GameMain');
  }
  preload() {
    this.load.image('bg2', 'assets/bg2.png');
  }
  create() {
    this.add.image(Settings.bgSize.x / 2, Settings.bgSize.y / 2, 'bg2');
    let text = this
      .add
      .text(Settings.bgSize.x / 2, Settings.bgSize.y / 2, 'You are playing...', { fontFamily: 'arial', fontSize: '60px' })
      .setOrigin(0.5).setInteractive();
  }
}
