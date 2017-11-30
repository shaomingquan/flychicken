// 翻译

(function () {
  var t = window.translater = {}
  var hero = t.hero = {}
  var heroMetrics = hero.metrics = {}
  heroMetrics.x = { en: "", zh: "水平坐标", normalize: {zh: val => val.toFixed(2)} }
  heroMetrics.y = { en: "", zh: "垂直坐标", normalize: {zh: val => val.toFixed(2)} }
  heroMetrics.kill = { en: "", zh: "击杀" }
  heroMetrics.hp = { en: "", zh: "生命值" }
  heroMetrics.vY = { en: "", zh: "垂直速度", normalize: {zh: val => val.toFixed(2)} }
  heroMetrics.vX = { en: "", zh: "水平速度", normalize: {zh: val => val.toFixed(2)} }
  heroMetrics.hasMotion = { en: "", zh: "动力开启", normalize: {zh: val => val ? '开' : '关'}  }
  heroMetrics.FOV = { en: "", zh: "视野" }
  heroMetrics.accY = { en: "", zh: "向下加速度", normalize: {zh: val => val ? '开' : '关'} }
  heroMetrics.acc_Y = { en: "", zh: "向上加速度", normalize: {zh: val => val ? '开' : '关'} }
  heroMetrics.accX = { en: "", zh: "向右加速度", normalize: {zh: val => val ? '开' : '关'} }
  heroMetrics.acc_X = { en: "", zh: "向左加速度", normalize: {zh: val => val ? '开' : '关'} }


} ())
