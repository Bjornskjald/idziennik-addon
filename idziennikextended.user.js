// ==UserScript==
// @name		iDziennik Extended
// @namespace   https://raw.githubusercontent.com/jasrosa/idziennikextended/master/idziennikextended.user.js
// @include     https://iuczniowie.pe.szczecin.pl/mod_panelRodzica/Komunikator.aspx
// @downloadURL https://raw.githubusercontent.com/jasrosa/idziennikextended/master/idziennikextended.user.js
// @version     1.0.2
// @grant       none
// @run-at		document-idle
// ==/UserScript==
// Jezeli chcesz wysylac wiadomosci do uczniow, zamien "false" na "true" w ponizszej linii
var uczniowie = false;
console.log('Ladowanie skryptu...');
$('#iListView_table1_ToolBar').html(''); // Usun istniejacy panel
console.log('Panel usuniety');

iListView_utworzPanel(cTableName); // Dodaj nowy panel z przyciskiem "Nowy"
console.log('Nowy panel utworzony');

function iListView_newRecord(dz_tableID, isReply, subject){
	if (dz_tableID == cTableName) {
		listaOdbiorcow = new Array();
		onClickEnabled = ' onclick = "otworzOknoZKontaktamiFull()" ';
		disabledInput = '';
		console.log('Otwieram okno nowej wiadomosci');
		Komunikator.Create(otworzOknoZKontaktamiFull, 0);
		$("#dialog").dialog('open');
		Komunikator.SetTitle(subject);
		$(".ui-dialog:visible").css('background', 'url("../Images/DialogBackground.jpg") no-repeat right top #fff');
	};
};
console.log('Funkcja tworzenia wiadomosci ponownie zdefiniowana');

