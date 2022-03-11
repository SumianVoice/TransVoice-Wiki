

let alertPitchInput = document.getElementById("alertPitch");
let alertPitch = alertPitchInput.value;


let alertSound = new Audio('sound/alert.mp3');
// let alertSound = document.getElementById("alert");
alertSound.oncanplaythrough = (event) => {
  // alertSound.play();
}

const a4 = 440;



function pitchAlertTest(fundamentalFreq) {
  alertPitch = alertPitchInput.value;
  if (fundamentalFreq < alertPitch) {
    if ((!alertSound.duration > 0 || alertSound.paused)) {
      alertSound.play();
      alertSound.currentTime = 0;
    }
  }
}
