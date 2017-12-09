// ==UserScript==
// @name		iDziennik-Obecnosci
// @namespace   https://raw.githubusercontent.com/Bjornskjald/idziennik-addon/master/obecnosci.user.js
// @include     https://iuczniowie.pe.szczecin.pl/mod_panelRodzica/Obecnosci.aspx
// @downloadURL https://raw.githubusercontent.com/Bjornskjald/idziennik-addon/master/obecnosci.user.js
// @version     2.0.0
// @grant       none
// @run-at		document-idle
// ==/UserScript==
const template = (t, p) => `
<!DOCTYPE html>
<html lang="en" moznomarginboxes mozdisallowselectionprint>
  <head>
    <meta charset="UTF-8">
    <title>Obecności</title>
    <style>
      body {
        margin-top: 50px
      }
      p {
        font-family: "Roboto", "Calibri", sans-serif;
        text-align: center;
      }
      .margin {
        margin: 30px 0px
      }
    </style>
    <style type="text/css" media="print">
      @page {
          size: auto;
          margin: 0;
      }
      </style>
  </head>
  <body>
    <p>Proszę o usprawiedliwienie nieobecności mojej córki / mojego syna</p>
    <p class="margin">................................................................</p>
    <p>${t}</p>
    ${p ? `
      <p>z powodu</p>
      <p class="margin">................................................................</p>
    ` : ``}
  </body>
</html>
`

document.querySelector('.doLewej').innerHTML += `
  <button id="trigger">Pokaż nieobecności</button>

  <input id="drukuj" type="checkbox">
  <label for="drukuj" style="width: auto">Drukuj</label>
  
  <input id="godziny" type="checkbox">
  <label for="godziny" style="width: auto">Pojedyncze godziny</label>

  <input id="powod" type="checkbox">
  <label for="powod" style="width: auto">Powód</label>
`
document.querySelector('#trigger').addEventListener('click', ev => {
  ev.preventDefault()
  ev.stopPropagation()
  var hours = []
  var days = []
  obecnosciUcznia.Obecnosci.filter(el => el.TypObecnosci === 3).forEach(d => {
    hours.push(d.Data.split(' ')[0] + ', ' + d.Godzina + ' godzina lekcyjna')
    if (!days.includes(d.Data.split(' ')[0])) days.push(d.Data.split(' ')[0])
  })
  if (hours.length === 0) return alert('Brak nieobecności! :D')
  alert(hours.join('\n'))
  hours.unshift('w godzinach:')
  days.unshift('w dniach:')
  if (!document.querySelector('#drukuj').checked) return
  var text = document.querySelector('#godziny').checked ? hours.join('<br />') : days.join('<br />')

  var html = template(text, document.querySelector('#powod').checked)
  var blob = new Blob([html], {"type": "text/html"})
  var reader = new FileReader()
  reader.onload = evt => {
      if (evt.target.readyState === 2)
        window.location.href = evt.target.result
  }
  reader.readAsDataURL(blob)
})