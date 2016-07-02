// ==UserScript==
// @name		iDziennik Extended
// @namespace   https://github.com/jasrosa/idziennikextended/raw/master/idziennikextended.user.js
// @include     https://iuczniowie.pe.szczecin.pl/mod_panelRodzica/Komunikator.aspx
// @downloadURL https://github.com/jasrosa/idziennikextended/raw/master/idziennikextended.user.js
// @version     1.0.1
// @grant       none
// @run-at		document-idle
// ==/UserScript==
console.log('Skrypt zaladowany');

$('#iListView_table1_ToolBar').html(''); // Usun istniejacy panel
console.log('Panel usuniety');

iListView_utworzPanel(cTableName); // Dodaj nowy panel z przyciskiem "Nowy"
console.log('Nowy panel utworzony');

function pobierzWiadomosc(){ // Funkcja odczytujaca pole z ID wiadomosci
	var messid = $('#messageID').val();
	console.log('Pobieram wiadomosc o ID ' + messid);
	iListView_clearSelected("table1");
	iListView_rowSelect("table1", 2, 0, messid);
}
console.log('Funkcja odczytywania ID wiadomosci zdefiniowana');

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
			pobranoDaneotworzOknoZKontaktami(result);
		},
		error: bladPobrano
	});
};
console.log('Funkcja otwierania okna z kontaktami zdefiniowana');

