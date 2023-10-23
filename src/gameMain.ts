import * as Settings from './settings';

const earthH = 40;

export class GameMain extends Phaser.Scene {
  p0: Phaser.Types.Physics.Arcade.SpriteWithDynamicBody | null = null
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
    this.p0 = this.physics.add.sprite(240, 80, "p0");
    this.physics.add.collider(this.p0, staticGroup);
  }
}
