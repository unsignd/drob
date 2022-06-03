import Platform from './components/platform.js';

class App {
  constructor() {
    this.canvas = document.createElement('canvas');
    this.ctx = this.canvas.getContext('2d');
    document.body.appendChild(this.canvas);

    this.tip = document.createElement('div');
    this.tipText = document.createElement('p');
    this.tipText.innerText = 'Press Spacebar to unlock.';

    this.tip.classList.add('tipAppear');
    this.tip.appendChild(this.tipText);
    document.body.appendChild(this.tip);

    this.clientWidth = document.body.clientWidth;
    this.clientHeight = document.body.clientHeight;
    this.minPart = Math.min(this.clientWidth, this.clientHeight);

    this.canvas.width = this.clientWidth * 2;
    this.canvas.height = this.clientHeight * 2;
    this.ctx.scale(2, 2);

    this.platform = [];
    this.isLocked = true;

    for (let x = 0; x < 10; x++) {
      for (let y = 0; y < 10; y++) {
        this.platform.push(
          new Platform(x, y, this.clientWidth, this.clientHeight)
        );
      }
    }

    this.platform.forEach((platform) => {
      platform.resize(this.clientWidth, this.clientHeight);
      platform.rotate(1);
    });

    window.addEventListener('resize', this.resize.bind(this), false);
    window.addEventListener('mousemove', this.rotate.bind(this), false);
    window.addEventListener(
      'keydown',
      (e) => {
        if (e.code === 'Space') {
          this.isLocked = !this.isLocked;
          if (this.tipText.innerText === 'Press Spacebar to unlock.') {
            this.tipText.innerText = 'Press Spacebar to lock.';
          } else {
            this.tipText.innerText = 'Press Spacebar to unlock.';
          }
        }
      },
      false
    );

    requestAnimationFrame(this.animate.bind(this));
  }

  resize() {
    this.clientWidth = document.body.clientWidth;
    this.clientHeight = document.body.clientHeight;
    this.minPart = Math.min(this.clientWidth, this.clientHeight);

    this.canvas.width = this.clientWidth * 2;
    this.canvas.height = this.clientHeight * 2;
    this.ctx.scale(2, 2);

    this.platform.forEach((platform) =>
      platform.resize(this.clientWidth, this.clientHeight)
    );
  }

  rotate(e) {
    if (!this.isLocked) {
      this.platform.forEach((platform) =>
        platform.rotate(
          ((e.clientX < this.clientWidth / 1000
            ? 0
            : e.clientX > (this.clientWidth / 20) * 999
            ? this.clientWidth
            : e.clientX) /
            this.clientWidth) *
            9 +
            1
        )
      );
    }

    if (e.clientY > (this.clientHeight * 4) / 5) {
      this.tip.classList.remove('tipDisappear');
      this.tip.classList.add('tipAppear');
    } else {
      this.tip.classList.remove('tipAppear');
      this.tip.classList.add('tipDisappear');
    }
  }

  animate() {
    this.ctx.clearRect(0, 0, this.clientWidth, this.clientHeight);
    this.platform.forEach((platform) => platform.draw(this.ctx));

    requestAnimationFrame(this.animate.bind(this));
  }
}

window.onload = () => {
  new App();
};