function otworzOknoZKontaktamiFull() // Funkcja zmieniona zeby pytala o uczniow i rodzicow
{
	console.log('Otwieram okno z odbiorcami');
	$("#dialog_kontakt").html(
	//'<div style="height:100%; overflow-y:auto;">'+	
	'<p style="text-align:center">' +
	'<div style="text-align:center; width:100%; margin-bottom:8px;">Wskaz adresatow wiadomosci</div>' +
	'<span class="buttonsSelect" style="text-align:center; font-size:85%; float:left; background-color:#F5F8F9; cursor:pointer; margin-left:0px; border:1px solid #A6C9E2; padding:0px;" onclick="$(\'.classKontaktCheckboxTeach\').attr(\'checked\',\'checked\')">(+) zaznacz naucz.</span>' +
	'<span class="buttonsSelect" style="text-align:center; font-size:85%; float:left; background-color:#F5F8F9; cursor:pointer; margin-left:0px; border:1px solid #A6C9E2; padding:0px;" onclick="$(\'.classKontaktCheckboxTeach\').removeAttr(\'checked\')">(-) odznacz naucz.</span>' +
	'<span class="buttonsSelect" style="text-align:center; font-size:85%; float:left; background-color:#F5F8F9; cursor:pointer; margin-left:0px; border:1px solid #A6C9E2; padding:0px;" onclick="$(\'.classKontaktCheckboxPar\').attr(\'checked\',\'checked\')">(+) zaznacz rodz.</span>' +
	'<span class="buttonsSelect" style="text-align:center; font-size:85%; float:left; background-color:#F5F8F9; cursor:pointer; margin-left:0px; border:1px solid #A6C9E2; padding:0px;" onclick="$(\'.classKontaktCheckboxPar\').removeAttr(\'checked\')">(-) odznacz rodz.</span>' +
	'<span class="buttonsSelect" style="text-align:center; font-size:85%; float:left; background-color:#F5F8F9; cursor:pointer; margin-left:0px; border:1px solid #A6C9E2; padding:0px;" onclick="$(\'.classKontaktCheckboxStu\').attr(\'checked\',\'checked\')">(+) zaznacz ucz.</span>' +
	'<span class="buttonsSelect" style="text-align:center; font-size:85%; float:left; background-color:#F5F8F9; cursor:pointer; margin-left:0px; border:1px solid #A6C9E2; padding:0px;" onclick="$(\'.classKontaktCheckboxStu\').removeAttr(\'checked\')">(-) odznacz ucz.</span>' +
	'</p><br/><br/>' +
	'<div id="accordionUzytkownicy"> ' +
	'</div>');
	$("#accordionUzytkownicy").append(
		'<ul> \
	    <li><a href="#spanPracownicy">Nauczyciele</a></li> \
	    <li><a href="#spanRodzice">Rodzice</a></li> \
    	    <li><a href="#spanUczniowie">Uczniowie</a></li> \
	    </ul> \
	    \
	    <div id="spanPracownicy"></div> \
	    <div id="spanRodzice"></div> \
	    <div id="spanUczniowie"></div> \
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
			pobranoDaneotworzOknoZKontaktami(result);
		},
		error: bladPobrano
	});
};
console.log('Funkcja otwierania okna z kontaktami zdefiniowana');
function pobranoDaneotworzOknoZKontaktami(result)
{
    if (result.d.Bledy.CzyJestBlad == false) {
        var spanPrac = document.getElementById('spanPracownicy');
        var spanRodzice = document.getElementById('spanRodzice');
        var spanUczniowie = document.getElementById('spanUczniowie')
        var temp = [];
        $("#dialog_kontakt").dialog('open');

        otrzymanaLista.Pracownicy = result.d.ListK_Pracownicy;
        //todo wstawic tu jednostki
        spanPrac.innerHTML = '';

        for (var i = 0; i < otrzymanaLista.Pracownicy.length; i++) {
            temp.push('<div id="divKontaktMain_' + otrzymanaLista.Pracownicy[i].Id + '" class="classKontakt">');
            temp.push('<input id="divKontaktCheckbox_' + otrzymanaLista.Pracownicy[i].Id + '" type="checkbox" class="classKontaktCheckboxTeach" style="float: right;" />');
            temp.push('<label for="divKontaktCheckbox_' + otrzymanaLista.Pracownicy[i].Id + '" style="cursor:pointer; width: 90%;" >');
            temp.push(otrzymanaLista.Pracownicy[i].ImieNazwisko);
            temp.push('</label>');
            temp.push('</div>');
        }

        spanPrac.innerHTML = temp.join('');

        otrzymanaLista.Rodzice = result.d.ListK_Opiekunowie;
        //todo wstawic tu jednostki
        spanRodzice.innerHTML = '';
        temp = [];
        for (var i = 0; i < otrzymanaLista.Rodzice.length; i++) 
        {
            temp.push('<div id="divKontaktMain_' + otrzymanaLista.Rodzice[i].Id + '" class="classKontakt">');
            temp.push('<input id="divKontaktCheckbox_' + otrzymanaLista.Rodzice[i].Id + '" type="checkbox" class="classKontaktCheckboxPar" style="float: right;"/>');
            temp.push('<label for="divKontaktCheckbox_' + otrzymanaLista.Rodzice[i].Id + '" style="cursor:pointer; width: 90%;">');
            temp.push(otrzymanaLista.Rodzice[i].ImieNazwisko);
            temp.push('</label>');
            temp.push('</div>');
        }

        spanRodzice.innerHTML = temp.join('');
        
        otrzymanaLista.Uczniowie = result.d.ListK_Uczniow;
        //todo wstawic tu jednostki
        spanUczniowie.innerHTML = '';
        temp = [];
        for (var i = 0; i < otrzymanaLista.Uczniowie.length; i++) 
        {
            temp.push('<div id="divKontaktMain_' + otrzymanaLista.Uczniowie[i].Id + '" class="classKontakt">');
            temp.push('<input id="divKontaktCheckbox_' + otrzymanaLista.Uczniowie[i].Id + '" type="checkbox" class="classKontaktCheckboxStu" style="float: right;"/>');
            temp.push('<label for="divKontaktCheckbox_' + otrzymanaLista.Uczniowie[i].Id + '" style="cursor:pointer; width: 90%;">');
            temp.push(otrzymanaLista.Uczniowie[i].ImieNazwisko);
            temp.push('</label>');
            temp.push('</div>');
        }

        spanUczniowie.innerHTML = temp.join('');

        $("#accordionUzytkownicy").tabs(); // accordion({ clearStyle: true, autoHeight: false, Header: 'h3' });

        //gdy zalogowany jest uczen, schowanie zakladki Rodzice 
        //rodzice nie dodawani na poziomie WS

        for (var nOdb = 0; nOdb < listaOdbiorcow.length; nOdb++) {
            document.getElementById('divKontaktCheckbox_' + listaOdbiorcow[nOdb]).checked = true;
        }
    }
    else jAlert('System zwrócił błąd o następującej treści:<br/>"<font color=red>' + result.d.Bledy.ListaBledow[0] + '</font>"');

    $.uiUnlock();
}
console.log('Zakonczono ladowanie skryptu');
