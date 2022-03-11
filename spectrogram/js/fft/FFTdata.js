

class _spectrogram {
  constructor() {
    this.data = false;
    this.analyser = false;
  }
  init(stream) {
    this.audioCtx = new AudioContext();
    this.analyser = this.audioCtx.createAnalyser();
    this.analyser.fftSize = 2048*4;
    this.tmpStream = this.audioCtx.createMediaStreamSource(stream);
    this.audioCtx.createMediaStreamSource(stream).connect(this.analyser);
    this.analyser.smoothingTimeConstant = 0.02;

    this.data = new Uint8Array(this.analyser.frequencyBinCount);

    this.analyserFrequencyBinCount = this.analyser.frequencyBinCount;
    this.analyserSampleRate = this.audioCtx.sampleRate;
  }
  update() {
  this.analyser.getByteFrequencyData(this.data);
    //
    // if (!this.data) {return this.data}
    // this.analyser.getByteTimeDomainData(this.data);
    // this.empty = new Uint8Array(this.data.length);
    // transform(this.data, this.empty);
    // console.log(this.empty);
  }
}
