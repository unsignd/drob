export default class Platform {
  constructor(xIndex, yIndex, clientWidth, clientHeight) {
    this.dots = [];
    this.currAngle = 0;
    this.beforeAngle = 0;
    this.clientWidth = clientWidth;
    this.clientHeight = clientHeight;
    this.minPart = Math.min(this.clientWidth, this.clientHeight);
    this.xIndex = xIndex;
    this.yIndex = yIndex;
    this.x = ((this.xIndex - 4) * (this.minPart - 1)) / 4;
    this.y = ((this.yIndex - 4) * (this.minPart - 1)) / 4;
  }

  resize(clientWidth, clientHeight) {
    this.clientWidth = clientWidth;
    this.clientHeight = clientHeight;
    this.minPart = Math.min(this.clientWidth, this.clientHeight);
    this.x = ((this.xIndex - 4) * (this.minPart - 1)) / 4;
    this.y = ((this.yIndex - 4) * (this.minPart - 1)) / 4;

    this.center = {
      x: this.clientWidth / 2 + this.x,
      y: this.clientHeight / 2 + this.y,
    };
  }

  rotate(angle) {
    this.beforeAngle = this.angle;
    this.angle = angle;
  }

  draw(ctx) {
    this.xType = [
      this.center.x - this.minPart / 8,
      this.center.x - this.minPart / (8 * this.angle),
      this.center.x + this.minPart / 8,
      this.center.x + this.minPart / (8 * this.angle),
    ];

    this.yType = [
      this.center.y - this.minPart / (8 * this.angle),
      this.center.y + this.minPart / 8,
      this.center.y + this.minPart / (8 * this.angle),
      this.center.y - this.minPart / 8,
    ];

    ctx.fillStyle = '#fff';

    ctx.globalAlpha = 1;
    ctx.beginPath();
    ctx.moveTo(this.xType[0], this.yType[0]);
    this.drawMethod(ctx, 1);
    this.drawMethod(ctx, 2);
    this.drawMethod(ctx, 3);
    ctx.fill();
    ctx.closePath();

    ctx.globalAlpha = 0.7;
    ctx.beginPath();
    ctx.moveTo(
      this.xType[0] + this.minPart / 32,
      this.yType[0] + this.minPart / 32
    );
    this.drawMethod(ctx, 1, this.minPart / 32);
    this.drawMethod(ctx, 2, this.minPart / 32);
    this.drawMethod(ctx, 3, this.minPart / 32);
    ctx.fill();
    ctx.closePath();

    ctx.globalAlpha = 0.7;
    ctx.beginPath();
    ctx.moveTo(this.xType[1], this.yType[1]);
    this.drawMethod(ctx, 1, this.minPart / 32);
    this.drawMethod(ctx, 2, this.minPart / 32);
    this.drawMethod(ctx, 2);
    ctx.fill();
    ctx.closePath();

    ctx.globalAlpha = 0.4;
    ctx.beginPath();
    ctx.moveTo(this.xType[2], this.yType[2]);
    this.drawMethod(ctx, 3);
    this.drawMethod(ctx, 3, this.minPart / 32);
    this.drawMethod(ctx, 2, this.minPart / 32);
    ctx.fill();
    ctx.closePath();

    ctx.globalAlpha = 1;
    this.dots.forEach((dot) => {
      ctx.fillStyle = dot.color;
      ctx.beginPath();
      ctx.arc(
        dot.x -
          (((dot.platformY - dot.y) / dot.platformY) *
            this.minPart *
            (this.angle - 1)) /
            (this.angle * 5) +
          (this.angle === 1
            ? 0
            : ((dot.platformX - dot.x) * (this.angle - 1)) / 3.75),
        dot.y +
          (((dot.platformX - dot.x) / dot.platformX) *
            this.minPart *
            (this.angle - 1)) /
            (this.angle * 2.5) +
          (this.angle === 1
            ? 0
            : ((dot.platformY - dot.y) * (this.angle - 1)) / 3.75),
        20 / Math.pow(this.angle, 0.75),
        0,
        Math.PI * 2
      );
      ctx.fill();
      ctx.closePath();
    });
  }

  drawMethod(ctx, type, plusVal = 0) {
    ctx.lineTo(this.xType[type] + plusVal, this.yType[type] + plusVal);
  }

  selected(x, y, platformX, platformY, color) {
    this.dots.push({ x, y, platformX, platformY, color });
  }
}
