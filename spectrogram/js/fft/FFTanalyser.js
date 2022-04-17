


function getBaseLog(base, number) {
  return Math.round(Math.log(number) / Math.log(base)*1000000000)/1000000000;
}
//
function unBaseLog(answer, base) {
   return (base ** answer);
}
// converts array position to hz


class _fftAnalyser {
  constructor(data) {
    this.data = data;
    this.lastFundamentalIndex = 0;
  }
  // try to find the fundamental index
  getFundamental(array) {
    // get highest peak
    let highestPeak = 0;
    for (var i = 0; i < array.length; i++) {
      if (array[i] > highestPeak) {
        highestPeak = array[i];
      }
    }
    let peakThreshold = highestPeak * 0.7; // only look at things above this theshold
    let currentPeakIndex = 0;
    let currentPeakAmplitude = 0;
    for (var i = 0; i < array.length; i++) {
      // only look above threshold
      if (array[i] > peakThreshold) {
        // look for peaks
        if (array[i] > currentPeakAmplitude) {
          currentPeakIndex = i;
          currentPeakAmplitude = array[i];
        }
      }
      else if (currentPeakIndex > 0) {
        return {"index" : currentPeakIndex, "amplitude" : currentPeakAmplitude};
      }
    }
    return {"index" : 0, "amplitude" : 0};
  }
  getFundamentalOld(patternPeaks, patternAvg, data) {
    if (patternPeaks && patternAvg) {
      let bestFundamentalGuess = 0;
      const sensitivity = 30;

      // find the first time there is a peak
      for (var i = 0; i < patternAvg.length; i++) {
        if (patternAvg[i] + 50 < data[i]) {
          // potential fundamental start
          bestFundamentalGuess = i;
          break;
        }
      }
      // go up the peak until you start going down again
      let highestAmplitude = data[bestFundamentalGuess];
      for (var i = bestFundamentalGuess; i < patternAvg.length; i++) {
        if (data[i] > highestAmplitude && data[i] > fundamentalMinAmplitude) {
          highestAmplitude = data[i];
          bestFundamentalGuess = i;
        }
        else if (data[i] < highestAmplitude - sensitivity) {
          break;
        }
        // else if (i > bestFundamentalGuess * 1.5) {
        //   break;
        // }
      }
      this.lastFundamentalIndex = bestFundamentalGuess;
      return (bestFundamentalGuess);
    }
  }
  // gets an average amplitude across many array (freq) positions
  movingAverage(array, span) {
    let newArray = new Array(array.length);
    let tmpCurAvg = 0;
    let totalDiv = 0;
    for (let i = 0; i < array.length; i++) {
      totalDiv = 0;
      tmpCurAvg = 0;
      for (var l = i-span; l < i+span; l++) {
        if (l > 0 && l < array.length) {
          tmpCurAvg += array[l];
          totalDiv += 1;
        }
      }
      // tmpCurAvg = (array[i] + tmpCurAvg*span) / (span+1);
      newArray[i] = tmpCurAvg / totalDiv;
    }
    return newArray;
  }
  // gets an average amplitude across many array (freq) positions
  movingAverageC(array, span) {
    let newArray = new Array(array.length);
    let tmpAvg = 0;
    for (let i = 0; i < array.length; i++) {
      let tmpTotal = 0;
        for (let l = Math.max(i-span, 0); l < Math.min(i+span, array.length); l++) {
          tmpTotal += array[l];
        }
        if (i-span < 0) {
          tmpTotal += array[0]*(i-span)*-1;
        }
        if (i+span > array.length) {
          tmpTotal += array[array.length-1]*((i+span)*-1 - array.length-1);
        }
      let dataCount = span * 2;
      tmpAvg = tmpTotal / dataCount;
      newArray[i] = tmpAvg;
    }
    return newArray;
  }
  // gets an average amplitude across many array (freq) positions
  movingAverageB(array, span) {
    let newArray = new Array(array.length);
    let tmpAvg = array[0];
    for (let i = 0; i < array.length; i++) {
      newArray[i] = (array[i] + tmpAvg*span)/(span+1);
      tmpAvg = newArray[i];
    }
    return newArray;
  }
  // gets highest point in segments
  getPeaks(array, baseSegmentSize, logPeaksScale) {
    let segmentSize = baseSegmentSize;
    let curSegment = 1;
    let segmentStart = 0;

    let peaks = new Array(0); // make a blank array for adding to later

    let tmpPeakIndex = 0;
    let tmpPeakValue = 0;
    peaks.push([1,10]);
    for (let k = 0; k < array.length; k++) {
      // tmpPeakIndex = k;
      if (array[k] >= tmpPeakValue) {
        tmpPeakIndex = k;
        tmpPeakValue = array[k];
      }

      if (k >= segmentStart + segmentSize) { // when you get to the end of the segment
        peaks.push([tmpPeakIndex, tmpPeakValue]);
        // peaks[curSegment][0] = tmpPeakIndex;
        // peaks[curSegment][1] = tmpPeakValue;

        segmentSize = unBaseLog(logPeaksScale, curSegment) * baseSegmentSize;
        segmentStart = k;
        curSegment++;
        tmpPeakValue = 0;


      }
    }
    // console.log(peaks);
    // console.log(segmentSize);
    return peaks;
  }
  //
  getAccumAvg(sampleArray, array, span) {
    if (!array) {
      array = new Array(sampleArray.length);
      for (var i = 0; i < array.length; i++) {
        array[i] = new Array(2);
        array[i][0] = 0;
        array[i][1] = 0;
      }
    }
    for (var i = 0; i < Math.min(array.length, sampleArray.length); i++) {
      array[i][0] = (sampleArray[i][0] + array[i][0]*(span-1)) / span;
      array[i][1] = (sampleArray[i][1] + array[i][1]*(span-1)) / span;
    }
    return array;
  }
  //
  getFormants(array, formants) {
    let newFormants = [[0,0],[0,0],[0,0]];

    let highestPeak = 0;
    // for (var i = 1; i < array.length; i++) {
    //   if (array[i][1] > highestPeak) {
    //     highestPeak = array[i][1]
    //   }
    // }
    let minAmp = highestPeak;
    let avgPos = 0;
    let avgAmp = 0;
    let totalDiv = 0;
    const tmpExp = 40;
    for (var i = 1; i < array.length-1; i++) {
      // only look at the third formant back
      if (array[i][1] > newFormants[0][1]) {
        if (array[i-1][1] < array[i][1] && array[i][1] > array[i+1][1]) {
          avgAmp = (array[i][1] + array[i-1][1] + array[i+1][1]) / 3;
          avgPos = 0;
          totalDiv = 0;
          for (var l = -1; l < 2; l++) {
            avgPos += array[(i+l)][0] * array[i+l][1]**tmpExp;
            totalDiv += array[i+l][1]**tmpExp;
          }
          avgPos = avgPos / totalDiv;
          newFormants.shift();
          // newFormants.push(array[i]);
          // newFormants.push([array[i][0],avgAmp]);
          newFormants.push([avgPos,array[i][1]]);
        }
      }
    }

    // let currentPeak = [0,0];
    // for (var i = 1; i < array.length; i++) {
    //   // only look above threshold
    //   if (array[i][1] > minAmp) {
    //     // look for peaks
    //     if (array[i][1] > currentPeak[1]) {
    //       currentPeak = array[i];
    //     }
    //     else if (array[i][1] < currentPeak[1]*0.3) {
    //       newFormants.shift();
    //       newFormants.push(currentPeak);
    //     }
    //   }
    //   // else if (currentPeakIndex > 0) {
    //   //   return {"index" : currentPeakIndex, "amplitude" : currentPeakAmplitude};
    //   // }
    // }
      //
    return newFormants;
  }
  getFormantsB(array, formants) {
    let newFormants = [[0,0],[0,0],[0,0]];
    let lastPeak = [0,0];
    let minAmp = 150;
    for (var i = 1; i < array.length; i++) {
      // only look at the third formant back
      if (array[i][1] > newFormants[0][1]) {
        if (array[i-1][1] < array[i][1] || array[i][1] > array[i+1][1]) {
          newFormants.shift();
          newFormants.push(array[i]);
        }
      }
    }
    return newFormants;
  }
}
