// ==UserScript==
// @name        iDziennik Extended
// @namespace   https://github.com/jasrosa/idziennikextended/raw/master/idziennikextended.user.js
// @include     https://iuczniowie.pe.szczecin.pl/mod_panelRodzica/Komunikator.aspx
// @downloadURL https://github.com/jasrosa/idziennikextended/raw/master/idziennikextended.user.js
// @version     1.0
// @grant       none
// ==/UserScript==
$('#iListView_table1_ToolBar').html(''); // Usun istniejacy panel
iListView_utworzPanel(cTableName); // Dodaj nowy panel z przyciskiem "Nowy"
function otworzOknoZKontaktami() // Ponowne zdefiniowanie funkcji tak zeby pytala o wszystkich nauczycieli i rodzicow
// TODO: Sprawdzic jak wyglada zakladka z uczniami
{
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
}
