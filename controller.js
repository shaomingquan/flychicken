function Controller (info) {
  let E = this.E = info.E
  this.world = info.world
  this.world.controller = this;
  this.mouse = E.Mouse.create(this.world.render.canvas)

  this.initKeyboard()
  this.initClick()
}

Controller.prototype.getMousePosition = function () {
  return this.mouse.absolute
}

Controller.prototype.addControlTo = function (hero) {
  this.target = hero;
  hero.controller = this;
}

Controller.prototype.initClick = function () {
  // 这里看controller的状态
  // 有可能是那种需要选定敌人的
  // 简单来讲就是让controller的target发射子弹
  document.addEventListener('click', () => {
    this.target.shoot(this.mouse.absolute)
  })
}

Controller.prototype.initKeyboard = function () {
  let codeDirectionMap = new Map();
  codeDirectionMap.set(87, 'up');
  codeDirectionMap.set(83, 'down');
  codeDirectionMap.set(65, 'left');
  codeDirectionMap.set(68, 'right');

  // 控制按键
  var whenkeyXDown = new Map();
  var whenkeyXUp = new Map();

  // 飞船是否存在动力
  var hasMotion = false;
  var getMotion = f => _ => {this.target.metrics.hasMotion = true; f()}
  var outofMotion = f => _ => {this.target.metrics.hasMotion = false; f()}
  whenkeyXDown.set('down',  getMotion(_ => this.target.metrics.accY = true));
  whenkeyXUp.set('down',    outofMotion(_ => this.target.metrics.accY = false));
  whenkeyXDown.set('up',    getMotion(_ => this.target.metrics.acc_Y = true));
  whenkeyXUp.set('up',      outofMotion(_ => this.target.metrics.acc_Y = false));
  whenkeyXDown.set('right', getMotion(_ => this.target.metrics.accX = true));
  whenkeyXUp.set('right',   outofMotion(_ => this.target.metrics.accX = false));
  whenkeyXDown.set('left',  getMotion(_ => this.target.metrics.acc_X = true));
  whenkeyXUp.set('left',    outofMotion(_ => this.target.metrics.acc_X = false));

  document.addEventListener('keydown', e => {
    if(!this.target) return
    var code = (e.keyCode || e.which);
    var direction = codeDirectionMap.get(code);
    if(!direction) return
    whenkeyXDown.get(direction)();
  })
  document.addEventListener('keyup', e => {
    if(!this.target) return
    var code = (e.keyCode || e.which);
    var direction = codeDirectionMap.get(code);
    if(!direction) return
    whenkeyXUp.get(direction)();
  })
}
