

navigator.mediaDevices.getUserMedia({ audio: true }).then(spectrum).catch(console.log);


const canvasSpec = div.appendChild(document.createElement('canvas'));
canvasSpec.width = window.innerWidth;
canvasSpec.height = window.innerHeight;
const ctxSpec = canvasSpec.getContext('2d');

const canvas = div.appendChild(document.createElement('canvas'));
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;
const ctx = canvas.getContext('2d');


function setCanvasSize() {
  if (canvas.width !== window.innerWidth || canvas.height !== window.innerHeight) {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    fftCtx.setSize(canvas.width, canvas.height - 80);
    fftDraw.updateScale();
  }
  if (canvasSpec.width !== window.innerWidth || canvasSpec.height !== window.innerHeight) {
    canvasSpec.width = window.innerWidth;
    canvasSpec.height = window.innerHeight;
    specCtx.setSize(canvasSpec.width, canvasSpec.height - 80);
    spectrogram.updateScale();
    spectrogram.fillScreen();
  }
}

let fft;
let fftCtx;
let fftDraw;
let fftAnalyse;
let specCtx;
let spectrogram;

function noZeroes(array) {
  let arrayOut = new Array();
  for (var i = 0; i < array.length; i++) {
    if (array[i] !== 0) {
      arrayOut.push(array[i]);
    }
  }
  return arrayOut;
}

let tmp = 0;
let peaks;
let movAvg;
let movAvgPeaks;
let smoothMovAvg;
let smoothPeaks;
let formants = [[0,0],[0,0],[0,0],[0,0]];
let oldFormants = { ...formants };

let pitchAvg = 0;
let showControls = false;
let tracking = "none";
let formantTrackingVisibility = false;

function roundRect(x, y, w, h, radius) {
  var canvas = canvas;
  var context = ctx;
  var r = x + w;
  var b = y + h;
  context.beginPath();
  // context.strokeStyle="green";
  // context.lineWidth="4";
  context.moveTo(x+radius, y);
  context.lineTo(r-radius, y);
  context.quadraticCurveTo(r, y, r, y+radius);
  context.lineTo(r, y+h-radius);
  context.quadraticCurveTo(r, b, r-radius, b);
  context.lineTo(x+radius, b);
  context.quadraticCurveTo(x, b, x, b-radius);
  context.lineTo(x, y+radius);
  context.quadraticCurveTo(x, y, x+radius, y);
  context.fill();
}

