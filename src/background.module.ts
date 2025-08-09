import { async_addGameToCollection, async_getGameCollections, async_initCollectionsDatabase, async_removeGameFromCollection } from './database/collections.js';
import { BrowserName } from './lib/lib.env.module.js';
import { StorageMessage } from './lib/StorageMessage.js';

// chrome.action.onClicked
// https://developer.chrome.com/docs/extensions/reference/api/action
// Use the chrome.action API to control the extension's icon in the Google
// Chrome toolbar.
//
// The action icons are displayed in the browser toolbar next to the omnibox.
// After installation, these appear in the extensions menu (the puzzle piece
// icon). Users can pin your extension icon to the toolbar.
chrome.action.onClicked.addListener(async (currentTab) => {
  // chrome.tabs.query
  // https://developer.chrome.com/docs/extensions/reference/api/tabs#method-query
  // Gets all tabs that have the specified properties, or all tabs if no
  // properties are specified.
});

if (BrowserName === 'chrome') {
  // Open Chrome Web Store Page
  chrome.contextMenus.create(
    {
      contexts: ['action'],
      id: 'action--open-store-page-chrome',
      title: 'Open Chrome Web Store Page',
    },
    () => {
      chrome.runtime.lastError; // ignore the errors
    },
  );
}

if (BrowserName === 'firefox') {
  // Open Firefox Browser Add-ons Page
  chrome.contextMenus.create(
    {
      contexts: ['action'],
      id: 'action--open-store-page-firefox',
      title: 'Open Firefox Browser Add-ons Page',
    },
    () => {
      chrome.runtime.lastError; // ignore the errors
    },
  );
  // Open Extension Options
  chrome.contextMenus.create(
    {
      contexts: ['action'],
      id: 'action--open-extension-options',
      title: 'Options',
    },
    () => {
      chrome.runtime.lastError; // ignore the errors
    },
  );
}

chrome.contextMenus.onClicked.addListener((info, currentTab) => {
  switch (info.menuItemId) {
    case 'action--open-store-page-chrome':
      chrome.tabs.create({ url: 'https://chromewebstore.google.com/' });
      break;
    case 'action--open-store-page-firefox':
      chrome.tabs.create({ url: 'https://addons.mozilla.org/en-US/firefox/' });
      break;
    case 'action--open-extension-options':
      chrome.runtime.openOptionsPage();
      break;
  }
});

await async_initCollectionsDatabase();

chrome.runtime.onMessage.addListener(async (message: StorageMessage, sender, sendResponse) => {
  try {
    switch (message.type) {
      case 'REQUEST_GET_GAME_COLLECTIONS': {
        const game_collection_set = await async_getGameCollections({ game_id: message.data.game_id });
        sendResponse({ type: 'RESPONSE_GAME_COLLECTIONS', data: { collection_names: [...game_collection_set] } });
        break;
      }
      case 'REQUEST_ADD_GAME_TO_COLLECTION': {
        await async_addGameToCollection({ collection_name: message.data.collection_name, game_id: message.data.game_id });
        sendResponse({ type: 'RESPONSE_OK', data: {} });
        break;
      }
      case 'REQUEST_REMOVE_GAME_FROM_COLLECTION': {
        await async_removeGameFromCollection({ collection_name: message.data.collection_name, game_id: message.data.game_id });
        sendResponse({ type: 'RESPONSE_OK', data: {} });
        break;
      }
      default:
        sendResponse({ type: 'RESPONSE_ERROR', data: { message: 'Unknown message type' } });
    }
  } catch (error: any) {
    sendResponse({ type: 'RESPONSE_ERROR', data: { message: error.message } });
  }
  return true; // keep the message channel open for async response
});
