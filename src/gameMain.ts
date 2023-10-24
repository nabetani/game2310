import * as Settings from './settings';

const earthH = 40;
const p1H = 73;
const p0H = 96;
const pW = 96;

enum Phase {
  rising,
  standing,
}

export class GameMain extends Phaser.Scene {
  p0: Phaser.GameObjects.Sprite | null = null;
  p1: Phaser.GameObjects.Sprite | null = null;
  tick: integer = 0;
  phase: Phase = Phase.rising;
  constructor() {
    super('GameMain');
  }
  preload() {
    for (const n of ["game_bg", "earth", "p0", "p1"]) {
      this.load.image(n, `assets/${n}.png`);
    }
  }
  create() {
    this.add.image(Settings.bgSize.x / 2, Settings.bgSize.y / 2, 'game_bg');
    let staticGroup = this.physics.add.staticGroup();
    let earth = staticGroup.create(Settings.bgSize.x / 2, Settings.bgSize.y - earthH / 2, 'earth');
    let text = this
      .add
      .text(Settings.bgSize.x / 2, Settings.bgSize.y / 2, 'You are playing...', { fontFamily: 'arial', fontSize: '60px' })
      .setOrigin(0.5);
    const x = Settings.bgSize.x / 2;
    const y0 = Settings.bgSize.y + p0H / 2;
    const y1 = Settings.bgSize.y + p1H / 2;
    this.p0 = this.add.sprite(x, y0, "p0");
    this.p1 = this.add.sprite(x, y1, "p1");
    this.p1.active = false;
    this.p1.visible = false;
  }
  rise() {
    const x = Settings.bgSize.x / 2;
    const y0 = Settings.bgSize.y + p0H / 2 - this.tick * 4;
    this.p0?.setPosition(x, y0);
    this.tick++;
    if (y0 < Settings.bgSize.y - earthH - p0H / 2) {
      this.phase = Phase.standing;
    }
  }
  update() {
    switch (this.phase) {
      case Phase.rising:
        return this.rise();

    }
  }
}
