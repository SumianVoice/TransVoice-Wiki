




class _spectrogram2d extends _fftSpectrogramDisplay{
  constructor(data, context, sampleRate, frequencyBinCount) {
    super(data, context, sampleRate, frequencyBinCount);
    this.enable = true;
    this.img = 0;
    this.scaleWidth = 120;
    // this.this.ctxWindow.height -= 100;
    this.type = "2d";
    this.spectrogramPixelWidth = 4;
    this.canvas = false;
    this.specMin = 0; // hz

  }
  //
  draw() {
    if (this.paused || !this.canvas) {return false}
    const tmpScale = 1.1;
    if (!this.enable) {return}
    this.updateScale();
    const width = this.spectrogramPixelWidth;

    // this.img = this.ctx.getImageData(
    //   this.ctxWindow.x + (width), this.ctxWindow.y,
    //   this.ctxWindow.width - (width) - this.scaleWidth, this.ctxWindow.height - 0);
    // this.ctx.save();
    // this.ctx.putImageData(this.img, this.ctxWindow.x-(0), this.ctxWindow.y);

    // Translate the canvas.
    this.ctx.translate(-width, 0);
    // Draw the copied image.
    this.ctx.drawImage(this.canvas, this.ctxWindow.x, this.ctxWindow.y, this.ctxWindow.width, this.ctxWindow.height,
                  this.ctxWindow.x, this.ctxWindow.y, this.ctxWindow.width, this.ctxWindow.height);
    // Reset the transformation matrix.
    this.ctx.setTransform(1, 0, 0, 1, 0, 0);

    const tmpStartIndex = Math.ceil(this.ahz(this.specMin)) + 1;
    for (var i = tmpStartIndex; i < this.data.length; i++) {
      const tmpY = Math.floor(this.scaleFuncY(i));
      const tmpHeight = Math.ceil(tmpY - this.scaleFuncY(i-1));
      const d = this.data[i];
      // let color = `rgb(${Math.min(d**     3, 70) + d/2}, ${d*4-400}, ${d*2})` // main
      // this.ctx.fillStyle = `rgb(${d*1.5 + 10},${d/3},${150-d/2})`; // set color
      // this.ctx.fillStyle = `rgb(${d*1.8 + 10},${d/3},${Math.min(d**2, 150)-d/2})`; // set color
      this.ctx.fillStyle = this.colormap(d); //9ms
      // this.ctx.fillStyle = `rgb(${d*3}, ${d*4-400}, ${Math.min(d**3, 70) + d/2})` // main (orange)
      // this.ctx.fillStyle = `rgb(${Math.min(d**3, 70) + d/2}, ${d*5-400}, ${d*3})` // main (ice)
      // this.ctx.fillStyle = `rgb(${(d*3-200)}, ${(d*2)}, ${Math.min(d*3,255)-d/2})` // main (yellow)
      // this.ctx.fillStyle = `rgb(${d*3+ 30}, ${d*5 - 500}, ${(200 - d) + Math.max(d*6 - 900, 0)})` // main (trippy)

      // this.ctx.fillRect(this.ctxWindow.x + this.ctxWindow.width-1, tmpY, (2), scaleFunc(i));
      this.drawRect(
        this.ctxWindow.x - (this.scaleWidth) + this.ctxWindow.width - width,
        this.ctxWindow.height - (tmpY),
        width,
        tmpHeight);
    }
    // this.ctx.restore();
  }
  fillScreen() {
    if (this.enable) {
      this.ctx.fillStyle = "#440154";
    }
    else {
      this.ctx.fillStyle = "#222222";
    }
    this.drawRect(
      this.ctxWindow.x,
      this.ctxWindow.y,
      this.ctxWindow.width,
      this.ctxWindow.height);
  }
  cursorRender(x, y, tmpctx) {
    if (!this.enable) {return}
    let tmpY = y - this.ctxWindow.y;
    let tmpWidth = x - this.ctxWindow.x;
    let tmpHZ = Math.floor(this.hz(this.unscaleY(this.ctxWindow.height - tmpY)));
    tmpctx.fillStyle = '#000';
    tmpctx.fillRect(0, tmpY-1, this.ctxWindow.width + 5 - this.scaleWidth, 3);
    tmpctx.fillStyle = '#ff3';
    tmpctx.fillRect(0, tmpY-1, this.ctxWindow.width + 5 - this.scaleWidth, 1);
    tmpctx.font = "20px Arial";
    tmpctx.fillStyle = `rgba(26, 0, 32, 0.3)`;
    roundRect(x + 60 - 4, y - 8 - 22, 60, 28, 10, tmpctx);
    // tmpctx.fillStyle = '#ff3';
    // hz
    tmpctx.fillStyle = '#ff3';
    tmpctx.fillText(`${tmpHZ}`, tmpWidth + 60, tmpY - 8);

    // backing for note details
    tmpctx.fillStyle = `rgba(26, 0, 32, 0.3)`;
    roundRect(x + 60 - 4, y + 2, 60, 46, 10, tmpctx);

    // note info
    tmpctx.fillStyle = `rgba(255,255,0,0.5)`;
    const tmpNote = lookupNote(tmpHZ);
    const tmpNoteHz = Math.round(getNoteHz(tmpNote)*1)/1;
    if (tmpNoteHz){
      tmpctx.font = "14px Arial";
      tmpctx.fillText(`${tmpNote}`, x + 60, y + 20);
      tmpctx.fillText(`${tmpNoteHz}Hz`, x + 60, y + 40);
    }
  }
  // drawCursorAt(x, y, ctx) {
  //   if (!this.enable) {return}
  //   let tmpY = y - this.ctxWindow.y;
  //   let tmpWidth = x - this.ctxWindow.x;
  //   let tmpHZ = Math.floor(this.hz(this.unscaleY(this.ctxWindow.height - tmpY)));
  //   ctx.fillStyle = '#000';
  //   ctx.fillRect(0, tmpY-1, this.ctxWindow.width + 5 - this.scaleWidth, 3);
  //   ctx.fillStyle = '#f33';
  //   ctx.fillRect(0, tmpY-1, this.ctxWindow.width + 5 - this.scaleWidth, 1);
  //   ctx.font = "20px Arial";
  //   ctx.fillText(`${tmpHZ}`, tmpWidth + 80, tmpY - 2);
  // }
  drawCursorAt(fundamentalIndex, fundamentalAmplitude, color, width = 2, ctx) {
    if (!this.enable) {return}
    ctx.fillStyle = color; // set color
    ctx.font = "20px Arial";
    const tmpX = 15;
    ctx.fillStyle = `rgba(50,50,50,0.4)`;
    ctx.fillRect(this.ctxWindow.width - this.scaleWidth, this.ctxWindow.height - this.scaleFuncY(fundamentalIndex+0.5) - 20, tmpX + 80, 35);
    ctx.fillStyle = `rgba(0,0,0,0.7)`;
    ctx.fillRect(this.ctxWindow.width - 8 -  this.scaleWidth - 2, this.ctxWindow.height - this.scaleFuncY(fundamentalIndex+0.5) - 2, tmpX + 20 + 2, width + 4);
    ctx.fillStyle = color; // set color
    ctx.fillRect(this.ctxWindow.width - 8 -  this.scaleWidth, this.ctxWindow.height - this.scaleFuncY(fundamentalIndex+0.5), tmpX + 20, width);
    ctx.fillText(`${Math.floor(this.hz(fundamentalIndex))}`, this.ctxWindow.width - this.scaleWidth + 30, this.ctxWindow.height - this.scaleFuncY(fundamentalIndex+0.5) + 5);
  }
  scaleRender() {
    if (!this.enable) {return}
    this.ctx.fillStyle = `rgb(50,50,50)`; // set color
    this.ctx.fillRect(this.ctxWindow.width - this.scaleWidth, 0, this.ctxWindow.width, this.ctxWindow.height);
    if (this.scaleMode === 'linear') {
      for (var i = 0; i < (this.specMax/100); i++) {
        this.ctx.fillStyle = `rgb(250,250,250)`; // set color
        if (i%10 === 0) {
          this.ctx.fillRect(this.ctxWindow.width-this.scaleWidth, this.ctxWindow.height - this.scaleFuncY(this.ahz(i * 100)), 30, 1);
          this.ctx.fillText(`${100*i}`, this.ctxWindow.width - this.scaleWidth/2, this.ctxWindow.height - this.scaleFuncY(this.ahz(i * 100)));
        }
        else if (i%5 === 0) {
          this.ctx.fillRect(this.ctxWindow.width-this.scaleWidth, this.ctxWindow.height - this.scaleFuncY(this.ahz(i * 100)), 20, 1);
        }
        else {
          this.ctx.fillRect(this.ctxWindow.width-this.scaleWidth, this.ctxWindow.height - this.scaleFuncY(this.ahz(i * 100)), 10, 1);
        }
      }
    }
    else if (this.scaleMode === 'log') {
      let tmpScale = 1.01;
      for (var i = 0; i < (this.specMax/10); i++) {
        this.ctx.fillStyle = `rgba(100,100,200,1)`; // set color
        // this.ctx.fillStyle = `rgb(250,250,250)`; // set color
        if (i%1000 === 0) {
          this.ctx.fillRect(this.ctxWindow.width - this.scaleWidth, this.ctxWindow.height - this.scaleFuncY(this.ahz(i * 10)), 30*3, 1);
          // this.ctx.fillStyle = `rgb(100,100,100)`; // set color
          this.ctx.fillText(`${10*i}`, this.ctxWindow.width - this.scaleWidth*0.3, this.ctxWindow.height - this.scaleFuncY(this.ahz(i * 10)) - 3);
        }
        else if (i%100 === 0 && i <= 500) {
          this.ctx.fillRect(this.ctxWindow.width - this.scaleWidth, this.ctxWindow.height - this.scaleFuncY(this.ahz(i * 10)), 30*3, 1);
          // this.ctx.fillStyle = `rgb(100,100,100)`; // set color
          this.ctx.fillText(`${10*i}`, this.ctxWindow.width - this.scaleWidth*0.3, this.ctxWindow.height - this.scaleFuncY(this.ahz(i * 10)) - 3);
        }
        else if (i%50 === 0 && i >= 200) {
          this.ctx.fillRect(this.ctxWindow.width - this.scaleWidth, this.ctxWindow.height - this.scaleFuncY(this.ahz(i * 10)), 20*3, 1);
        }
        else if (i%10 === 0 && i <= 200) {
          if (i <= 60) {
            this.ctx.fillText(`${10*i}`, this.ctxWindow.width - this.scaleWidth*0.3, this.ctxWindow.height - this.scaleFuncY(this.ahz(i * 10)) - 3);
            this.ctx.fillRect(this.ctxWindow.width - this.scaleWidth, this.ctxWindow.height - this.scaleFuncY(this.ahz(i * 10)), 30*3, 1);
          }
          else {
            this.ctx.fillRect(this.ctxWindow.width - this.scaleWidth, this.ctxWindow.height - this.scaleFuncY(this.ahz(i * 10)), 10*3, 1);
          }
        }
        else if (i < 10){
          this.ctx.fillRect(this.ctxWindow.width - this.scaleWidth, this.ctxWindow.height - this.scaleFuncY(this.ahz(i * 10)), 7*3, 1);
        }
      }
      this.ctx.fillStyle = `rgb(250,250,250)`; // set color
      for (var i = 0; i < getBaseLog(tmpScale, this.specMax); i++) {
        if (i%40 == 0) {
          this.ctx.fillRect(this.ctxWindow.width - this.scaleWidth, this.ctxWindow.height - this.scaleFuncY(this.ahz(tmpScale**i)), 30, 1);
          this.ctx.fillText(`${Math.round(tmpScale**i)}`, this.ctxWindow.width - this.scaleWidth + 30, this.ctxWindow.height - this.scaleFuncY(this.ahz(tmpScale**i)));
        }
      }
    }
  }
  plot (position, color = "#000") {
    this.ctx.fillStyle = "rgba(0,0,0,0.4)";
    this.ctx.fillRect(
      this.ctxWindow.width - this.scaleWidth - this.spectrogramPixelWidth,
      this.ctxWindow.height - this.scaleFuncY(position+0.5) - 2,
      this.spectrogramPixelWidth,
      6);
    this.ctx.fillStyle = color;
    this.ctx.fillRect(
      this.ctxWindow.width - this.scaleWidth - this.spectrogramPixelWidth,
      this.ctxWindow.height - this.scaleFuncY(position+0.5),
      this.spectrogramPixelWidth,
      2);
  }
  lineAt (y1,y2,color,lineWidth=1) {
    this.ctx.beginPath();
    this.ctx.lineTo(
      this.ctxWindow.width - this.scaleWidth - this.spectrogramPixelWidth*2,
      this.ctxWindow.height - this.scaleFuncY(y1));
    this.ctx.lineTo(
      this.ctxWindow.width - this.scaleWidth - this.spectrogramPixelWidth,
      this.ctxWindow.height - this.scaleFuncY(y2));
    this.ctx.lineWidth = lineWidth;
    this.ctx.strokeStyle = color;
    this.ctx.stroke();
  }
}
