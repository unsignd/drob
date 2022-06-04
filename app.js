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
    this.reductionMultiply = 1;

    this.platform = [];
    this.angle = 1;
    this.isLocked = true;
    this.isMoved = false;

    for (let x = 0; x < 10; x++) {
      for (let y = 0; y < 10; y++) {
        this.platform.push(
          new Platform(x, y, this.clientWidth, this.clientHeight)
        );
      }
    }

    this.platform.forEach((platform) => {
      platform.resize(this.clientWidth, this.clientHeight);
      platform.rotate(this.angle);
    });

    window.addEventListener('resize', this.resize.bind(this), false);
    window.addEventListener('mousemove', this.rotate.bind(this), false);
    window.addEventListener(
      'keydown',
      (e) => {
        if (e.code === 'Space') {
          this.isLocked = !this.isLocked;
          if (this.tipText.innerText === 'Press Spacebar to unlock.') {
            this.tipText.innerText = 'Press Spacebar to draw.';
          } else {
            this.isMoved = false;
            this.lastAngle = this.angle;
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
    if (!this.isLocked && this.syncEnded) {
      this.isMoved = true;
      this.angle =
        ((e.clientX < this.clientWidth / 1000
          ? 0
          : e.clientX > (this.clientWidth / 20) * 999
          ? this.clientWidth
          : e.clientX) /
          this.clientWidth) *
          1 +
        1;

      this.platform.forEach((platform) => platform.rotate(this.angle));
    } else {
      this.lastAngle =
        ((e.clientX < this.clientWidth / 1000
          ? 0
          : e.clientX > (this.clientWidth / 20) * 999
          ? this.clientWidth
          : e.clientX) /
          this.clientWidth) *
          1 +
        1;
    }

    if (
      e.clientY > (this.clientHeight * 4) / 5 ||
      this.tipText.innerText === 'Press Spacebar to unlock.'
    ) {
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

    if (this.isLocked && this.angle > 1) {
      this.angle -= 0.01 * this.reductionMultiply;
      this.reductionMultiply += 0.125;
      this.platform.forEach((platform) => platform.rotate(this.angle));
    } else if (this.isLocked) {
      this.angle = 1;
      this.reductionMultiply = 1;
      this.platform.forEach((platform) => platform.rotate(this.angle));
    }

    if (!this.isLocked && this.angle < this.lastAngle && !this.isMoved) {
      this.angle += 0.01 * this.reductionMultiply;
      this.reductionMultiply += 0.125;
      this.platform.forEach((platform) => platform.rotate(this.angle));
      this.syncEnded = false;
    } else if (!this.isLocked && !this.isMoved) {
      this.angle = this.lastAngle;
      this.reductionMultiply = 1;
      this.platform.forEach((platform) => platform.rotate(this.angle));
      this.syncEnded = true;
    }

    requestAnimationFrame(this.animate.bind(this));
  }
}

window.onload = () => {
  new App();
};
