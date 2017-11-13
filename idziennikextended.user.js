// ==UserScript==
// @name		iDziennik Extended
// @namespace   https://raw.githubusercontent.com/Bjornskjald/idziennikextended/master/idziennikextended.user.js
// @include     https://iuczniowie.pe.szczecin.pl/mod_panelRodzica/Komunikator.aspx
// @downloadURL https://raw.githubusercontent.com/Bjornskjald/idziennikextended/master/idziennikextended.user.js
// @version     2.0.0-pre1
// @grant       none
// @run-at		document-idle
// ==/UserScript==
$('#iListView_table1_ToolBar').html('') // Usun istniejacy panel
iListView_utworzPanel(cTableName) // Dodaj nowy panel z przyciskiem "Nowy"

function iListView_newRecord(dz_tableID, isReply){
	if (dz_tableID == cTableName) {
		listaOdbiorcow = []
		onClickEnabled = ' onclick = "otworzOknoZKontaktamiFull()" '
		disabledInput = ''
		Komunikator.Create(otworzOknoZKontaktamiFull, 1)
		$("#dialog").dialog('open')
		Komunikator.SetTitle('')
		$(".ui-dialog:visible").css('background', 'url("../Images/DialogBackground.jpg") no-repeat right top #fff')
		$(".ui-dialog").css({"width": "800px"})
	}
}
function otworzOknoZKontaktamiFull() {// Funkcja zmieniona zeby pytala o uczniow i rodzicow
	$("#dialog_kontakt").html('<p style="text-align:center"><div style="text-align:center; width:100%; margin-bottom:8px;">Wskaz adresatow wiadomosci</div><span class="buttonsSelect" style="text-align:center; font-size:85%; float:left; background-color:#F5F8F9; cursor:pointer; margin-left:0px; border:1px solid #A6C9E2; padding:0px;" onclick="$(\'.classKontaktCheckboxTeach\').attr(\'checked\',\'checked\')">(+) zaznacz naucz.</span><span class="buttonsSelect" style="text-align:center; font-size:85%; float:left; background-color:#F5F8F9; cursor:pointer; margin-left:0px; border:1px solid #A6C9E2; padding:0px;" onclick="$(\'.classKontaktCheckboxTeach\').removeAttr(\'checked\')">(-) odznacz naucz.</span><span class="buttonsSelect" style="text-align:center; font-size:85%; float:left; background-color:#F5F8F9; cursor:pointer; margin-left:0px; border:1px solid #A6C9E2; padding:0px;" onclick="$(\'.classKontaktCheckboxPar\').attr(\'checked\',\'checked\')">(+) zaznacz rodz.</span><span class="buttonsSelect" style="text-align:center; font-size:85%; float:left; background-color:#F5F8F9; cursor:pointer; margin-left:0px; border:1px solid #A6C9E2; padding:0px;" onclick="$(\'.classKontaktCheckboxPar\').removeAttr(\'checked\')">(-) odznacz rodz.</span><span class="buttonsSelect" style="text-align:center; font-size:85%; float:left; background-color:#F5F8F9; cursor:pointer; margin-left:0px; border:1px solid #A6C9E2; padding:0px;" onclick="$(\'.classKontaktCheckboxStu\').attr(\'checked\',\'checked\')">(+) zaznacz ucz.</span><span class="buttonsSelect" style="text-align:center; font-size:85%; float:left; background-color:#F5F8F9; cursor:pointer; margin-left:0px; border:1px solid #A6C9E2; padding:0px;" onclick="$(\'.classKontaktCheckboxStu\').removeAttr(\'checked\')">(-) odznacz ucz.</span></p><br/><br/><div id="accordionUzytkownicy" style="margin-top:20px"></div>');
	$("#accordionUzytkownicy").append('<ul><li><a href="#spanPracownicy">Nauczyciele</a></li><li><a href="#spanRodzice">Rodzice</a></li><li><a href="#spanUczniowie">Uczniowie</a></li></ul><div id="spanPracownicy"></div><div id="spanRodzice"></div><div id="spanUczniowie"></div>');
	$('.buttonsSelect').button()
	listaTypow = []
	$.uiLock('defaultLoadingLock')
	$.ajax({
		type: "POST",
		url: cWS_name + "/pobierzListeOdbiorcow", // Tutaj zmienione z pobierzListeOdbiorcowPanelRodzic
		contentType: "application/json; charset=utf-8",
		data: '{idP:' + pozdziennika + '}',
		dataType: "json",
		success: pobranoDaneotworzOknoZKontaktami,
		error: bladPobrano
	})
}
function pobranoDaneotworzOknoZKontaktami(result) {
	if (!result.d.Bledy.CzyJestBlad) {
		var lista = {
			Pracownicy: result.d.ListK_Pracownicy,
			Rodzice: result.d.ListK_Opiekunowie,
			Uczniowie: result.d.ListK_Uczniow,
			Klasy: {}
		}
		result.d.ListK_Klasy.forEach(e => lista.Klasy[e.IdKlasa] = e.Klasa)
		$("#dialog_kontakt").dialog('open')

		lista.Pracownicy.forEach(pracownik => {
			var desc = []
			if (pracownik.CzyJestNauczycielem) desc.push('nauczyciel')
			if (pracownik.CzyJestWychowawca) desc.push('wychowawca')
			desc.push(pracownik.ListaTypow.join(', '))
			document.getElementById('spanPracownicy').innerHTML += `
				<div id="divKontaktMain_${pracownik.Id}" class="classKontakt">
					<input id="divKontaktCheckbox_${pracownik.Id}" type="checkbox" class="classKontaktCheckboxTeach" style="float: right;" />
					<label for="divKontaktCheckbox_${pracownik.Id}" style="cursor:pointer; width: 90%;" >
						${pracownik.ImieNazwisko}: ${desc.join(', ')}
					</label>
				</div>
			`
		})

		lista.Rodzice.forEach(rodzic => {
			document.getElementById('spanRodzice').innerHTML += `
				<div id="divKontaktMain_${rodzic.Id}" class="classKontakt">
					<input id="divKontaktCheckbox_${rodzic.Id}" type="checkbox" class="classKontaktCheckboxPar" style="float: right;"/>
					<label for="divKontaktCheckbox_${rodzic.Id}" style="cursor:pointer; width: 90%;">
						${rodzic.ImieNazwisko}, klasa: ${lista.Klasy[rodzic.Klasa]}
					</label>
				</div>
			`

		})

		lista.Uczniowie.forEach(uczen => {
			var desc = []
			if (otrzymanaLista.Uczniowie[i].Skreslony) desc.push('skreslony')
			var matka = lista.Rodzice.find(e => uczen.Matka === e.Id)
			var ojciec = lista.Rodzice.find(e => uczen.Ojciec === e.Id)
			if (matka) desc.push('matka: ' + matka.ImieNazwisko)
			if (ojciec) desc.push('ojciec: ' + ojciec.ImieNazwisko)
			desc.push('klasa: ' + lista.Klasy[uczen.IdKlasa])
			document.getElementById('spanUczniowie').innerHTML += `
				<div id="divKontaktMain_${uczen.Id}" class="classKontakt">
					<input id="divKontaktCheckbox_${uczen.Id}" type="checkbox" class="classKontaktCheckboxStu" style="float: right;"/>
					<label for="divKontaktCheckbox_${uczen.Id}" style="cursor:pointer; width: 90%;">
						${uczen.ImieNazwisko}, ${desc.join(', ')}
					</label>
				</div>
			`
		})
		$("#accordionUzytkownicy").tabs()
	}
	else jAlert('System zwrócił błąd o następującej treści:<br/>"<font color=red>' + result.d.Bledy.ListaBledow[0] + '</font>"')
	$.uiUnlock()
}