function spectrum(stream) {
  // make the spectrogram
  fft = new _spectrogram();
  fft.init(stream);
  specCtx = new _ctxWindow(ctxSpec, 0, 0, canvasSpec.width, canvasSpec.height-80);
  fftCtx = new _ctxWindow(ctx, 0, 0, canvas.width, canvas.height-80);
  fftDraw = new _fftSpectrogramDisplay(fft.data, fftCtx, fft.audioCtx.sampleRate, fft.analyser.frequencyBinCount);
  fftAnalyse = new _fftAnalyser(fft.data);
  spectrogram = new _spectrogram2d(fft.data, specCtx, fft.audioCtx.sampleRate, fft.analyser.frequencyBinCount);
  spectrogram.canvas = canvasSpec;
  spectrogram.setEnable(true);
  spectrogram.fillScreen();
  //
  buttonsInit();
  // console.log(fft.analyser.getByteFrequencyData);
  console.log(fft.analyser.getByteFrequencyData);
  //
  setInterval(() => { //loops
    setCanvasSize();
    ctx.font = "10px Georgia";
    // fft spectrum
    // fft.refresh();
    fft.update();
    // console.log(fft.data);
    // fft.analyser.getByteTimeDomainData(fft.data);
    // console.log(fft.data.length);
    //
    fftDraw.clear();
    if (fft.data) {
      peaks = fftAnalyse.getPeaks(fft.data, 2, 1.4);
      movAvg = fftAnalyse.movingAverage(fft.data,10);
      movAvg = fftAnalyse.movingAverage(movAvg,10);
      movAvgPeaks = fftAnalyse.getPeaks(movAvg, 10, 1);
      // smoothMovAvg = fftAnalyse.getAccumAvg(movAvgPeaks, smoothMovAvg, 2);
      smoothPeaks = fftAnalyse.getAccumAvg(peaks, smoothPeaks, 10);
      // formants = fftAnalyse.getAccumAvg(fftAnalyse.getFormants(smoothMovAvg, formants), formants, 4);
      // formants = fftAnalyse.getAccumAvg(fftAnalyse.getFormants(smoothMovAvg, formants), formants, 4);
    }
    if (fftDraw.enable && fft.data) {
      fftDraw.updateScale();
      fftDraw.render();
      // fftDraw.lineFFTPlot(fftDraw.data, "#24a", 1);
    }
    if (formantTrackingVisibility && movAvgPeaks) {
      oldFormants = { ...formants };
      formants = fftAnalyse.getFormants(movAvgPeaks, formants);
    }
    fftDraw.scaleRender();
    let fundamental = fftAnalyse.getFundamental(fft.data);

    if ((m.x < 300 && m.y < 200)) {
      showControls = true;
      alertPitchInput.style.visibility = "visible";
    }
    else {
      showControls = false;
      alertPitchInput.style.visibility = "hidden";
    }
    if (showControls) {
      buttonList.drawAll(ctx);
    }
    if (smoothPeaks) {
      fftDraw.linePlot(smoothPeaks, "#14a");
    }
    if (smoothMovAvg) {
      fftDraw.linePlot(smoothMovAvg, "#a4a", 1);
    }
    // if (movAvg) {
    //   fftDraw.lineFFTPlot(movAvg, `rgba(250,0,250,0.6)`, 2);
    // }
    if (formants && formantTrackingVisibility) {
      if (fftDraw.enable) {
        fftDraw.dotPlot(formants, "#ffa", 10);
      }
      if (spectrogram.enable) {
        if (formants[0][1] > 40) {spectrogram.plot(formants[0][0], "#f3f");}
        if (formants[1][1] > 40) {spectrogram.plot(formants[1][0], "#ff1")}
        if (formants[2][1] > 40) {spectrogram.plot(formants[2][0], "#6ff")}
      }
      // if (spectrogram.enable) {
      //   for (var i = 0; i < formants.length; i++) {
      //     if (formants[i][1] >=40 && Math.abs(formants[i][0] - oldFormants[i][0]) <20 ) {
      //       spectrogram.lineAt (formants[i][0],oldFormants[i][0],"#fff",2);
      //     }
      //   }
      // }
    }

    if (m.keys.includes(0)) {
      fftDraw.cursorRender(m.x, m.y);
      spectrogram.cursorRender(m.x, m.y, fftDraw.ctx);
      ctx.fillStyle = '#ff3';
      ctx.font = "20px Arial";
      // ctx.fillText(lookupNote(spectrogram.hz(m.y)), m.x,m.y + 20)
    }
    //spectrogram 2d
    spectrogram.draw();
    spectrogram.scaleRender();
    //
    if (fundamental && fundamental.amplitude > 150 && !spectrogram.paused) {
      pitchAvg = ((pitchAvg * 1) + Math.max(fundamental.index,1))/2;
      pitchAlertTest(fftDraw.hz(pitchAvg));
      fftDraw.drawCursorAt((pitchAvg), 200, "#2f2", 2);
      spectrogram.drawCursorAt((pitchAvg), 200, "#2f2", 2, fftDraw.ctx);
      ctx.fillStyle = '#ff3';
      ctx.font = "20px Arial";
      ctx.fillText(lookupNote(fftDraw.hz(pitchAvg)), 300,35)
      ctx.fillText(`~${Math.round(fftDraw.hz(pitchAvg))}Hz`, 350,35)
    }
    else {
      if (fundamental) {
        fftDraw.drawCursorAt(fundamental.index, fundamental.amplitude, "#ff0", 1);
        spectrogram.drawCursorAt((pitchAvg), 200, "#ff2", 2, fftDraw.ctx);
      }
    }
    if (tracking === "all") {
      if (fundamental && fundamental.amplitude > 150) {
        spectrogram.plot(pitchAvg, `RGBA(20,250,10,0.7)`);
      }
      // for (var i = 0; i < smoothMovAvg.length; i++) {
      //   spectrogram.plot(smoothMovAvg[i][0], `rgba(250,250,50,${smoothMovAvg[i][1]/255 > 0.2 ? smoothMovAvg[i][1]/200 : 0})`);
      // }
    }
    //
  }, (33));
  console.log(fft.audioCtx.sampleRate, (1000 * canvas.width) / fft.audioCtx.sampleRate);
}





//
