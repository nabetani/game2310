import * as Settings from './settings';

export class Wating extends Phaser.Scene {
  constructor() {
    super('Prepare');
  }

  preload() {
    this.load.image('bg', 'assets/bg.png');
  }

  create() {
    this.add.image(Settings.bgSize.x / 2, Settings.bgSize.y / 2, 'bg');
    const msg = 'Click here to start game.';
    const attr = { fontFamily: 'arial', fontSize: '60px' };
    let text = this.add
      .text(Settings.bgSize.x / 2, Settings.bgSize.y / 2, msg, attr)
      .setOrigin(0.5).setInteractive();
    text.on('pointerdown', () => {
      console.log("pointer down on text")
      this.scene.start('GameMain');
    });
  }
  update() {
  }
}
