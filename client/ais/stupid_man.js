/*

傻瓜AI

*/

(function () {
  var AI = window.Stupid_AI = function ({ai, enemies}) { // 敌人是玩家
    this.enemies = enemies // TOFIX: 这边会仍然引用，不过其实问题很小
    this._instance = ai
    ai.ai = this
    this.actOn()
  };

  AI.prototype.logout = function () {
    clearInterval(this.timer)
  }

  AI.prototype.listenRealTimeMetric = function (callback1, callback2, callback3) {
    // 操控运动轨迹，这里是个很傻的版本
    var accDirection = ['accX', 'accY', 'acc_X', 'acc_Y']
    var count = 0
    var metrics = {}
    this.timer = setInterval(() => {
      accDirection.forEach(metric => metrics[metric] = false)
      metrics[accDirection[count % 4]] = true
      if(count % 3 === 2) {
        callback3({
          action: 'shoot',
          metrics: {
            position: this.enemies[0].getPosition()
          }
        })
      }
      callback1(metrics)
      count ++
    }, 1000 + Math.random() * 400)
  }

  AI.prototype.actOn = function () {
    var aiIHero = this._instance // ai hero
    // 设置一些初始规则，监听
    this.listenRealTimeMetric(function (metrics) { // 监听敌人指标变化，位置变化(矫正，或者瞬移)，动作变化
      aiIHero.metrics = Object.assign(aiIHero.metrics, metrics)
    }, function (posi) {

    }, function (act) {
      aiIHero[act.action](act.metrics.position)
    })
  }

  AI.prototype.actOfEveryFrame = function () {
    // 操控转向方位，<del>射击方位，射击动作等</del>
  }
} ())
