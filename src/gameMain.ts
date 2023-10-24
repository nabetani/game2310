import * as Settings from './settings';

const earthH = 40;
const p1H = 73;
const p0H = 96;
const pW = 96;
const gravity = 3;

type Vector2 = Phaser.Math.Vector2;
const Vec2 = (x: number, y: number): Vector2 => {
  console.log(x, y, new Phaser.Math.Vector2(x, y));
  const r = new Phaser.Math.Vector2(x, y);
  return r;
}

class PhysObj {
  pos: Vector2;
  velo: Vector2;
  dvy: number
  constructor(x: number, y: number, vx: number, vy: number, dvy: number) {
    this.pos = Vec2(x, y);
    console.log({ pos: this.pos, x: x, y: y });
    this.velo = Vec2(vx, vy);
    console.log({ velo: this.velo, vx: vx, vy: y });
    this.dvy = dvy;
  }
  dev() {
    this.pos.add(this.velo);
    this.velo.y += this.dvy;
  }
};

export class GameMain extends Phaser.Scene {
  p0: Phaser.GameObjects.Sprite | null = null;
  p1: Phaser.GameObjects.Sprite | null = null;
  ta: Phaser.GameObjects.Sprite | null = null;
  tick: integer = 0;
  v: number = 0;
  px = Settings.bgSize.x * 0.8;
  y0 = Settings.bgSize.y - earthH - p0H / 2;
  y1 = Settings.bgSize.y - earthH - p1H / 2;
  playerProc = this.rise;
  taProc = () => { };
  taObj: PhysObj = new PhysObj(0, 0, 0, 0, gravity / 2);
  pointerdown = () => { console.log("zone-pd"); };
  pointerup = () => { console.log("zone-pu"); };
  graphics: Phaser.GameObjects.Graphics | null = null;
  constructor() {
    super('GameMain');
  }
  preload() {
    for (const n of ["game_bg", "earth", "p0", "p1", "taittsuu"]) {
      this.load.image(n, `assets/${n}.png`);
    }
  }
  create() {
    this.add.image(Settings.bgSize.x / 2, Settings.bgSize.y / 2, 'game_bg');
    let staticGroup = this.physics.add.staticGroup();
    let earth = staticGroup.create(Settings.bgSize.x / 2, Settings.bgSize.y - earthH / 2, 'earth');
    const py0 = Settings.bgSize.y + p0H / 2;
    this.p0 = this.add.sprite(this.px, py0, "p0");
    this.p1 = this.add.sprite(this.px, 0, "p1");
    this.p1.visible = false;
    this.ta = this.add.sprite(-100, -100, "taittsuu");
    this.ta.visible = false;
    const { width, height } = this.game.canvas;
    const zone = this.add.zone(width / 2, height / 2, width, height);
    zone.setInteractive();
    zone.on('pointerdown', () => { this.pointerdown(); });
    zone.on('pointerup', () => { this.pointerup(); });
    this.graphics = this.add.graphics();
  }
  rise() {
    const p0 = this.p0!;
    const y = p0.y - 4;
    this.p0!.setPosition(this.px, y);
    if (y < this.y0) {
      this.prepareStand();
      this.prepareTa();
    }
  }
  prepareTa() {
    const y = 400;
    this.taObj = new PhysObj(48, 300, 5, -10, gravity / 20);
    console.log(this.taObj);
    this.taProc = this.throwTa;
    this.ta!.visible = true;
  }
  throwTa() {
    this.taObj.dev();
    this.ta!.setPosition(this.taObj.pos.x, this.taObj.pos.y);
  }
  prepareStand() {
    this.playerProc = this.stand;
    this.pointerdown = this.pdStand;
    this.pointerup = () => { };
    this.p0!.setVisible(true);
    this.p0!.setPosition(this.px, this.y0);
    this.p1!.setVisible(false);
  }
  pdStand() {
    this.prepareBend();
  }
  stand() {
  }
  prepareBend() {
    this.tick = 0;
    this.playerProc = this.bend;
    this.pointerup = this.puBend;
    this.pointerdown = () => { };
    this.p0!.setVisible(false);
    this.p1!.setVisible(true);
    this.p1!.setPosition(this.px, this.y1);
  }
  puBend() {
    this.prepareJump();
  }

  bend() {
    const p1 = this.p1!;
    const br = p1.getBottomRight()!;
    this.tick++;
    const h = this.tick * 5;
    this.graphics!.fillStyle(0x800000, 1).fillRect(
      br.x!, br.y! - h, 20, h);
  }
  prepareJump() {
    this.graphics!.clear();
    this.playerProc = this.jump;
    this.v = this.tick * -3;
    this.pointerup = () => { };
    this.pointerdown = () => { };
    const p0 = this.p0!
    const p1 = this.p1!
    p0.setPosition(p0.x, this.y0);
    p1.setVisible(false);
    p0.setVisible(true);
  }
  jump() {
    const p0 = this.p0!;
    const y = p0.y + this.v;
    if (this.y0 < y) {
      this.prepareLand();
      return;
    }
    this.p0!.setPosition(this.p0!.x, y);
    this.v += gravity;
  }
  update() {
    this.playerProc();
    this.taProc();
  }
  prepareLand() {
    this.pointerdown = () => { };
    this.pointerup = () => { };
    this.playerProc = this.land;
    this.p0!.setVisible(false);
    this.p1!.setVisible(true);
    this.p1!.setPosition(this.px, this.y1);
    this.tick = 0;
  }
  land() {
    this.tick++;
    if (3 < this.tick) {
      this.prepareStand();
    }
  }
}
