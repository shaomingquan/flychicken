function Hero (info) {
  this.E = info.E
  this.posi = info.posi
  this.world = info.world
  this.metrics = info.metrics || Hero.baseHeroMetrics()
  this.properties = [] // 英雄的现场道具
  this.weapones = [] // 英雄的武器库，是一组高阶函数，作用于子弹
}

Hero.prototype.joinWorld = function () {
  let { Bodies, World } = this.E
  let { x, y } = this.posi
  let { height, width } = this.metrics
  let hero = this._instance = Bodies.rectangle(x, y, height, width)
  hero._isHero = true
  hero._obj = this

  hero.render.fillStyle = 'rgba(255, 0, 0, 1)'
  hero.render.strokeStyle = 'rgba(255, 0, 0, 0.7)'
  hero.render.lineWidth = '5'

  this.world.heros.push(this);

  World.add(this.world._instance, [hero]);
}

Hero.prototype.leaveWorld = function () {
  let { World } = this.E
  World.remove(this.world._instance, this._instance)
}

Hero.prototype.fuckedBy = function (bulletOfWeapon) {
  bulletOfWeapon.forEach(effect => effect(this))
  console.log(this.metrics.hp)
  if(this.metrics.hp <= 0) {
    this.leaveWorld()
  }
}

Hero.prototype.shoot = function (evePosi) {
  new Bullet({ // 要保证变量及时销毁
    E: this.E,
    hero: this,
    metrics: false,
    posi: evePosi
    // 子弹也有默认的metric
  })

  // TODO: 需要经过英雄当前持有武器的处理
}

Hero.prototype.isDead = function () {
  return this.metrics.hp <= 0
}

Hero.prototype.nextFrameFromSocket = function () {
  // 需要从socket同步其他人的数据
}

Hero.prototype.scaleupFOVto = function (val, times) {
  // 将视野扩大到指定值或者指定倍数

}

Hero.prototype.recoverFOV = function () {
  // 恢复视野
}

Hero.prototype.nextFrame = function () {
  let { Body } = this.E
  let { metrics } = this
  let {
    accelerationY, accelerationX,
    decelerationY, decelerationX,
    resistanceY, resistanceX,
    vY, vX,
    maxVY, maxVX,
    hasMotion,
    accY, acc_Y, accX, acc_X,
  } = metrics

  if(!hasMotion) {
    if(vY !== 0) {
      let nextvY;
      if(vY > 0) {
        nextvY = vY - resistanceY;
        if(nextvY * vY < 0) {
          nextvY = 0
        }
      } else {
        nextvY = vY + resistanceY;
        if(nextvY * vY < 0) {
          nextvY = 0
        }
      }
      metrics.vY = nextvY
    }

    if(vX !== 0) {
      let nextvX;
      if(vX > 0) {
        nextvX = vX - resistanceX;
        if(nextvX * vX < 0) {
          nextvX = 0
        }
      } else {
        nextvX = vX + resistanceX;
        if(nextvX * vX < 0) {
          nextvX = 0
        }
      }
      metrics.vX = nextvX
    }
  }

  if(accY) {
    if(vY < 0) { //reverse
      metrics.vY += decelerationY;
    } else {
      metrics.vY += accelerationY;
      metrics.vY = Math.min(metrics.vY, maxVY);
    }
  }

  if(accX) {
    if(vX < 0) { //reverse
      metrics.vX += decelerationX;
    } else {
      metrics.vX += accelerationX;
      metrics.vX = Math.min(metrics.vX, maxVX);
    }
  }

  if(acc_Y) {
    if(vY > 0) { //reverse
      metrics.vY -= decelerationY;
    } else {
      metrics.vY -= accelerationY;
      metrics.vY = Math.max(metrics.vY, -maxVY);
    }
  }

  if(acc_X) {
    if(vX > 0) { //reverse
      metrics.vX -= decelerationX;
    } else {
      metrics.vX -= accelerationX;
      metrics.vX = Math.max(metrics.vX, -maxVX);
    }
  }

  Body.setVelocity(this._instance, {x: metrics.vX, y: metrics.vY})
}

Hero.baseHeroMetrics = () => Object.assign({}, {
  width: 20,
  height: 20,
  fillStyle: 'rgba(255, 0, 0, 1)',
  strokeStyle: 'rgba(255, 0, 0, 0.7)',
  lineWidth: '5',

  hp: 100,
  accelerationY: 0.05,
  accelerationX: 0.03,

  // 制动加速度
  decelerationY: 0.1,
  decelerationX: 0.1,

  // 阻力
  resistanceY: 0.075,
  resistanceX: 0.065,

  // 当前速度
  vY: 0,
  vX: 0,

  // 横纵的最大速度
  maxVY: 6,
  maxVX: 3,

  // hero是否存在动力
  hasMotion: false,

  // 加速度开关
  accY: false,
  acc_Y: false,
  accX: false,
  acc_X: false,

  // 视野
  FOV: 1
})
