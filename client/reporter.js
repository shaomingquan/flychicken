(function () {
  var reporter = window.reporter = {}
  var reporterdom = null;
  var reportercontents = [];
  var reporterMaxLength = 10;
  window.addEventListener('load', function () {
    reporterdom = document.getElementById('reporter')
  })

  reporter.report = function (msg) {
    reportercontents.push(msg)
    if(reportercontents.length > reporterMaxLength) {
      reportercontents.shift()
    }

    reporterdom && (_ => {
      reporterdom.innerHTML = reportercontents.join('<br>')
    })()
  }
} ())
