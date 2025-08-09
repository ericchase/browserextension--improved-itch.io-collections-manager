// ==UserScript==
// @name         itch genre filter
// @namespace    nonamespace
// @version      1
// @description  itch genre filter tampermonkey
// @author       https://redonihunter.itch.io/
// @match        *://itch.io/*
// @run-at       document-end
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_listValues
// @grant        GM_deleteValue
// ==/UserScript==
// setup: copy into tampermonkey, edit configs, save
// usage: click the buttons on browse pages genre to change appearance of genres
(function () {
    if (!document.querySelector('.game_cell')) { return; }
    // configuration start
    const genre_filter_style = '{opacity:0.05}'; // '{display:none}' '{opacity:0.05}'
    const button_color_x = 'Tomato';
    const button_color_o = 'BlanchedAlmond';
    // configuration end
    const genre_filter = document.head.appendChild(document.createElement('style'));
    genre_filter.innerText = '.gfs' + genre_filter_style;
    hook_buttons();
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
        if (document.URL == 'https://itch.io/library/recommendations') { return false; }
        return (/^https\:\/\/.+\.itch\.io\/$/.test(document.URL) || document.URL.startsWith('https://itch.io/profile/') ||
            document.URL.startsWith('https://itch.io/my-collections') || document.URL.startsWith('https://itch.io/c/') ||
            document.URL.startsWith('https://itch.io/my-purchases') || document.URL.startsWith('https://itch.io/library') ||
            document.URL.startsWith('https://itch.io/my-feed'))
    }
    function update_cell_styles(cell_list) {
        if (do_not_ignore_here()) return;
        const ugly_string = GM_getValue('ugly_string', '');
        var genre;
        for (var i = 0, ii = cell_list.length; i < ii; i++) {
            genre = cell_list[i]?.querySelector("div.game_cell_data > div.game_genre")?.innerText;
            if (genre && ugly_string.includes(genre)) {
                cell_list[i].classList.add('gfs');
            } else {
                cell_list[i].classList.remove('gfs');
            }
        }
    }
    function hook_buttons() {
        const ul = document.querySelector('ul > li > a[href="/games/genre-action"')?.parentElement?.parentElement;
        if (!ul || document.getElementById('rfbid')) return;
        const reset_filter_button = document.createElement('button'); reset_filter_button.innerText = 'Reset Genre Filter';
        reset_filter_button.id = 'rfbid';
        ul.appendChild(reset_filter_button);
        reset_filter_button.addEventListener('click', () => {
            for (const li of ul.childNodes) {
                const btn = li.querySelector('.gfbxobtn');
                if (btn) {
                    btn.innerText = 'O';
                    btn.style.backgroundColor = button_color_o;
                }
            }
            GM_setValue('ugly_string', '');
            reset_filter_button.style.backgroundColor = button_color_o;
            update_cell_styles(document.getElementsByClassName('game_cell'));
        });
        const ugly_string = GM_getValue('ugly_string', '');
        reset_filter_button.style.backgroundColor = ugly_string ? button_color_x : button_color_o;
        for (const li of ul.childNodes) {
            const genre = li.querySelector('a')?.innerText;
            if (genre) {
                const btn = document.createElement('button'); btn.innerText = ugly_string.includes(genre) ? 'X' : 'O';
                btn.style.backgroundColor = ugly_string.includes(genre) ? button_color_x : button_color_o;
                btn.classList.add('gfbxobtn');
                li.appendChild(btn);
                btn.addEventListener('click', () => {
                    var us = GM_getValue('ugly_string', '');
                    if (us.includes(genre)) {
                        us = us.replace(genre, '')
                        btn.innerText = 'O';
                        btn.style.backgroundColor = button_color_o;
                    } else {
                        us += genre;
                        btn.innerText = 'X';
                        btn.style.backgroundColor = button_color_x;
                    }
                    reset_filter_button.style.backgroundColor = us ? button_color_x : button_color_o;
                    GM_setValue('ugly_string', us);
                    update_cell_styles(document.getElementsByClassName('game_cell'));
                });
            }
        }
    }
})();
