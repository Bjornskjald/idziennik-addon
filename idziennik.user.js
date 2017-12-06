// ==UserScript==
// @name		iDziennik
// @namespace   https://raw.githubusercontent.com/Bjornskjald/idziennik-addon/master/idziennik.user.js
// @include     https://iuczniowie.pe.szczecin.pl/mod_panelRodzica/Komunikator.aspx
// @downloadURL https://raw.githubusercontent.com/Bjornskjald/idziennik-addon/master/idziennik.user.js
// @version     2.0.0
// @grant       none
// @run-at		document-idle
// ==/UserScript==
$('#iListView_table1_ToolBar').html('') // Usun istniejacy panel
iListView_utworzPanel(cTableName) // Dodaj nowy panel z przyciskiem "Nowy"

window.insertPeople = lista => {
	var kontakt = (id, type, name, desc) => `
		<div id="divKontaktMain_${id}" class="classKontakt">
			<input id="divKontaktCheckbox_${id}" type="checkbox" class="classKontaktCheckbox${type}" style="float: right;" data-id="${id}" data-name="${name}"/>
			<label for="divKontaktCheckbox_${id}" style="cursor:pointer; width: 90%;" >
				${name}${desc}
			</label>
		</div>
	`
	Promise.all(lista.Pracownicy.map(pracownik => new Promise(done => {
		var desc = []
		if (pracownik.CzyJestNauczycielem) desc.push('nauczyciel')
		if (pracownik.CzyJestWychowawca) desc.push('wychowawca')
		desc.push(pracownik.ListaTypow.join(', '))
		done(kontakt(pracownik.Id, 'Teach', pracownik.ImieNazwisko, ': ' + desc.join(', ')))
	})))
	.then(e => document.getElementById('spanPracownicy').innerHTML = e.join(''))

	Promise.all(lista.Rodzice.map(rodzic => new Promise(done => done(kontakt(rodzic.Id, 'Par', rodzic.ImieNazwisko, ', klasa: ' + lista.Klasy[rodzic.IdKlasa])))))
	.then(e => document.getElementById('spanRodzice').innerHTML = e.join(''))

	Promise.all(lista.Uczniowie.map(uczen => new Promise(done => {
		var desc = []
		if (uczen.Skreslony) desc.push('skreslony')
		var matka = lista.Rodzice.find(e => uczen.Matka === e.Id)
		var ojciec = lista.Rodzice.find(e => uczen.Ojciec === e.Id)
		if (matka) desc.push('matka: ' + matka.ImieNazwisko)
		if (ojciec) desc.push('ojciec: ' + ojciec.ImieNazwisko)
		desc.push('klasa: ' + lista.Klasy[uczen.IdKlasa])
		done(kontakt(uczen.Id, 'Stu', uczen.ImieNazwisko, ', ' + desc.join(', ')))
	})))
	.then(e => document.getElementById('spanUczniowie').innerHTML = e.join(''))
}

window.openContacts = result => {
	if (result.d.Bledy.CzyJestBlad) return jAlert('System zwrócił błąd o następującej treści:<br/>"<font color=red>' + result.d.Bledy.ListaBledow[0] + '</font>"')
	var lista = {
		Pracownicy: result.d.ListK_Pracownicy,
		Rodzice: result.d.ListK_Opiekunowie,
		Uczniowie: result.d.ListK_Uczniow,
		Klasy: {}
	}
	result.d.ListK_Klasy.forEach(e => lista.Klasy[e.IdKlasa] = e.Klasa)
	$("#dialog_kontakt").dialog('open')
	insertPeople(lista)
	$("#accordionUzytkownicy").tabs()
	$.uiUnlock()
}

window.getData = () => {
	var button = (cb, text) => `<span class="buttonsSelect" style="text-align:center;font-size:85%;float:left;background-color:#F5F8F9;cursor:pointer;margin-left:0px;border:1px solid #A6C9E2;padding:0px;" onclick="$('.classKontaktCheckbox${cb}">${text}</span>`
	var li = n => `<li><a href="#span${n}">${n}</a></li>`
	$("#dialog_kontakt").html(`
		<p style="text-align:center">
			<div style="text-align:center; width:100%; margin-bottom:8px;">Wskaz adresatow wiadomosci</div>
			${button(`Teach').attr('checked','checked')`, `(+) nauczyciele`)}
			${button(`Teach').removeAttr('checked')`, `(-) nauczyciele`)}
			${button(`Par').attr('checked','checked')`, `(+) rodzice`)}
			${button(`Par').removeAttr('checked')`, `(-) rodzice`)}
			${button(`Stu').attr('checked','checked')`, `(+) uczniowie`)}
			${button(`Stu').removeAttr('checked')`, `(-) uczniowie`)}
		</p><br><br>
		<div id="accordionUzytkownicy" style="margin-top:20px">
			<ul>
				${li('Pracownicy')}
				${li('Rodzice')}
				${li('Uczniowie')}
			</ul>
			<div id="spanPracownicy"></div>
			<div id="spanRodzice"></div>
			<div id="spanUczniowie"></div>
		</div>
		`)
	$('.buttonsSelect').button()
	listaTypow = []
	$.uiLock('defaultLoadingLock')
	$.ajax({
		type: "POST",
		url: cWS_name + "/pobierzListeOdbiorcow",
		contentType: "application/json; charset=utf-8",
		data: '{idP:' + pozdziennika + '}',
		dataType: "json",
		success: openContacts,
		error: bladPobrano
	})
}

window.iListView_newRecord = (tableID, isReply) => {
	if (tableID !== cTableName) return
	listaOdbiorcow = []
	onClickEnabled = ' onclick = "getData()" '
	disabledInput = ''
	Komunikator.Create(getData, 1)
	$("#dialog").dialog('open')
	Komunikator.SetTitle('')
	$(".ui-dialog:visible").css('background', 'url("../Images/DialogBackground.jpg") no-repeat right top #fff')
	$(".ui-dialog").css({"width": "800px"})
}

window.zapiszOdbiorcow = () => {
	var listaNazwisk = []
	Array.from($("[class^='classKontaktCheckbox']:checked")).forEach(el => {
		listaOdbiorcow.push(el.dataset.id)
		listaNazwisk.push(el.dataset.name)
	})
	document.querySelector('#nazwiskaOdbiorcow').innerHTML = listaNazwisk.join('; ')
}