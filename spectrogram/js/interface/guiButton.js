




class _button{
  constructor(onClickFunction = null) {
    this.onClickFunction = onClickFunction;
    this.x = 0;
    this.y = 0;
    this.width = 0;
    this.height = 0;
    this.text = "";
    this.child = null;
  }
  childBind(child) {
    this.child = child
  }
  // set size
  setSize(width, height) {
    this.width = width;
    this.height = height;
  }
  // set position
  setPos(x,y) {
    this.x = x;
    this.y = y;
  }
  // set the display text
  setText(text) {
    this.text = text;
  }
  // set the on click function
  setFunction(onClickFunction) {
    this.onClickFunction = onClickFunction;
  }
  // call the function stored
  click() {
    this.onClickFunction(this.child);
  }
  // draw the button on the ctx
  draw(ctx) {
    ctx.fillStyle = `rgba(200,200,200,0.3)`;
    ctx.fillRect((this.x), this.y, this.width, this.height);
    ctx.fillStyle = `rgb(9,9,9)`;
    ctx.font = "20px Arial";
    ctx.fillText(this.text, (this.x) + 10, this.y + this.height/2 + 8);
  }
  // return true if [x,y] is in the object
  isOverlapping(x,y) {
    if (
    x > this.x && x < this.x + this.width &&
    y > this.y && y < this.y + this.height) {
      return true;
    }
    else {return false;}
  }
}

class _buttonContainer {
  constructor() {
    this.buttons = new Array(0);
  }
  add(button) {
    this.buttons.push(button);
    return button;
  }
  drawAll(ctx) {
    for (var i = 0; i < this.buttons.length; i++) {
      this.buttons[i].draw(ctx);
    }
  }
  clickTest(x,y) {
    for (var i = 0; i < this.buttons.length; i++) {
      const cur = this.buttons[i];
      if ((x > cur.x && x < cur.x + cur.width) && (y > cur.y && y < cur.y + cur.height)) {
        cur.click();
      }
    }
  }
}



//
