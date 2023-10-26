import * as Settings from './settings';

const earthH = 40;
const p1H = 73;
const p0H = 96;
const pW = 96;
const gravity = 3;

type Vector2 = Phaser.Math.Vector2;
const Vec2 = (x: number, y: number): Vector2 => {
  const r = new Phaser.Math.Vector2(x, y);
  return r;
}

type Audio = Phaser.Sound.NoAudioSound | Phaser.Sound.HTML5AudioSound | Phaser.Sound.WebAudioSound;

const popCount = (x: integer): integer => {
  let r = 0;
  for (let i = x; i != 0; i = (i >> 1)) {
    r += (i & 1);
  }
  return r;
};

class PhysObj {
  pos: Vector2;
  velo: Vector2;
  dvy: number
  constructor(x: number, y: number, vx: number, vy: number, dvy: number) {
    this.pos = Vec2(x, y);
    this.velo = Vec2(vx, vy);
    this.dvy = dvy;
  }
  dev() {
    this.pos.add(this.velo);
    this.velo.y += this.dvy;
  }
};

export class GameMain extends Phaser.Scene {
  p: Phaser.GameObjects.Sprite[] = [];
  lives: Phaser.GameObjects.Sprite[] = [];
  ta: Phaser.GameObjects.Sprite | null = null;
  stars: Phaser.GameObjects.Sprite | null = null;
  tick: integer = 0;
  v: number = 0;
  px = Settings.bgSize.x * 0.8;
  y0 = Settings.bgSize.y - earthH - p0H / 2;
  y1 = Settings.bgSize.y - earthH - p1H / 2;
  score: number = 0;
  scoreText: Phaser.GameObjects.Text | null = null;
  failCount: number = 0;
  playerProc = () => { };
  taProc = () => { };
  taObj: PhysObj = new PhysObj(0, 0, 0, 0, gravity / 2);
  pointerdown = () => { };
  pointerup = () => { };
  graphics: Phaser.GameObjects.Graphics | null = null;
  jumpSE: Audio | null = null;
  throwSE: Audio | null = null;
  getSE: Audio | null = null;
  failSE: Audio | null = null;
  constructor() {
    super('GameMain');
  }
  preload() {
    for (const n of ["game_bg", "earth", "p0", "p1", "p2", "stars", "taittsuu", "fail"]) {
      this.load.image(n, `assets/${n}.png`);
    }
    this.load.audio("jump-se", "assets/jump-se.mp3");
    this.load.audio("throw-se", "assets/throw-se.mp3");
    this.load.audio("get-se", "assets/get-se.mp3");
    this.load.audio("fail-se", "assets/fail-se.mp3");
  }
  restart() {
    for (const e of this.lives) {
      e.destroy();
    }
    this.lives = [];
    this.prepareStart()
  }
  prepareStart() {
    this.score = 0;
    this.failCount = 0;
    this.scoreText!.setText("");

    this.stars!.visible = false;
    for (let i = 0; i < 3; i++) {
      this.lives.push(this.add.sprite((i + 0.5) * 80, 40, "taittsuu"));
    }
    this.ta!.visible = false;
    this.playerProc = this.rise;
  }
  create() {
    this.add.image(Settings.bgSize.x / 2, Settings.bgSize.y / 2, 'game_bg');
    let staticGroup = this.physics.add.staticGroup();
    staticGroup.create(Settings.bgSize.x / 2, Settings.bgSize.y - earthH / 2, 'earth');

    this.stars = this.add.sprite(-100, -100, "stars");
    const py0 = Settings.bgSize.y + p0H / 2;
    this.p = ["0", "1", "2"].map(e => this.add.sprite(this.px, 0, `p${e}`))
    for (const p of this.p) {
      p.visible = false;
    }
    this.ta = this.add.sprite(-100, -100, "taittsuu");

    const { width, height } = this.game.canvas;
    const zone = this.add.zone(width / 2, height / 2, width, height);
    zone.setInteractive();
    zone.on('pointerdown', () => { this.pointerdown(); });
    zone.on('pointerup', () => { this.pointerup(); });
    this.graphics = this.add.graphics();

    const attr = { fontFamily: 'monospace', fontSize: '40px' };
    this.scoreText = this.add.text(10, 100, "", attr);
    this.prepareStart();
    this.jumpSE = this.sound.add("jump-se");
    this.throwSE = this.sound.add("throw-se");
    this.getSE = this.sound.add("get-se");
    this.failSE = this.sound.add("fail-se");
  }
  showP(ix: integer) {
    for (let i = 0; i < this.p.length; i++) {
      this.p[i].setVisible(i == ix);
    }
  }
  prepareRise() {
    this.showP(0);
    this.ta!.visible = false;
    const py0 = Settings.bgSize.y + p0H / 2;
    this.p[0].setPosition(this.px, py0);
    this.playerProc = this.rise;
  }
  rise() {
    const p0 = this.p[0];
    const y = p0.y - 4;
    p0.setPosition(this.px, y);
    if (y < this.y0) {
      this.prepareStand();
      this.prepareTa();
    }
  }
  taprop(): { y: number, vx: number, vy: number } {
    if (this.score < 5) {
      return { y: 300, vx: 6 + this.score / 2.0, vy: -7 };
    } else {
      switch (popCount(this.score) + this.score % 5) {
        default:
          return { y: 100, vx: 15, vy: 5 };
        case 2:
          return { y: 500, vx: 4, vy: -12 };
        case 3:
          return { y: 500, vx: 6, vy: -12 };
        case 4:
          return { y: 500, vx: 8, vy: -10 };
        case 5:
          return { y: 100, vx: 10, vy: 0 };
        case 6:
          return { y: 100, vx: 12, vy: 0 };
        case 7:
          return { y: 100, vx: 13, vy: 3 };
        case 8:
          return { y: 100, vx: 14, vy: 4 };
      }
    }
  }

