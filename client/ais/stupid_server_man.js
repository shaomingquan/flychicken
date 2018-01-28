/*

从服务端同步过来的AI

VERBOSE

*/


(function () {
  var AI = window.Stupid_SAI = function ({ai, options}) { // 敌人是玩家
    this.enemies = enemies // TOFIX: 这边会仍然引用，不过其实问题很小
    this._instance = ai
    ai.ai = this
  };
} ())
