import * as Phaser from 'phaser';

const bgSize = new Phaser.Math.Vector2(800, 600);

class MyGame extends Phaser.Scene {
  constructor() {
    super('MyGame');
  }
  create() {
    let text = this.add.text(bgSize.x / 2, bgSize.y / 2, 'You are playing...', { fontFamily: 'arial', fontSize: '60px' }).setOrigin(0.5).setInteractive();
  }
}

class Prepare extends Phaser.Scene {
  constructor() {
    super('Prepare');
  }

  preload() {
    this.load.image('bg', 'assets/bg.png');
  }

  create() {
    this.add.image(bgSize.x / 2, bgSize.y / 2, 'bg');
    let text = this.add.text(bgSize.x / 2, bgSize.y / 2, 'Click here to start game.', { fontFamily: 'arial', fontSize: '60px' }).setOrigin(0.5).setInteractive();
    text.on('pointerdown', () => {
      console.log("pointer down on text")
      this.scene.start('MyGame');
    });
  }
  update() {
  }
}

const config: Phaser.Types.Core.GameConfig = {
  type: Phaser.AUTO,
  width: bgSize.x,
  height: bgSize.y,
  parent: 'game-app',
  scene: [Prepare, MyGame],
  fps: {
    target: 24,
    forceSetTimeOut: true
  },
  physics: {
    default: "arcade",
    arcade: {
      debug: true,
      gravity: { y: 300 }
    }
  }
};

new Phaser.Game(config);
