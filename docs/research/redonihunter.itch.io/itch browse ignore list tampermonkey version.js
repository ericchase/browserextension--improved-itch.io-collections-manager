// ==UserScript==
// @name         ibil tampermonkey version
// @namespace    nonamespace
// @version      1
// @description  itch browse ignore list - barebone tampermonkey version
// @author       https://redonihunter.itch.io/
// @match        *://itch.io/*
// @run-at       document-end
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_listValues
// @grant        GM_deleteValue
// ==/UserScript==
// setup: copy into tampermonkey, edit configs, save
// usage: hover thumbnails, press buttons
// off styles are used when toggled off or in library
// import and export should be compatible to the full ibil extension
// issues: will slow down when toggling 1k+ items. works on ids, so does not catch reuploads with different id. does not work on all pages.
(function () {
if (!document.querySelector('.game_cell')) { return; }
// configuration start
const l1on = '{display:none}';
const l2on = '{display:none}';
const l1off = '{outline:auto blanchedalmond}';
const l2off = '{outline:auto purple}';
const key1 = '1';
const key2 = '2';
const dev1 = '3';
const dev2 = '4';
const togglek = '5';
const export_l1 = '6';
const export_l2 = '7';
const import_l1 = '8';
const import_l2 = '9';
const deleteallkey = '0';
// configuration end
const hks = key1 + key2 + dev1 + dev2 + togglek + export_l1 + import_l1 + export_l2 + import_l2 + deleteallkey;
const ibil1on = document.head.appendChild(document.createElement('style'));
const ibil2on = document.head.appendChild(document.createElement('style'));
const ibil1off = document.head.appendChild(document.createElement('style'));
const ibil2off = document.head.appendChild(document.createElement('style'));
ibil1on.innerText = '.ibil1on' + l1on;
ibil2on.innerText = '.ibil2on' + l2on;
ibil1off.innerText = '.ibil1off' + l1off;
ibil2off.innerText = '.ibil2off' + l2off;
document.addEventListener('keydown', event => {
    if (!hks.includes(event.key)) { return; }
    switch (event.key) {
        case togglek:
            toggle(); break;
        case import_l1:
            importlist('1'); break;
        case import_l2:
            importlist('2'); break;
        case export_l1:
            exportlist('1'); break;
        case export_l2:
            exportlist('2'); break;
        case deleteallkey:
            deleteall(); break;
        default:
            setTimeout(() => {
                var cell, hovered = document.querySelector(':hover');
                while (true) {
                    if (!hovered) { return; }
                    if (hovered.classList.contains('game_cell')) { cell = hovered; break; }
                    hovered = hovered.querySelector(':hover');
                }
                key_on_cell(event.key, cell);
            }, 50);
    }
});
const observer = new MutationObserver((mutationsList, observer) => {
    const temp = [];
    for (var i = 0, ii = mutationsList.length; i < ii; i++) {
        mutationsList[i].addedNodes.forEach((node) => {
            if (node?.classList?.contains('game_cell')) { temp.push(node); }
        });
    }
    if (temp?.length) { update_cell_styles(temp); }
});
observer.observe(document, { childList: true, subtree: true });
update_cell_styles(document.getElementsByClassName('game_cell'));
function do_not_ignore_here() {
    const state = GM_getValue('onoff', 'on');
    if (state == 'off') { return true; }
    if (document.URL == 'https://itch.io/library/recommendations') { return false; }
    return (/^https\:\/\/.+\.itch\.io\/$/.test(document.URL) || document.URL.startsWith('https://itch.io/profile/') ||
        document.URL.startsWith('https://itch.io/my-collections') || document.URL.startsWith('https://itch.io/c/') ||
        document.URL.startsWith('https://itch.io/my-purchases') || document.URL.startsWith('https://itch.io/library') ||
        document.URL.startsWith('https://itch.io/my-feed'))
}
function update_cell_styles(cell_list) {
    const page_dnih = do_not_ignore_here();
    var game_id, author_id, sg, sa;
    for (var i = 0, ii = cell_list.length; i < ii; i++) {
        game_id = cell_list[i]?.getAttribute('data-game_id');
        author_id = cell_list[i]?.querySelector('div.game_author>a')?.getAttribute('data-label');
        cell_list[i].classList.remove('ibil1on', 'ibil2on', 'ibil1off', 'ibil2off');
        sg = GM_getValue(game_id, null);
        if (sg) {
            if (sg?.s == '1') { cell_list[i].classList.add(page_dnih ? 'ibil1off' : 'ibil1on'); }
            if (sg?.s == '2') { cell_list[i].classList.add(page_dnih ? 'ibil2off' : 'ibil2on'); }
        } else {
            sa = GM_getValue(author_id, null);
            if (sa) {
                if (sa?.s == '1') { cell_list[i].classList.add(page_dnih ? 'ibil1off' : 'ibil1on'); }
                if (sa?.s == '2') { cell_list[i].classList.add(page_dnih ? 'ibil2off' : 'ibil2on'); }
            }
        }
    }
}
function key_on_cell(hk, cell) {
    const game_id = cell?.getAttribute('data-game_id');
    const game_link = (cell?.getElementsByClassName('game_link')?.[0] || cell?.getElementsByClassName('title')?.[0])?.href;
    const game_title = give_me_title(cell);
    const game_author = cell?.querySelector('div.game_author>a');
    const author_id = game_author?.getAttribute('data-label');
    const author_link = game_author?.href;
    const author_name = (game_author?.innerText || cell?.querySelector('.user_link')?.innerText ||
        cell?.parentElement?.parentElement?.querySelector('.author_link')?.innerText || author_link || game_link);
    var value, new_s, key_s = (hk == key1 || hk == dev1) ? '1' : '2';
    if (hk == key1 || hk == key2) {
        if (!game_id || !game_link || !game_title || !author_name) { return; }
        value = GM_getValue(game_id, { s: '0' });
        new_s = (value.s == '0') ? (key_s) : (value.s == key_s ? '0' : key_s);
        if (new_s == '0') { GM_deleteValue(game_id) } else { GM_setValue(game_id, { s: new_s, a: author_name, l: game_link, t: game_title }); }
    }
    if (hk == dev1 || hk == dev2) {
        if (!author_id || !author_link || !author_name) { return; }
        value = GM_getValue(author_id, { s: '0' });
        new_s = (value.s == '0') ? (key_s) : (value.s == key_s ? '0' : key_s);
        if (new_s == '0') { GM_deleteValue(author_id) } else { GM_setValue(author_id, { s: new_s, a: author_name, l: author_link }); }
    }
    update_cell_styles([cell]);
}
function toggle() {
    const state = GM_getValue('onoff', 'on');
    GM_setValue('onoff', state == 'on' ? 'off' : 'on')
    update_cell_styles(document.getElementsByClassName('game_cell'));
}
async function importlist(letter) {
    if (!confirm(`Import an exported list and update all items to list ${letter}?`)) { return; }
    var input = document.createElement('input');
    input.type = 'file';
    try {
        input.addEventListener('change', function listener() {
            let fr = new FileReader();
            fr.onload = async () => {
                try {
                    for (const [key, data] of Object.entries(JSON.parse(fr.result))) {
                        if (Object.hasOwn(data, 's')) {
                            if (Object.hasOwn(data, 't')) {
                                GM_setValue(key, { 'l': data.l, 't': data.t, 'a': data.a, 's': letter });
                            } else {
                                GM_setValue(key, { 'l': data.l, 'a': data.a, 's': letter });
                            }
                        }
                    }
                    update_cell_styles(document.getElementsByClassName('game_cell'));
                } catch (e) { console.log(e); alert('Could not parse. Need an exported file, not css or game lists.'); }
            };
            fr.readAsText(this.files[0]);
        })
    } catch (e) { console.log('error while trying to read a file:', e) }
    if (navigator.userActivation.isActive) { input.click() } else { alert('Not allowed or too slow (5s)'); }
}
function exportlist(letter) {
    var blob, value;
    const timestamp = new Date().toLocaleString();
    const filename = `ibil_tampermonkey_export_${letter}_${timestamp}.txt`;
    const temp_data = {};
    for (const key of GM_listValues()) {
        value = GM_getValue(key, null);
        if (value?.s == letter) { temp_data[key] = value; }
    }
    blob = new Blob([JSON.stringify(temp_data)], { type: 'text/plain' });
    try { save_a_blob(blob, filename); } catch (e) { console.log('exporting failed:', e); }
}
function deleteall() {
    if (confirm('Delete all stored items? Remember to export both lists before.')) {
        for (const key of GM_listValues()) { GM_deleteValue(key); }
    }
    update_cell_styles(document.getElementsByClassName('game_cell'));
}
async function save_a_blob(blob, name = 'ibil_export.txt') {
    const a = document.createElement('a');
    a.download = name; a.href = URL.createObjectURL(blob);
    a.addEventListener('click', () => { setTimeout(() => URL.revokeObjectURL(a.href), 300 * 1000); });
    a.click();
}
function give_me_title(cell) {
    if (!cell) { return 'Not a cell'; }
    var node = cell;
    var n, c = 0, t = '';
    const where_to_look = ['title game_link', 'game_title', 'title'];
    const ww = where_to_look.length;
    search_title: while (++c < 7) {
        for (var w = 0; w < ww; w++) {
            n = node.getElementsByClassName(where_to_look[w]);
            if (n.length == 1) { t = n[0]?.innerText; break search_title; }
            if (n.length > 1) { break search_title; }
        }
        if (node.parentElement != document) { node = node.parentElement; } else { break search_title; }
    }
    return t || 'Title not found';
}
})();