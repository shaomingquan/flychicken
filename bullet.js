// 子弹对象

function Bullet (info) {
  this.E = info.E
  this.hero = info.hero
  this.world = this.hero.world
  this.mousePosi = info.posi
  this.metrics = Object.assign(Bullet.baseBulletMetrics(), info.metrics || {})
  this._instance = this.makeBullectInstance()
  this._instance._isBullet = true
  this._instance._obj = this

  this.timerForRemove = null
  this.willRemoveItSelf()
  /*
  hero 谁的子弹
  hurt 伤害值
  unitv 单位速度
  长
  宽
  颜色
  */
}
function scaletounit (vDistance, hDistance) {
  var diagonal = Math.sqrt(vDistance**2 + hDistance**2)
  return {
    unitVDistance: (vDistance / diagonal) * 20,
    unitHDistance: (hDistance / diagonal) * 20
  }
}

Bullet.prototype.attck = function () {
  // 跟现在的武器有关
  return [hero => hero.metrics.hp -= this.metrics.hurt]
}

Bullet.prototype.makeBullectInstance = function () {
  // 根据英雄的位置构造一个子弹
  var { Body, Bodies, World } = this.E
  var { x, y } = this.hero.fixedPosi // 这里一定取固定位置！
  var heroX = x
  var heroY = y

  var { x, y } = this.hero.controller.mouse.absolute
  var mx = x
  var my = y

  // TODO 需要通过weapon处理得当一份新的metric
  // TODO 需要设计单发和连发的机制（单发也就是连发间隔无限长）

  // 通过子弹的metric信息，计算角度，子弹起始位置，子弹速度
  var vDistance = my - heroY
  var hDistance = mx - heroX

  var angle = Math.atan(vDistance / hDistance)
  var { unitVDistance, unitHDistance } = scaletounit(vDistance, hDistance); // 单位长度
  var heroAbsX = this.hero._instance.position.x
  var heroAbsY = this.hero._instance.position.y
  bulletposistart  = {
    x: heroAbsX + unitHDistance,
    y: heroAbsY + unitVDistance
  }

  var { length, width, render_fillStyle, unitv, hurt } = this.metrics
  var bullet = Bodies.rectangle(
    bulletposistart.x,
    bulletposistart.y,
    length,
    width,
    {angle}
  )
  Body.setVelocity(bullet, {x: unitHDistance * unitv, y: unitVDistance * unitv})
  bullet._append = {}
  bullet._append.hurt = hurt
  bullet.render.fillStyle = render_fillStyle

  World.add(this.world._instance, [bullet])
  return bullet
}

Bullet.prototype.removeBecauseHit = function () {
  let { World } = this.E
  clearTimeout(this.timerForRemove)
  this.timerForRemove = setTimeout(() => {
    World.remove(this.world._instance, this._instance)
    clearTimeout(this.timerForRemove)
  }, 17)
}

Bullet.prototype.willRemoveItSelf = function () {
  // 伴随着碰撞清空现在的timer，创建新的time
  let { World } = this.E
  this.timerForRemove = setTimeout(() => {
    World.remove(this.world._instance, this._instance)
    clearTimeout(this.timerForRemove)
  }, 5000)
}

Bullet.baseBulletMetrics = () => Object.assign({}, {
  hurt: 10, // 伤害值
  render_fillStyle: 'aqua', // 默认颜色
  unitv: 1, // 单位速度
  length: 16,
  width: 3
})
