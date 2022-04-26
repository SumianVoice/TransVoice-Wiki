
function buildiframe_yt(id="null",src="https://wiki.sumianvoice.com/404") {
  let x = document.getElementById(id);
  if (!x) {return false;}
  x.outerHTML = `
  <p align="left">
      <iframe
      width="560"
      height="315"
      src="https://www.youtube.com/embed/${src}"
      title="YouTube video player"
      frameborder="0"
      allow=
      "
        accelerometer;
        autoplay;
        clipboard-write;
        encrypted-media;
        gyroscope;
        picture-in-picture
      "
      allowfullscreen></iframe>
  </p>`;
}
// loading="lazy"
