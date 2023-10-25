import * as Settings from './settings';

export class Wating extends Phaser.Scene {
  constructor() {
    super('Prepare');
  }

  preload() {
    this.load.image('bg', 'assets/bg.png');
  }

  addText(msg: string, x: number, y: number, org: number, fontSize: string): Phaser.GameObjects.Text {
    const attr = { fontFamily: 'arial', fontSize: fontSize };
    let text = this.add
      .text(x, y, msg, attr)
      .setOrigin(org, 0.5).setInteractive();
    return text;
  }

  create() {
    this.add.image(Settings.bgSize.x / 2, Settings.bgSize.y / 2, 'bg');
    const msg = 'Click here to start game.';
    const attr = { fontFamily: 'arial', fontSize: '60px' };
    const startText = this.addText(
      'Click here to start game.',
      Settings.bgSize.x / 2, Settings.bgSize.y / 2, 0.5,
      '60px');
    startText.on('pointerdown', () => {
      this.scene.start('GameMain');
    });
    const showRuleJ = this.addText(
      '遊び方',
      50, Settings.bgSize.y * 0.75, 0,
      '40px');
    const rules = [
      "押している間はジャンプ力をためます。\n離すとジャンプ。\n落下中にタイツに触れてください。",
      "Press to charge the power to jump.\nRelease to jump.\nTouch the tights while falling."
    ].map(e => {
      const r = this.addText(
        e,
        Settings.bgSize.x / 2, Settings.bgSize.y * 0.2, 0.5,
        '30px')
      r.setVisible(false);
      return r;
    });

    showRuleJ.on('pointerdown', () => {
      rules[0].setVisible(true);
      rules[1].setVisible(false);
    });
    const showRuleE = this.addText(
      'How to play',
      Settings.bgSize.x - 50, Settings.bgSize.y * 0.75, 1,
      '40px');
    showRuleE.on('pointerdown', () => {
      rules[0].setVisible(false);
      rules[1].setVisible(true);
    });
  }
  update() {
  }
}
