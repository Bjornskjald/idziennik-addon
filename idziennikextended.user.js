// ==UserScript==
// @name		iDziennik Extended
// @namespace   https://raw.githubusercontent.com/jasrosa/idziennikextended/master/idziennikextended.user.js
// @include     https://iuczniowie.pe.szczecin.pl/mod_panelRodzica/Komunikator.aspx
// @downloadURL https://raw.githubusercontent.com/jasrosa/idziennikextended/master/idziennikextended.user.js
// @version     1.0.2
// @grant       none
// @run-at		document-idle
// ==/UserScript==
$('#iListView_table1_ToolBar').html(''); // Usun istniejacy panel
iListView_utworzPanel(cTableName); // Dodaj nowy panel z przyciskiem "Nowy"

function iListView_newRecord(dz_tableID, isReply){
	if (dz_tableID == cTableName) {
		listaOdbiorcow = [];
		onClickEnabled = ' onclick = "otworzOknoZKontaktamiFull()" ';
		disabledInput = '';
		Komunikator.Create(otworzOknoZKontaktamiFull, 1);
		$("#dialog").dialog('open');
		Komunikator.SetTitle('');
		$(".ui-dialog:visible").css('background', 'url("../Images/DialogBackground.jpg") no-repeat right top #fff');
		$(".ui-dialog").css({"width": "800px"})
	};
};
function pobierzPracownikowJednostki(idjednostki) {
	$("#dialog_kontakt").html('<p style="text-align:center"><div style="text-align:center; width:100%; margin-bottom:8px;">Wskaz adresatow wiadomosci</div><span class="buttonsSelect" style="text-align:center; font-size:85%; float:left; background-color:#F5F8F9; cursor:pointer; margin-left:0px; border:1px solid #A6C9E2; padding:0px;" onclick="$(\'.classKontaktCheckboxTeach\').attr(\'checked\',\'checked\')">(+) zaznacz naucz.</span><span class="buttonsSelect" style="text-align:center; font-size:85%; float:left; background-color:#F5F8F9; cursor:pointer; margin-left:0px; border:1px solid #A6C9E2; padding:0px;" onclick="$(\'.classKontaktCheckboxTeach\').removeAttr(\'checked\')">(-) odznacz naucz.</span><span class="buttonsSelect" style="text-align:center; font-size:85%; float:left; background-color:#F5F8F9; cursor:pointer; margin-left:0px; border:1px solid #A6C9E2; padding:0px;" onclick="$(\'.classKontaktCheckboxPar\').attr(\'checked\',\'checked\')">(+) zaznacz rodz.</span><span class="buttonsSelect" style="text-align:center; font-size:85%; float:left; background-color:#F5F8F9; cursor:pointer; margin-left:0px; border:1px solid #A6C9E2; padding:0px;" onclick="$(\'.classKontaktCheckboxPar\').removeAttr(\'checked\')">(-) odznacz rodz.</span><span class="buttonsSelect" style="text-align:center; font-size:85%; float:left; background-color:#F5F8F9; cursor:pointer; margin-left:0px; border:1px solid #A6C9E2; padding:0px;" onclick="$(\'.classKontaktCheckboxStu\').attr(\'checked\',\'checked\')">(+) zaznacz ucz.</span><span class="buttonsSelect" style="text-align:center; font-size:85%; float:left; background-color:#F5F8F9; cursor:pointer; margin-left:0px; border:1px solid #A6C9E2; padding:0px;" onclick="$(\'.classKontaktCheckboxStu\').removeAttr(\'checked\')">(-) odznacz ucz.</span></p><br/><br/><div id="accordionUzytkownicy" style="margin-top:20px"></div>');
	$("#accordionUzytkownicy").append('<ul><li><a href="#spanPracownicy">Nauczyciele</a></li><li><a href="#spanRodzice">Rodzice</a></li><li><a href="#spanUczniowie">Uczniowie</a></li></ul><div id="spanPracownicy"></div><div id="spanRodzice"></div><div id="spanUczniowie"></div>');
	$('.buttonsSelect').button();
	listaTypow = [];
	$.uiLock('defaultLoadingLock');
	$.ajax({
		type: "POST",
		url: cWS_name + "/pobierzPracownikowDlaWybranejJedn", // Tutaj zmienione z pobierzListeOdbiorcowPanelRodzic
		contentType: "application/json; charset=utf-8",
		data: '{idJednostkiNad:' + idjednostki + '}',
		dataType: "json",
		success: function (result){
			console.log(result)
			pobranoDaneotworzOknoZKontaktami(result);
		},
		error: bladPobrano
	});
}
function otworzOknoZKontaktamiFull() {// Funkcja zmieniona zeby pytala o uczniow i rodzicow
	$("#dialog_kontakt").html('<p style="text-align:center"><div style="text-align:center; width:100%; margin-bottom:8px;">Wskaz adresatow wiadomosci</div><span class="buttonsSelect" style="text-align:center; font-size:85%; float:left; background-color:#F5F8F9; cursor:pointer; margin-left:0px; border:1px solid #A6C9E2; padding:0px;" onclick="$(\'.classKontaktCheckboxTeach\').attr(\'checked\',\'checked\')">(+) zaznacz naucz.</span><span class="buttonsSelect" style="text-align:center; font-size:85%; float:left; background-color:#F5F8F9; cursor:pointer; margin-left:0px; border:1px solid #A6C9E2; padding:0px;" onclick="$(\'.classKontaktCheckboxTeach\').removeAttr(\'checked\')">(-) odznacz naucz.</span><span class="buttonsSelect" style="text-align:center; font-size:85%; float:left; background-color:#F5F8F9; cursor:pointer; margin-left:0px; border:1px solid #A6C9E2; padding:0px;" onclick="$(\'.classKontaktCheckboxPar\').attr(\'checked\',\'checked\')">(+) zaznacz rodz.</span><span class="buttonsSelect" style="text-align:center; font-size:85%; float:left; background-color:#F5F8F9; cursor:pointer; margin-left:0px; border:1px solid #A6C9E2; padding:0px;" onclick="$(\'.classKontaktCheckboxPar\').removeAttr(\'checked\')">(-) odznacz rodz.</span><span class="buttonsSelect" style="text-align:center; font-size:85%; float:left; background-color:#F5F8F9; cursor:pointer; margin-left:0px; border:1px solid #A6C9E2; padding:0px;" onclick="$(\'.classKontaktCheckboxStu\').attr(\'checked\',\'checked\')">(+) zaznacz ucz.</span><span class="buttonsSelect" style="text-align:center; font-size:85%; float:left; background-color:#F5F8F9; cursor:pointer; margin-left:0px; border:1px solid #A6C9E2; padding:0px;" onclick="$(\'.classKontaktCheckboxStu\').removeAttr(\'checked\')">(-) odznacz ucz.</span></p><br/><br/><div id="accordionUzytkownicy" style="margin-top:20px"></div>');
	$("#accordionUzytkownicy").append('<ul><li><a href="#spanPracownicy">Nauczyciele</a></li><li><a href="#spanRodzice">Rodzice</a></li><li><a href="#spanUczniowie">Uczniowie</a></li></ul><div id="spanPracownicy"></div><div id="spanRodzice"></div><div id="spanUczniowie"></div>');
	$('.buttonsSelect').button();
	listaTypow = [];
	$.uiLock('defaultLoadingLock');
	$.ajax({
		type: "POST",
		url: cWS_name + "/pobierzListeOdbiorcow", // Tutaj zmienione z pobierzListeOdbiorcowPanelRodzic
		contentType: "application/json; charset=utf-8",
		data: '{idP:' + pozdziennika + '}',
		dataType: "json",
		success: function (result){
			pobranoDaneotworzOknoZKontaktami(result);
		},
		error: bladPobrano
	});
};
function pobranoDaneotworzOknoZKontaktami(result)
{
	if (result.d.Bledy.CzyJestBlad == false) {
		var spanPrac = document.getElementById('spanPracownicy');
		var spanRodzice = document.getElementById('spanRodzice');
		var spanUczniowie = document.getElementById('spanUczniowie');
		otrzymanaLista.Jednotki = result.d.ListK_Jednostek;
		otrzymanaLista.Pracownicy = result.d.ListK_Pracownicy;
		otrzymanaLista.Rodzice = result.d.ListK_Opiekunowie;
		otrzymanaLista.Uczniowie = result.d.ListK_Uczniow; // Dodano liste uczniow i dodatkowa zakladke
		otrzymanaLista.Klasy = result.d.ListK_Klasy; // Dodano liste klas do wyswietlania informacji o uczniach i rodzicach

		var temp = [];
		$("#dialog_kontakt").dialog('open');
		spanPrac.innerHTML = '';

		for (var i = 0; i < otrzymanaLista.Pracownicy.length; i++) {
			temp.push('<div id="divKontaktMain_' + otrzymanaLista.Pracownicy[i].Id + '" class="classKontakt">');
			temp.push('<input id="divKontaktCheckbox_' + otrzymanaLista.Pracownicy[i].Id + '" type="checkbox" class="classKontaktCheckboxTeach" style="float: right;" />');
			temp.push('<label for="divKontaktCheckbox_' + otrzymanaLista.Pracownicy[i].Id + '" style="cursor:pointer; width: 90%;" >');
			temp.push(otrzymanaLista.Pracownicy[i].ImieNazwisko);
			if(otrzymanaLista.Pracownicy[i].CzyJestNauczycielem)temp.push(", nauczyciel"); // sprawdzanie czy osoba jest nauczycielem
			if(otrzymanaLista.Pracownicy[i].CzyJestWychowawca)temp.push(", wychowawca"); // sprawdzanie czy osoba jest wychowawca
			temp.push(", typ: " + otrzymanaLista.Pracownicy[i].ListaTypow[0]); // pokazuje typ konta
			temp.push('</label>');
			temp.push('</div>');
		}
		spanPrac.innerHTML = temp.join('');
		spanRodzice.innerHTML = '';
		temp = [];
		for (var i = 0; i < otrzymanaLista.Rodzice.length; i++) {
			temp.push('<div id="divKontaktMain_' + otrzymanaLista.Rodzice[i].Id + '" class="classKontakt">');
			temp.push('<input id="divKontaktCheckbox_' + otrzymanaLista.Rodzice[i].Id + '" type="checkbox" class="classKontaktCheckboxPar" style="float: right;"/>');
			temp.push('<label for="divKontaktCheckbox_' + otrzymanaLista.Rodzice[i].Id + '" style="cursor:pointer; width: 90%;">');
			temp.push(otrzymanaLista.Rodzice[i].ImieNazwisko);
			temp.push(", klasa: " + otrzymanaLista.Klasy.find(function(elem){var obj = otrzymanaLista.Rodzice[i].IdKlasa === elem.IdKlasa; return obj}).Klasa); // znajduje ID klasy w tabeli klas
			temp.push('</label>');
			temp.push('</div>');
		}
		spanRodzice.innerHTML = temp.join('');
		spanUczniowie.innerHTML = '';
		temp = [];
		for (var i = 0; i < otrzymanaLista.Uczniowie.length; i++) {
			temp.push('<div id="divKontaktMain_' + otrzymanaLista.Uczniowie[i].Id + '" class="classKontakt">');
			temp.push('<input id="divKontaktCheckbox_' + otrzymanaLista.Uczniowie[i].Id + '" type="checkbox" class="classKontaktCheckboxStu" style="float: right;"/>');
			temp.push('<label for="divKontaktCheckbox_' + otrzymanaLista.Uczniowie[i].Id + '" style="cursor:pointer; width: 90%;">');
			temp.push(otrzymanaLista.Uczniowie[i].ImieNazwisko);
			if(otrzymanaLista.Uczniowie[i].Skreslony)temp.push(", skreslony"); // sprawdzanie czy uczen jest skreslony
			temp.push(", klasa: " + otrzymanaLista.Klasy.find(function(elem){var obj = otrzymanaLista.Uczniowie[i].IdKlasa === elem.IdKlasa; return obj}).Klasa); // znajduje ID klasy w tabeli klas
			var matka = otrzymanaLista.Rodzice.find(function(el){return otrzymanaLista.Uczniowie[i].Matka === el.Id;}) // sprawdza ID matki ucznia
			if(matka) temp.push(", matka: " + matka.ImieNazwisko);
			var ojciec = otrzymanaLista.Rodzice.find(function(el){return otrzymanaLista.Uczniowie[i].Ojciec === el.Id;}) // sprawdza ID ojca ucznia
			if(ojciec) temp.push(", ojciec: " + ojciec.ImieNazwisko);
			temp.push('</label>');
			temp.push('</div>');
		}
		spanUczniowie.innerHTML = temp.join('');
		$("#accordionUzytkownicy").tabs();
		for (var nOdb = 0; nOdb < listaOdbiorcow.length; nOdb++) {
			document.getElementById('divKontaktCheckbox_' + listaOdbiorcow[nOdb]).checked = true;
		}
	}
	else jAlert('System zwrócił błąd o następującej treści:<br/>"<font color=red>' + result.d.Bledy.ListaBledow[0] + '</font>"');
	$.uiUnlock();
}
