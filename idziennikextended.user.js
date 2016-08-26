// ==UserScript==
// @name		iDziennik Extended
// @namespace   https://raw.githubusercontent.com/jasrosa/idziennikextended/master/idziennikextended.user.js
// @include     https://iuczniowie.pe.szczecin.pl/mod_panelRodzica/Komunikator.aspx
// @downloadURL https://raw.githubusercontent.com/jasrosa/idziennikextended/master/idziennikextended.user.js
// @version     1.0.2
// @grant       none
// @run-at		document-idle
// ==/UserScript==
console.log('Skrypt zaladowany');
var wynik;
$('#iListView_table1_ToolBar').html(''); // Usun istniejacy panel
console.log('Panel usuniety');

iListView_utworzPanel(cTableName); // Dodaj nowy panel z przyciskiem "Nowy"
console.log('Nowy panel utworzony');

function iListView_newRecord(iListView_idTable, isReply, subject){
	if (iListView_idTable == cTableName) {
		listaOdbiorcow = new Array();
		if (isReply) {
			onClickEnabled = '';
			disabledInput = 'disabled=disabled'
		} else {
			onClickEnabled = ' onclick = "otworzOknoZKontaktamiFull()" ';
			disabledInput = '';
			subject = '';
		};
		console.log('Otwieram okno nowej wiadomosci');
		Komunikator.Create(otworzOknoZKontaktamiFull, 0);
		$("#dialog").dialog('open');
		Komunikator.SetTitle(subject);
		$(".ui-dialog:visible").css('background', 'url("../Images/DialogBackground.jpg") no-repeat right top #fff');
	};
};
console.log('Funkcja tworzenia wiadomosci ponownie zdefiniowana');

function otworzOknoZKontaktamiFull() // Funkcja zmieniona zeby pytala o wszystkich nauczycieli i rodzicow
// TODO: Sprawdzic jak wyglada zakladka z uczniami
{
	console.log('Otwieram okno z odbiorcami');
	$("#dialog_kontakt").html(
	//'<div style="height:100%; overflow-y:auto;">'+	
	'<p style="text-align:center">' +
	'<div style="text-align:center; width:100%; margin-bottom:8px;">Wskaz adresatow wiadomosci</div>' +
	'<span class="buttonsSelect" style="text-align:center; font-size:85%; float:left; background-color:#F5F8F9; cursor:pointer; margin-left:10px; border:1px solid #A6C9E2; padding:3px;" onclick="$(\'.classKontaktCheckboxTeach\').attr(\'checked\',\'checked\')">(+) zaznacz naucz.</span>' +
	'<span class="buttonsSelect" style="text-align:center; font-size:85%; float:left; background-color:#F5F8F9; cursor:pointer; margin-left:10px; border:1px solid #A6C9E2; padding:3px;" onclick="$(\'.classKontaktCheckboxTeach\').removeAttr(\'checked\')">(-) odznacz naucz.</span>' +
	'<span class="buttonsSelect" style="text-align:center; font-size:85%; float:left; background-color:#F5F8F9; cursor:pointer; margin-left:10px; border:1px solid #A6C9E2; padding:3px;" onclick="$(\'.classKontaktCheckboxPar\').attr(\'checked\',\'checked\')">(+) zaznacz rodz.</span>' +
	'<span class="buttonsSelect" style="text-align:center; font-size:85%; float:left; background-color:#F5F8F9; cursor:pointer; margin-left:10px; border:1px solid #A6C9E2; padding:3px;" onclick="$(\'.classKontaktCheckboxPar\').removeAttr(\'checked\')">(-) odznacz rodz.</span>' +
	'</p><br/><br/>' +
	'<div id="accordionUzytkownicy"> ' +
	'</div>');
	$("#accordionUzytkownicy").append(
		'<ul> \
	    <li><a href="#spanPracownicy">Nauczyciele</a></li> \
	    <li><a href="#spanRodzice">Rodzice</a></li> \
	    </ul> \
	    \
	    <div id="spanPracownicy"></div> \
	    <div id="spanRodzice"></div> \
	    ');
	$('.buttonsSelect').button();
	listaTypow = new Array();
	$.uiLock('defaultLoadingLock');
	$.ajax({
		type: "POST",
		url: cWS_name + "/pobierzListeOdbiorcow", // Tutaj zmienione z pobierzListeOdbiorcowPanelRodzic
		contentType: "application/json; charset=utf-8",
		data: '{idP:' + pozdziennika + '}',
		dataType: "json",
		success: function (result)
		{
			result.d.ListK_Pracownicy = result.d.ListK_Uczniow;pobranoDaneotworzOknoZKontaktami(result);
		},
		error: bladPobrano
	});
};//.replace("ListK_Pracownicy", "ListK_PPP").replace("ListK_Uczniow", "ListK_Pracownicy")
console.log('Funkcja otwierania okna z kontaktami zdefiniowana');
console.log('Zakonczono ladowanie skryptu');
