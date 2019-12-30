// ==UserScript==
// @name		iDziennik-Komunikator
// @namespace   https://raw.githubusercontent.com/Bjornskjald/idziennik-addon/master/komunikator.user.js
// @include     https://iuczniowie.pe.szczecin.pl/mod_panelRodzica/Komunikator.aspx
// @include     https://iuczniowie.progman.pl/idziennik/mod_panelRodzica/Komunikator.aspx
// @downloadURL https://raw.githubusercontent.com/Bjornskjald/idziennik-addon/master/komunikator.user.js
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
	listaOdbiorcow = []
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

window.pobranoWiadomosc = function pobranoWiadomosc(result)
{
    var wielkoscSkroconejListyOdbiorcow = 3;  //Dlugosc skroconej listy elementow

    var odbiorcy;
    odbiorcyPelnaLista = [];
    odbiorcySkroconaLista = [];
    var iloscWyswietlanychOdbiorcow = result.d.Wiadomosc.ListaOdbiorcow.length;
    var $divTemp = $('<div>');

    for (var i = 0; i < iloscWyswietlanychOdbiorcow; i++)
    {
        odbiorcyPelnaLista.push('<div class="odbiorca">');
        odbiorcyPelnaLista.push(result.d.Wiadomosc.ListaOdbiorcow[i].Status == "1" ?
            '<img src="../Images/mailappt.png" class="ikonaStatusu" title="Wiadomość odebrana" />' :
            '<img src="../Images/msn_newmsg.png" class="ikonaStatusu" title="Oczekiwanie na potwierdzenie odebrania wiadomości"/>');
        if (i == iloscWyswietlanychOdbiorcow - 1)
            odbiorcyPelnaLista.push($divTemp.text(result.d.Wiadomosc.ListaOdbiorcow[i].NazwaOdbiorcy).html() + '</div> ');
        else
            odbiorcyPelnaLista.push($divTemp.text(result.d.Wiadomosc.ListaOdbiorcow[i].NazwaOdbiorcy).html() + ',</div> ');

        if (i < wielkoscSkroconejListyOdbiorcow)
        {
            odbiorcySkroconaLista.push('<div class="odbiorca">');
            odbiorcySkroconaLista.push(result.d.Wiadomosc.ListaOdbiorcow[i].Status == "1" ?
                '<img src="../Images/mailappt.png" class="ikonaStatusu" title="Wiadomość odebrana" />' :
                '<img src="../Images/msn_newmsg.png" class="ikonaStatusu" title="Oczekiwanie na potwierdzenie odebrania wiadomości" />');
            odbiorcySkroconaLista.push($divTemp.text(result.d.Wiadomosc.ListaOdbiorcow[i].NazwaOdbiorcy).html() + ',</div> ');
        }
    }

    if (iloscWyswietlanychOdbiorcow > wielkoscSkroconejListyOdbiorcow)
    {
        odbiorcy = odbiorcySkroconaLista.join('') + '<div class="odbiorca">...</div><div id="wiecejOdbiorcow" onclick="pokazWiecej()">[Rozwiń]</div>';
        trybWyswietlaniaOdbiorcow = 0;
    }
    else
    {
        odbiorcy = odbiorcyPelnaLista.join('');
        trybWyswietlaniaOdbiorcow = 1;
    }

    var temp = [];

    if (result.d.Wiadomosc.ListaZal.length > 0) {
        $divTemp.html('');
        temp.push('<div>');
        temp.push('<div class="nazwaAtrybutu" style="float: left;">Załączniki:</div>');
        var address = window.location.pathname.substring(0, window.location.pathname.indexOf("mod_"));

        for (var nZal = 0; nZal < result.d.Wiadomosc.ListaZal.length; nZal++) {
            var $div = $('<div style="float: left;">');
            $divTemp.append($div);

            var $form = $('<form method="POST" target="iframeResponseOdczyt" >');
            $form.attr({ 'id': 'formDownload_' + result.d.Wiadomosc.ListaZal[nZal].Id, 'action': address + 'mod_komunikator/Download.ashx' });
            $div.append($form);

            var $input = $('<input name="id" type="hidden" style="display: none;" />');
            $input.attr('value', result.d.Wiadomosc._recordId);
            $form.append($input);

            $input = $('<input name="fileName" type="hidden" style="display: none;" />');
            $input.attr('value', result.d.Wiadomosc.ListaZal[nZal].Nazwa);
            $form.append($input);

            var $a = $('<a class="attachLink">,');
            $a.attr('id', 'zal_' + result.d.Wiadomosc.ListaZal[nZal].Id);
            $a.text(result.d.Wiadomosc.ListaZal[nZal].Nazwa);
            $form.append($a);

            $form.append(document.createTextNode(','));
        }
        temp.push($divTemp.html());
        temp.push('</div>');
    }

    temp.push('<iframe id="iframeResponseOdczyt" name="iframeResponseOdczyt" style="display: none;"></iframe>');

    var tempDialog = [];
    tempDialog.push('<div class="wiersz1">');
    tempDialog.push('<div class="lewyNagl">');
    tempDialog.push('<div class="nazwaAtrybutu">Nadawca: </div>');
    tempDialog.push('<div class="wartoscAtrybutu">' + $divTemp.text(result.d.Wiadomosc.Nadawca).html() + '</div>');
    tempDialog.push('</div>');
    tempDialog.push('<div class="prawyNagl">');
    tempDialog.push('<div class="nazwaAtrybutu">Data nadania: </div>');
    tempDialog.push('<div class="wartoscAtrybutu">' + $divTemp.text(result.d.Wiadomosc.DataNadania).html() + '</div>');
    tempDialog.push('</div>');
    tempDialog.push('</div>');
    tempDialog.push('<div class="nazwaAtrybutu">Odbiorcy: </div>');
    tempDialog.push('<div id="odbiorcy">' + odbiorcy + '</div>');
    tempDialog.push(temp.join(''));
    tempDialog.push('<p style="text-align:justify; white-space:pre-wrap;">Temat: <b><u>');
    tempDialog.push('<span sid="temat">' + $divTemp.text(result.d.Wiadomosc.Tytul).html() + '</span>');
    tempDialog.push('</div>');
    tempDialog.push('</u></b><br/><br/></p>');
    tempDialog.push('<span sid="tresc">' + result.d.Wiadomosc.Text.split("\n").join("<br>") + '</span>');

    $("#dialogOdczyt").html(tempDialog.join(''));

    for (var nZal = 0; nZal < result.d.Wiadomosc.ListaZal.length; nZal++) {
        document.getElementById('zal_' + result.d.Wiadomosc.ListaZal[nZal].Id).onclick = OnZalacznikClick;
    }

    document.getElementById('iframeResponseOdczyt').onload = OnIframeResponeOdczytLoadHandler;

    $("#dialogOdczyt").dialog('open');
    refreshGrid(cTableName);
}