var xhr = new XMLHttpRequest()
xhr.addEventListener('load', function (ev) {
  console.log(this.responseText)
  var script = document.createElement('script')
  script.innerHTML = this.responseText
  document.head.appendChild(script)
})
xhr.open('GET', chrome.runtime.getURL('idziennik.user.js'))
xhr.send()