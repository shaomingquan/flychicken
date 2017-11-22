function World (info) {
  this.E = info.E;
  this._instance = info._instance;
  this.engine = info.engine;
  this.metrics = info.metrics;
  this.lockedHero = null;
  this.heros = [];
  /*
  世界宽度
  世界高度
  heros
  视角锁定hero
  */
  this.initRender()
  this.initWorld()
  this.makeBound()
  this.bootStrapLoop()
}
World.prototype.initRender = function () {
  let { vPortWidth, vPortHeight } = this.metrics;
  let { Render } = this.E;
  let { engine } = this;
  this.render = Render.create({
    element: document.body,
    engine,
    options: {
        width: vPortWidth,
        height: vPortHeight,
        // showAngleIndicator: true,
        hasBounds: true,
        wireframes: false
    }
  });
}

World.prototype.initWorld = function () {
  let world = this._instance;
  let {width, height} = this.metrics;

  world.gravity.y = 0;

  world.bounds.min.x = 0;
  world.bounds.min.y = 0;
  world.bounds.max.x = width;
  world.bounds.max.y = height;
}

World.prototype.makeBound = function () {
  let { width, height } = this.metrics;
  let {thicknessOfBound} = this.metrics;
  let STATIC = { isStatic: true };

  let { Bodies, World } = this.E;
  let bounds = [
/* 上 */ Bodies.rectangle(
          width / 2,
          0,
          width,
          thicknessOfBound,
          STATIC
        ),
/* 下 */ Bodies.rectangle(
          width / 2,
          height,
          width,
          thicknessOfBound,
          STATIC
        ),
/* 左 */Bodies.rectangle(
          0,
          height / 2,
          thicknessOfBound,
          width,
          STATIC
        ),
/* 右 */Bodies.rectangle(
          width,
          height / 2,
          thicknessOfBound,
          width,
          STATIC
        ),
  ]
  World.add(this._instance, bounds)
}

World.prototype.lockon = function (hero) {
  this.lockedHero = hero // so it is me
}

function scaletounithhhwww (hhh, www) {
  var diagonal = Math.sqrt(hhh**2 + www**2)
  return {
    unith: (hhh / diagonal) * 2.5 * myr,
    unitw: (www / diagonal) * 2.5 * myr
  }
}


World.prototype.bootStrapLoop = function () {
  var canvasEle = document.getElementsByTagName('canvas')[0]
  var cWidth = canvasEle.width;
  var cHeight = canvasEle.height;
  var viewportCentre = {
    x: cWidth * 0.5,
    y: cHeight * 0.5
  };
  var yourPositionAbs = Object.assign({}, viewportCentre);
  let { Events, Body } = this.E
  let world = this._instance
  // 安装循环
  Events.on(engine, 'beforeUpdate', event => {
    this.heros.forEach(hero => {
      if(hero === this.lockedHero) {
        hero.nextFrame()
      } else {
        hero.nextFrameFromSocket()
      }
    })

    let lockedHeroInstance = this.lockedHero._instance
    let dead = this.lockedHero.isDead();
    if(!dead) { // 视角，自己挂了之后则可以选择看谁的视角

      var aposi = this.controller.getMousePosition();
      var viewOffsetX = (aposi.x - viewportCentre.x) / 3;
      var viewOffsetY = (aposi.y - viewportCentre.y) / 3;


      yourPositionAbs.x = viewportCentre.x + viewOffsetX;
      yourPositionAbs.y = viewportCentre.y + viewOffsetY;

      var www = aposi.x - yourPositionAbs.x;
      var hhh = aposi.y - yourPositionAbs.y;
      var ang = Math.atan(hhh / www)
      Body.setAngle(lockedHeroInstance, ang)
      // Fallow Hero X
      this.render.bounds.min.x = lockedHeroInstance.position.x - cWidth / 2 + viewOffsetX;
      this.render.bounds.max.x = lockedHeroInstance.position.x + cWidth / 2 + viewOffsetX;

      // Fallow Hero Y
      this.render.bounds.min.y = lockedHeroInstance.position.y - cHeight / 2 + viewOffsetY;
      this.render.bounds.max.y = lockedHeroInstance.position.y + cHeight / 2 + viewOffsetY;

    } else {

    }
  })
}
