import { CreateEyeOffIcon } from '../components/icon-eye-off/eye-off.js';
import { CreateHeartIcon } from '../components/icon-heart/heart.js';
import { WebPlatform_DOM_Element_Added_Observer_Class } from '../lib/ericchase/WebPlatform_DOM_Element_Added_Observer_Class.js';
import { WebPlatform_DOM_Inject_CSS } from '../lib/ericchase/WebPlatform_DOM_Inject_CSS.js';
import { Async_WebPlatform_DOM_ReadyState_Callback } from '../lib/ericchase/WebPlatform_DOM_ReadyState_Callback.js';
import { WebPlatform_Node_Reference_Class } from '../lib/ericchase/WebPlatform_Node_Reference_Class.js';
import { StorageMessage } from '../lib/StorageMessage.js';
import collectionscss from './collections.css' assert { type: 'text' };

const processed_set = new Set<HTMLDivElement>();

Async_WebPlatform_DOM_ReadyState_Callback({
  async DOMContentLoaded() {
    console.log('DOMContentLoaded');

    WebPlatform_DOM_Inject_CSS(collectionscss);

    // game cells in lists of games
    WebPlatform_DOM_Element_Added_Observer_Class({
      selector: 'div.game_cell',
    }).subscribe(async (div_game_cell) => {
      if (div_game_cell instanceof HTMLDivElement) {
        if (processed_set.has(div_game_cell) === false) {
          processed_set.add(div_game_cell);
          await async_processGameCell(div_game_cell);
        }
      }
    });

    // actual game pages
    WebPlatform_DOM_Element_Added_Observer_Class({
      selector: 'meta[name="itch:path"]',
    }).subscribe((meta_game_id) => {
      if (meta_game_id instanceof HTMLMetaElement) {
        const game_id = meta_game_id.getAttribute('content')?.slice('games/'.length);
        if (game_id !== undefined) {
          processGamePage(game_id);
        }
      }
    });
  },
});

async function async_processGameCell(game_cell: HTMLDivElement) {
  console.log('async_processGameCell');

  const game_id = game_cell.getAttribute('data-game_id') ?? undefined;
  const div_game_title = WebPlatform_Node_Reference_Class(game_cell.querySelector('div.game_title')).tryAs(HTMLDivElement);
  const a_title = WebPlatform_Node_Reference_Class(game_cell.querySelector('a.title')).tryAs(HTMLAnchorElement);

  // console.log({ game_id, div_game_title, a_title });

  if (game_id !== undefined && div_game_title !== undefined && a_title !== undefined) {
    const game_collection_set = await async_requestGetGameCollections({ game_id });
    console.log({ game_id, game_collection_set });

    // setup favorites collection
    if ((div_game_title.querySelector('& > svg.heart-icon') ?? undefined) === undefined) {
      let in_favorites = game_collection_set.has('favorites');
      const favorites_icon = CreateHeartIcon();
      if (in_favorites === true) {
        favorites_icon.classList.add('toggled');
        game_cell.classList.add('collection-favorites');
      }
      favorites_icon.addEventListener('click', async () => {
        if (in_favorites === true) {
          // remove
          in_favorites = false;
          favorites_icon.classList.remove('toggled');
          await async_requestRemoveGameFromCollection({ collection_name: 'favorites', game_id });
          game_cell.classList.remove('collection-favorites');
        } else {
          // add
          in_favorites = true;
          favorites_icon.classList.add('toggled');
          await async_requestAddGameToCollection({ collection_name: 'favorites', game_id });
          game_cell.classList.add('collection-favorites');
        }
      });
      a_title.before(favorites_icon);
    }

    // setup hidden collection
    if ((div_game_title.querySelector('& > svg.eye-off-icon') ?? undefined) === undefined) {
      let in_hidden = game_collection_set.has('hidden');
      const eye_off_icon = CreateEyeOffIcon();
      if (in_hidden === true) {
        eye_off_icon.classList.add('toggled');
        game_cell.classList.add('collection-hidden');
      }
      eye_off_icon.addEventListener('click', async () => {
        if (in_hidden === true) {
          // remove
          in_hidden = false;
          eye_off_icon.classList.remove('toggled');
          await async_requestRemoveGameFromCollection({ collection_name: 'hidden', game_id });
          game_cell.classList.remove('collection-hidden');
        } else {
          // add
          in_hidden = true;
          eye_off_icon.classList.add('toggled');
          await async_requestAddGameToCollection({ collection_name: 'hidden', game_id });
          game_cell.classList.add('collection-hidden');
        }
      });
      a_title.before(eye_off_icon);
    }
  }
}

