




class _ibutton{
  constructor(onClickFunction = null) {
    this.self = new _button();
  }
  setSize(width, height) {
    return this.self.setSize(width, height)
  }
  setPos(x,y) {
    return this.self.setPos(x,y)
  }
  setText(text) {
    return this.self.setText(text)
  }
  setFunction(onClickFunction) {
    return this.self.setFunction(onClickFunction)
  }
  onClick() {
    return this.self.onClickFunction();
  }
  draw(ctx) {
    return this.self.draw(ctx);
  }
  isOverlapping(x,y) {
    return this.self.isOverlapping(x,y);
  }
}
