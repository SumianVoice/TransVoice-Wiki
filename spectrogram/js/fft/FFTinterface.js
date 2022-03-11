




class _fftInterface {
  constructor(sampleRate, frequencyBinCount, ctxWindow) {
    this.sampleRate = sampleRate;
    this.frequencyBinCount = frequencyBinCount;
    this.scaleX = 1;
    this.scaleY = 1;
    this.scaleMode = 'linear';
    this.ctx = ctxWindow;
    this.logScale = 1.03;
    this.specMin = 0;
    this.specMax = 10000;
  }
  updateScale(x) {
    if (this.scaleMode == 'linear') {
      this.scaleX = this.ctx.width / this.ahz(this.specMax-this.specMin);
      this.scaleY = this.ctx.height / this.ahz(this.specMax-this.specMin);
    }
    else if (this.scaleMode == 'log') {
      this.scaleX = this.ctx.width / this.getBaseLog(this.logScale, fftConvert.ahz(this.specMax-this.specMin));
      this.scaleY = this.ctx.height / this.getBaseLog(this.logScale, fftConvert.ahz(this.specMax-this.specMin));
    }
    // this.scaleX = x;
  }
  //
  getBaseLog(base, number) {
    return Math.round(Math.log(number) / Math.log(base)*1000000000)/1000000000;
  }
  //
  unBaseLog(answer, base) {
     return (base ** answer);
  }
  // converts array position to hz
  hz(index) {
    let tmphz = (index / this.frequencyBinCount) * (this.sampleRate/2);
    return tmphz;
  }
  // converts hz to array position (float)
  ahz(hz) {
    let tmpIndex = (hz / (this.sampleRate/2)) * this.frequencyBinCount;
    return tmpIndex;
  }
  // applies scaling (e.g. logarithm)
  scaleFunc(input) {

    if (this.scaleMode == 'linear') {
      return (input * this.scaleX);
    }
    else if (this.scaleMode == 'log') {
      return this.getBaseLog(this.logScale, input) * this.scaleX;
    }
  }
  // undoes scaling
  unscale(input) {

    if (this.scaleMode == 'linear') {
      let tmp = input / this.scaleX;
      return (tmp);
    }
    else if (this.scaleMode == 'log') {
      return this.unBaseLog(input / this.scaleX, this.logScale);
    }
  }
  // applies scaling (e.g. logarithm)
  scaleFuncY(input) {

    if (this.scaleMode == 'linear') {
      return (input * this.scaleY);
    }
    else if (this.scaleMode == 'log') {
      return this.getBaseLog(this.logScale, input) * this.scaleY;
    }
  }
  // undoes scaling
  unscaleY(input) {

    if (this.scaleMode == 'linear') {
      let tmp = input / this.scaleY;
      return (tmp);
    }
    else if (this.scaleMode == 'log') {
      return this.unBaseLog(input / this.scaleY, this.logScale);
    }
  }
}
