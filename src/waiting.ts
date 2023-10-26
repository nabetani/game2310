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
    this.addText(
      'Jump Down into TIGHTS',
      Settings.bgSize.x / 2, Settings.bgSize.y * 0.5, 0.5,
      '60px');

    const bottomFont = "30px";
    const startText = this.addText(
      'Click here to start game.',
      Settings.bgSize.x / 2, Settings.bgSize.y * 0.8, 0.5,
      bottomFont);
    startText.on('pointerdown', () => {
      this.scene.start('GameMain');
    });
    const showRuleJ = this.addText(
      '遊び方',
      50, Settings.bgSize.y * 0.7, 0,
      bottomFont);
    const rules = [
      "押している間はジャンプ力をためます。\n離すとジャンプ。\n落下中にタイツに触れてください。",
      "Press to charge the power to jump.\nRelease to jump.\nTouch the tights while falling."
    ].map(e => {
      const r = this.addText(
        e,
        Settings.bgSize.x / 2, Settings.bgSize.y * 0.2, 0.5,
        "30px")
      r.setVisible(false);
      return r;
    });

    showRuleJ.on('pointerdown', () => {
      rules[0].setVisible(true);
      rules[1].setVisible(false);
    });
    const showRuleE = this.addText(
      'How to play',
      Settings.bgSize.x - 50, Settings.bgSize.y * 0.7, 1,
      bottomFont);
    showRuleE.on('pointerdown', () => {
      rules[0].setVisible(false);
      rules[1].setVisible(true);
    });
    const github = this.addText(
      'Source code and license',
      Settings.bgSize.x - 50, Settings.bgSize.y * 0.9, 1,
      "16px");
    github.on('pointerdown', () => {
      window.location.href = 'https://github.com/nabetani/game2310/';
    });
  }
  update() {
  }
}
