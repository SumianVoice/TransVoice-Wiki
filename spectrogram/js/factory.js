


class _factory {
  constructor() {
    this.debugSubstitute = false;
  }
  //
  createfftSpectrogramDisplay(data, ctxWindow, convert) {
    return new _fftSpectrogramDisplay(data, coctxWindowntext, convert);
  }
  createfftAnalyser(data, convert) {
    return new _fftAnalyser(data);
  }
  createfftInterface(sampleRate, frequencyBinCount, ctxWindow, convert) {
    return new _fftInterface(sampleRate, frequencyBinCount);
  }
  createButton(x,y,text,width,height,onClickFunction=null) {
    let tmpButton = new _ibutton(onClickFunction);
    tmpButton.setPos(x,y);
    tmpButton.setText(text);
    tmpButton.setSize(width,height);
    tmpButton.setFunction(onClickFunction);
    return tmpButton;
  }
  createSpectrogram(data, context, drawScale) {
    return new _spectrogram(data, context, drawScale);
  }
  createCtxArea(ctx, x, y, w, h) {
    return new _ctxWindow(ctx, x, y, w, h);
  }
}