function pobranoWiadomosc(result) // Funkcja zmieniona, dziala ze skryptem oraz z domyslna funkcja
{
	console.log('Przetwarzam pobrana wiadomosc...');
    var wielkoscSkroconejListyOdbiorcow = 3; 

    if (result.d.czyJestWiecej == false) {
        $("img[id*=info_new]").hide();
    }
    var odbiorcy;
    odbiorcyPelnaLista = [];
    odbiorcySkroconaLista = [];
    var iloscWyswietlanychOdbiorcow = result.d.Wiadomosc.ListaOdbiorcow.length;

    for (var i = 0; i < iloscWyswietlanychOdbiorcow; i++) 
    {
        odbiorcyPelnaLista.push('<div class="odbiorca">');
        odbiorcyPelnaLista.push(result.d.Wiadomosc.ListaOdbiorcow[i].Status == "1" ?
            '<img src="../Images/mailappt.png" class="ikonaStatusu" title="WiadomoĹ›Ä‡ odebrana" />' : 
            '<img src="../Images/msn_newmsg.png" class="ikonaStatusu" title="Oczekiwanie na potwierdzenie odebrania wiadomoĹ›ci"/>');
        if (i == iloscWyswietlanychOdbiorcow - 1)
            odbiorcyPelnaLista.push(result.d.Wiadomosc.ListaOdbiorcow[i].NazwaOdbiorcy + '</div> ');
        else
            odbiorcyPelnaLista.push(result.d.Wiadomosc.ListaOdbiorcow[i].NazwaOdbiorcy + ',</div> ');

        if (i < wielkoscSkroconejListyOdbiorcow) 
        {
            odbiorcySkroconaLista.push('<div class="odbiorca">');
            odbiorcySkroconaLista.push(result.d.Wiadomosc.ListaOdbiorcow[i].Status == "1" ?
                '<img src="../Images/mailappt.png" class="ikonaStatusu" title="WiadomoĹ›Ä‡ odebrana" />' :
                '<img src="../Images/msn_newmsg.png" class="ikonaStatusu" title="Oczekiwanie na potwierdzenie odebrania wiadomoĹ›ci" />');
            odbiorcySkroconaLista.push(result.d.Wiadomosc.ListaOdbiorcow[i].NazwaOdbiorcy + ',</div> ');
        }
    }

    if (iloscWyswietlanychOdbiorcow > wielkoscSkroconejListyOdbiorcow) 
    {
        odbiorcy = odbiorcySkroconaLista.join('') + '<div class="odbiorca">...</div><div id="wiecejOdbiorcow" onclick="pokazWiecej()">[RozwiĹ„]</div>';
        trybWyswietlaniaOdbiorcow = 0;
    }
    else 
    {
        odbiorcy = odbiorcyPelnaLista.join('');
        trybWyswietlaniaOdbiorcow = 1;
    }

    var temp = [];

    if (result.d.Wiadomosc.ListaZal.length > 0) {
        temp.push('<div>');
        temp.push('<div class="nazwaAtrybutu" style="float: left;">ZaĹ‚Ä…czniki:</div>');
        var address = window.location.pathname.substring(0, window.location.pathname.indexOf("mod_"));

        for (var nZal = 0; nZal < result.d.Wiadomosc.ListaZal.length; nZal++) {
            temp.push('<div style="float: left;">');
            temp.push('<form id="formDownload_' + result.d.Wiadomosc.ListaZal[nZal].Id + '" method="POST" target="iframeResponseOdczyt" action="' + address + 'mod_komunikator/Download.ashx">');
            temp.push('<input name="id" type="hidden" style="display: none;" value="' + result.d.Wiadomosc._recordId + '" />');
            temp.push('<input name="fileName" type="hidden" style="display: none;" value="' + result.d.Wiadomosc.ListaZal[nZal].Nazwa + '" />');
            temp.push('<a id="zal_' + result.d.Wiadomosc.ListaZal[nZal].Id + '" class="attachLink">' + result.d.Wiadomosc.ListaZal[nZal].Nazwa + '</a>,');
            temp.push('</form>');
            temp.push('</div>');
        }
        temp.push('</div>');
    }

    temp.push('<iframe id="iframeResponseOdczyt" name="iframeResponseOdczyt" style="display: none;"></iframe>');

    var tempDialog = [];
    tempDialog.push('<div class="wiersz1">');
    tempDialog.push('<div class="lewyNagl">');
    tempDialog.push('<div class="nazwaAtrybutu">Nadawca: </div>');
    tempDialog.push('<div class="wartoscAtrybutu">' + result.d.Wiadomosc.Nadawca + '</div>');
    tempDialog.push('</div>');
    tempDialog.push('<div class="prawyNagl">');
    tempDialog.push('<div class="nazwaAtrybutu">Data nadania: </div>');
    tempDialog.push('<div class="wartoscAtrybutu">' + result.d.Wiadomosc.DataNadania + '</div>');
    tempDialog.push('</div>');
    tempDialog.push('</div>');
    tempDialog.push('<div class="nazwaAtrybutu">Odbiorcy: </div>');
    tempDialog.push('<div id="odbiorcy">' + odbiorcy + '</div>');
    tempDialog.push(temp.join(''));
    tempDialog.push('<p style="text-align:justify; white-space:pre-wrap;">Temat: <b><u>');
    tempDialog.push($("<div/>").text(result.d.Wiadomosc.Tytul).html());
    tempDialog.push('</u></b><br/><br/></p>');
    tempDialog.push(result.d.Wiadomosc.Text);
	var htmlDialog = tempDialog.join('');
	
    $("#dialogOdczyt").html(htmlDialog);

    for (var nZal = 0; nZal < result.d.Wiadomosc.ListaZal.length; nZal++) {
        document.getElementById('zal_' + result.d.Wiadomosc.ListaZal[nZal].Id).onclick = OnZalacznikClick;
    }

    document.getElementById('iframeResponseOdczyt').onload = OnIframeResponeOdczytLoadHandler;

    $("#dialogOdczyt").dialog('open');
    refreshGrid(cTableName);
}
console.log('Funkcja przetwarzania pobranej wiadomosci ponownie zdefiniowana');

var messageBrowser = "<td id='iListView_table1_divListViewToolbar_input'><input type='text' placeholder='Wpisz ID' id='messageID'></td><td id='iListView_table1_divListViewToolbar_submit' onclick='pobierzWiadomosc();' class='iListView_tabPanelButtonEnabled'>OK</td>";
$('#iListView_table1_ToolBarRow').append(messageBrowser);
console.log('Panel pobierania wiadomosci dodany');
console.log('Zakonczono ladowanie skryptu');