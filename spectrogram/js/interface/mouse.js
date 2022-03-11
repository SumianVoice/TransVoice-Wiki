

class _mouseListener {
  constructor(mousedownFunc, mouseupFunc) {
    this.keys = [];
    this.x = 0;
    this.y = 0;

    document.addEventListener('mousemove', event => {
      this.x = event.pageX;
      this.y = event.pageY;
    });
    document.addEventListener('mousedown', event => {
      if (!this.keys.includes(event.button)) {
        this.keys.push(event.button);
        mousedownFunc(event);
      }
    });
    document.addEventListener('mouseup', event => {
      this.keys.splice(this.keys.indexOf(event.button));
      mouseupFunc(event);
    });
  }
}


const enableMouseDebug = false;
if (enableMouseDebug) {
  function mouseUp(event) {
    if (event.button == 0) {;
    }
  }

  function mouseDown(event) {
    if (event.button == 0) {
      // alert("LMB DOWN");
    }
  }

  let m = new _mouseListener(mouseUp, mouseDown);

}
