import * as Settings from './settings';

const earthH = 40;
const p1H = 73;
const p0H = 96;
const pW = 96;

export class GameMain extends Phaser.Scene {
  p0: Phaser.GameObjects.Sprite | null = null;
  p1: Phaser.GameObjects.Sprite | null = null;
  tick: integer = 0;
  v: number = 0;
  y0 = Settings.bgSize.y - earthH - p0H / 2;
  y1 = Settings.bgSize.y - earthH - p1H / 2;
  updateProc = this.rise;
  pointerdown = () => { console.log("zone-pd"); };
  pointerup = () => { console.log("zone-pu"); };
  graphics: Phaser.GameObjects.Graphics | null = null;
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
    const x = Settings.bgSize.x / 2;
    const py0 = Settings.bgSize.y + p0H / 2;
    this.p0 = this.add.sprite(x, py0, "p0");
    this.p1 = this.add.sprite(x, 0, "p1");
    this.p1.visible = false;
    const { width, height } = this.game.canvas;
    const zone = this.add.zone(width / 2, height / 2, width, height);
    zone.setInteractive();
    zone.on('pointerdown', () => { this.pointerdown(); });
    zone.on('pointerup', () => { this.pointerup(); });
    this.graphics = this.add.graphics();
  }
  rise() {
    const p0 = this.p0!;
    const x = Settings.bgSize.x / 2;
    const y = p0.y - 4;
    this.p0?.setPosition(x, y);
    if (y < this.y0) {
      this.prepareStand()
    }
  }
  prepareStand() {
    this.updateProc = this.stand;
    this.pointerdown = this.pdStand;
    this.pointerup = () => { };
    const x = Settings.bgSize.x / 2;
    console.log(this.p0, x, this.y0);
    this.p0?.setVisible(true);
    this.p0?.setPosition(x, this.y0);
    this.p1?.setVisible(false);
  }
  pdStand() {
    this.prepareBend();
  }
  stand() {
  }
  prepareBend() {
    this.tick = 0;
    this.updateProc = this.bend;
    this.pointerup = this.puBend;
    this.pointerdown = () => { };
    const x = Settings.bgSize.x / 2;
    this.p0?.setVisible(false);
    this.p1?.setVisible(true);
    this.p1?.setPosition(x, this.y1);
  }
  puBend() {
    this.prepareJump();
  }

  bend() {
    const p1 = this.p1!;
    const br = p1.getBottomRight()!;
    this.tick++;
    const h = this.tick;
    this.graphics?.fillStyle(0x800000, 1).fillRect(
      br.x!, br.y! - h, 20, h);
  }
  prepareJump() {
    this.graphics?.clear();
    this.updateProc = this.jump;
    this.v = this.tick * -2;
    this.pointerup = () => { };
    this.pointerdown = () => { };
    const p0 = this.p0!
    const p1 = this.p1!
    p0.setPosition(p0.x, this.y0);
    p1.setVisible(false);
    p0.setVisible(true);
  }
  puJump() {
    const p0 = this.p0!;
    const y = p0.y;
    p0.setPosition(p0.x, y);
  }
  jump() {
    const p0 = this.p0!;
    const y = p0.y + this.v;
    if (this.y0 < y) {
      this.prepareStand();
      return;
    }
    this.p0?.setPosition(this.p0?.x, y);
    this.v += 10;
  }
  update() {
    this.updateProc();
  }
}