  prepareTa() {
    const tap = this.taprop()
    this.taObj = new PhysObj(48, tap.y, tap.vx, tap.vy, gravity / 20);
    this.taProc = this.throwTa;
    this.ta!.visible = true;
    this.throwSE?.play();
  }
  throwTa() {
    this.taObj.dev();
    const ta = this.ta!
    ta.setPosition(this.taObj.pos.x, this.taObj.pos.y);
    if (Settings.bgSize.x < ta.x - pW) {
      const old = this.lives[this.failCount]
      this.lives[this.failCount] = this.add.sprite(old.x, old.y, "fail");
      old.destroy();
      this.failCount++;
      this.failSE?.play();
      if (this.lives.length <= this.failCount) {
        this.prepareGaveOver();
      } else {
        this.prepareTa();
      }
    }
  }
  rankText() {
    if (this.score == 0) {
      return "Nice try!";
    }
    const name = (): string | null => {
      return [
        "a Beginner",
        "a Novice",
        "an Apprentice",
        "a Good Player",
        "a Very Good Player",
        "an Advanced Player",
        "a Super Advanced Player",
        "an Incredible Player",
        "a Master",
        "a Hero",
        "a Super Hero",
      ][((this.score || 0) / 4) | 0];
    }
    let n = name();
    return n ? `You are ${n}` : "Are you a human being?";
  }
  prepareGaveOver() {
    this.tick = 0;
    this.pointerdown = () => { };
    this.pointerup = () => { };
    this.taProc = () => { };
    this.graphics!.clear();
    const attr = { fontFamily: 'arial', fontSize: '50px' };
    let texts = [
      this.add
        .text(Settings.bgSize.x * 0.5, Settings.bgSize.y * 0.4, 'Game Over', attr)
        .setOrigin(0.5),
      this.add
        .text(Settings.bgSize.x * 0.5, Settings.bgSize.y * 0.6, this.rankText(), attr)
        .setOrigin(0.5),
    ];
    this.playerProc = () => {
      if (60 < this.tick) {
        this.prepareRepayPrompt(texts);
      }
    }
  }
  prepareRepayPrompt(texts: Phaser.GameObjects.Text[]) {
    const msg = 'Click to try again.';
    const attr = { fontFamily: 'arial', fontSize: '40px' };
    this.playerProc = () => { };
    let replayText = this.add
      .text(Settings.bgSize.x * 0.5, Settings.bgSize.y * 0.8, msg, attr)
      .setOrigin(0.5);
    this.pointerdown = () => {
      replayText.destroy();
      for (let t of texts) {
        t.destroy();
      }
      this.restart();
    };
  }
  prepareStand() {
    this.playerProc = this.stand;
    this.pointerdown = this.pdStand;
    this.pointerup = () => { };
    const p0 = this.p[0];
    p0.setPosition(this.px, this.y0);
    this.showP(0);
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
    const p1 = this.p[1];
    p1.setPosition(this.px, this.y1);
    this.showP(1);
  }
  puBend() {
    this.prepareJump();
  }

  bend() {
    const p1 = this.p[1];
    const br = p1.getBottomRight()!;
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
    const p0 = this.p[0];
    p0.setPosition(p0.x, this.y0);
    this.showP(0);
    this.jumpSE?.play();

  }
  hit() {
    const p0 = this.p[0];
    const dx = p0.x - this.ta!.x;
    const dy = p0.y - this.ta!.y;
    const d = 70;
    return dx * dx + dy * dy < d * d;
  }
  jump() {
    const p0 = this.p[0];
    const y = p0.y + this.v;
    if (this.y0 < y) {
      this.prepareLand();
      return;
    }
    p0.setPosition(p0.x, y);
    this.v += gravity;
    if (0 < this.v && this.hit()) {
      this.score++;
      this.scoreText!.setText(`${this.score} タイツ`);
      this.prepareWare();
    }
  }
  prepareWare() {
    this.taProc = () => { };
    const x = this.p[0].x;
    const y = this.p[0].y;
    this.p[2].setPosition(x, y);
    const stars = this.stars!
    stars.setPosition(x, y);
    stars.visible = true;
    this.getSE!.play();
    this.ta!.visible = false
    this.showP(2);
    this.tick = 0;
    this.playerProc = this.ware;
    this.pointerup = () => { };
    this.pointerdown = () => { };
  }
  ware() {
    const stars = this.stars!
    if (this.tick < 40) {
      stars.setVisible(this.tick % 8 < 4);
    } else {
      stars.setVisible(false);
      const p2 = this.p[2];
      p2.y -= 20;
      if (p2.y < -50) {
        this.prepareRise();
      }
    }
  }
  update() {
    this.playerProc();
    this.taProc();
    this.tick++;
  }
  prepareLand() {
    this.pointerdown = () => { };
    this.pointerup = () => { };
    this.playerProc = this.land;
    this.showP(1)
    const p1 = this.p[1];
    p1.setVisible(true);
    p1.setPosition(this.px, this.y1);
    this.tick = 0;
  }
  land() {
    if (3 < this.tick) {
      this.prepareStand();
    }
  }
}