function processGamePage(game_id: string) {
  console.log('processGamePage');

  WebPlatform_DOM_Element_Added_Observer_Class({
    selector: '#user_tools',
  }).subscribe(async (ul_user_tools, unsubscribe) => {
    if (ul_user_tools instanceof HTMLUListElement) {
      unsubscribe();
      await async_showManagerPanel(ul_user_tools, game_id);
    }
  });
}

async function async_showManagerPanel(ul_user_tools: HTMLUListElement, game_id: string) {
  console.log('async_showManagerPanel');

  // insert panel underneath
  const div_manager_panel = document.createElement('div');
  div_manager_panel.classList.add('collections-manager-panel');
  ul_user_tools.after(div_manager_panel);

  const game_collection_set = await async_requestGetGameCollections({ game_id });
  console.log({ game_id, game_collection_set });

  // setup favorites collection
  {
    let in_favorites = game_collection_set.has('favorites');
    const favorites_icon = CreateHeartIcon();
    if (in_favorites === true) {
      favorites_icon.classList.add('toggled');
    }
    favorites_icon.addEventListener('click', async () => {
      if (in_favorites === true) {
        // remove
        in_favorites = false;
        favorites_icon.classList.remove('toggled');
        await async_requestRemoveGameFromCollection({ collection_name: 'favorites', game_id });
      } else {
        // add
        in_favorites = true;
        favorites_icon.classList.add('toggled');
        await async_requestAddGameToCollection({ collection_name: 'favorites', game_id });
      }
    });
    div_manager_panel.appendChild(favorites_icon);
  }

  // setup hidden collection
  {
    let in_hidden = game_collection_set.has('hidden');
    const eye_off_icon = CreateEyeOffIcon();
    if (in_hidden === true) {
      eye_off_icon.classList.add('toggled');
    }
    eye_off_icon.addEventListener('click', async () => {
      if (in_hidden === true) {
        // remove
        in_hidden = false;
        eye_off_icon.classList.remove('toggled');
        await async_requestRemoveGameFromCollection({ collection_name: 'hidden', game_id });
      } else {
        // add
        in_hidden = true;
        eye_off_icon.classList.add('toggled');
        await async_requestAddGameToCollection({ collection_name: 'hidden', game_id });
      }
    });
    div_manager_panel.appendChild(eye_off_icon);
  }
}

// message functions

function sendMessage(message: StorageMessage, cb: (response: StorageMessage) => void) {
  chrome.runtime.sendMessage(message, cb);
}

function async_requestGetGameCollections(args: { game_id: string }): Promise<Set<string>> {
  return new Promise(async (resolve, reject) => {
    sendMessage({ type: 'REQUEST_GET_GAME_COLLECTIONS', data: { game_id: args.game_id } }, (response) => {
      switch (response.type) {
        case 'RESPONSE_GAME_COLLECTIONS':
          return resolve(new Set(response.data.collection_names));
          break;
        case 'RESPONSE_ERROR':
          return reject(response.data.message);
          break;
        default:
          return reject(`incorrect event details: { type: ${response.type} }`);
      }
    });
  });
}

async function async_requestAddGameToCollection(args: { collection_name: string; game_id: string }): Promise<void> {
  return new Promise(async (resolve, reject) => {
    sendMessage({ type: 'REQUEST_ADD_GAME_TO_COLLECTION', data: { collection_name: args.collection_name, game_id: args.game_id } }, (response) => {
      switch (response.type) {
        case 'RESPONSE_OK':
          return resolve();
          break;
        case 'RESPONSE_ERROR':
          return reject(response.data.message);
          break;
        default:
          return reject(`incorrect event details: { type: ${response.type} }`);
      }
    });
  });
}

async function async_requestRemoveGameFromCollection(args: { collection_name: string; game_id: string }): Promise<void> {
  return new Promise(async (resolve, reject) => {
    sendMessage({ type: 'REQUEST_REMOVE_GAME_FROM_COLLECTION', data: { collection_name: args.collection_name, game_id: args.game_id } }, (response) => {
      switch (response.type) {
        case 'RESPONSE_OK':
          return resolve();
          break;
        case 'RESPONSE_ERROR':
          return reject(response.data.message);
          break;
        default:
          return reject(`incorrect event details: { type: ${response.type} }`);
      }
    });
  });
}
