import { Dexie } from './external/dexie/dexie.module.js';
import { Core_Console_Error } from './lib/ericchase/Core_Console_Error.js';
import { Core_Promise_Orphan } from './lib/ericchase/Core_Promise_Orphan.js';
import { BrowserName } from './lib/lib.env.module.js';
import { StorageMessage } from './lib/StorageMessage.js';

// Database Setup

class CollectionsDB extends Dexie {
  games: Dexie.Table<{ id: string }, string>;
  collections: Dexie.Table<{ name: string }, string>;
  collectionGames: Dexie.Table<{ collectionName: string; gameId: string }, [string, string]>;

  constructor() {
    super(CollectionsDB.name.toLowerCase());

    this.version(1).stores({});

    this.version(2)
      .stores({
        games: '&id',
        collections: '&name',
        collectionGames: '[collectionName+gameId], collectionName, gameId',
      })
      .upgrade(async () => {});

    this.games = this.table('games');
    this.collections = this.table('collections');
    this.collectionGames = this.table('collectionGames');
  }
}

const db = new CollectionsDB();

// Chrome API

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

// chrome doesn't seem to support async listeners
chrome.runtime.onMessage.addListener((message: StorageMessage, sender, sendResponse) => {
  // could have probably used an async iife here, but i'm showing off this api
  Core_Promise_Orphan(async_onMessageListener(message, sendResponse));
  return true;
});

async function async_onMessageListener(message: StorageMessage, sendResponse: (response: StorageMessage) => void): Promise<void> {
  try {
    switch (message.type) {
      case 'REQUEST_EXPORT_DATABASE': {
        const json = await async_exportDatabase();
        if (json !== undefined) {
          const response: StorageMessage = { type: 'RESPONSE_DATABASE_JSON', data: { json } };
          return sendResponse(response);
        } else {
          const response: StorageMessage = { type: 'RESPONSE_ERROR', data: { message: 'Failed to export database' } };
          return sendResponse(response);
        }
        break;
      }
      case 'REQUEST_IMPORT_DATABASE': {
        await async_importDatabase(message.data.json);
        broadcastUIRefresh((await async_getAllGameCollections()).map((record) => ({ ...record, contains: true })));
        const response: StorageMessage = { type: 'RESPONSE_OK' };
        return sendResponse(response);
        break;
      }
      case 'REQUEST_GET_GAME_COLLECTIONS': {
        const response: StorageMessage = { type: 'RESPONSE_GAME_COLLECTIONS', data: { collection_names: await async_getGameCollections(message.data) } };
        return sendResponse(response);
        break;
      }
      case 'REQUEST_ADD_GAME_TO_COLLECTION': {
        await async_addGameToCollection(message.data);
        broadcastUIRefresh([{ collection_name: message.data.collection_name, game_id: message.data.game_id, contains: true }]);
        const response: StorageMessage = { type: 'RESPONSE_OK' };
        return sendResponse(response);
        break;
      }
      case 'REQUEST_REMOVE_GAME_FROM_COLLECTION': {
        await async_removeGameFromCollection(message.data);
        broadcastUIRefresh([{ collection_name: message.data.collection_name, game_id: message.data.game_id, contains: false }]);
        const response: StorageMessage = { type: 'RESPONSE_OK' };
        return sendResponse(response);
        break;
      }
      default: {
        const response: StorageMessage = { type: 'RESPONSE_ERROR', data: { message: 'Unknown message type' } };
        return sendResponse(response);
        break;
      }
    }
  } catch (error: any) {
    const response: StorageMessage = { type: 'RESPONSE_ERROR', data: { message: error.message } };
    return sendResponse(response);
  }
}

function broadcastUIRefresh(data: { collection_name: string; game_id: string; contains: boolean }[]): void {
  chrome.tabs.query({}, (tabs) => {
    for (const tab of tabs) {
      if (tab.id && tab.url && new URL(tab.url).hostname.endsWith('itch.io')) {
        chrome.tabs.sendMessage(tab.id, { type: 'REFRESH_UI', data });
      }
    }
  });
}

// Database Functions

async function async_initCollectionsDatabase(): Promise<void> {
  await db.open();
}

async function async_addCollection(args: { collection_name: string }): Promise<void> {
  await db.collections.put({ name: args.collection_name });
}

async function async_removeCollection(args: { collection_name: string }): Promise<void> {
  await db.transaction('rw', db.collections, db.collectionGames, async () => {
    await db.collections.delete(args.collection_name);
    await db.collectionGames.where('collectionName').equals(args.collection_name).delete();
  });
}

async function async_addGameToCollection(args: { collection_name: string; game_id: string }): Promise<void> {
  await db.transaction('rw', db.games, db.collections, db.collectionGames, async () => {
    if ((await db.collections.get(args.collection_name)) === undefined) {
      await db.collections.put({ name: args.collection_name });
    }
    if ((await db.games.get(args.game_id)) === undefined) {
      await db.games.put({ id: args.game_id });
    }
    await db.collectionGames.put({ collectionName: args.collection_name, gameId: args.game_id });
  });
}

async function async_getAllGameCollections(): Promise<{ collection_name: string; game_id: string }[]> {
  return (await db.collectionGames.toArray()).map(({ collectionName, gameId }) => ({ collection_name: collectionName, game_id: gameId }));
}

async function async_getGameCollections(args: { game_id: string }): Promise<string[]> {
  const collectionGames_records = await db.collectionGames.where('gameId').equals(args.game_id).toArray();
  const collection_names = collectionGames_records.map((record) => record.collectionName);
  if (collection_names.length === 0) {
    return [];
  }
  const collections_records = await db.collections.where('name').anyOf(collection_names).toArray();
  return collections_records.map((record) => record.name);
}

async function async_removeGameFromCollection(args: { collection_name: string; game_id: string }): Promise<void> {
  await db.transaction('rw', db.games, db.collectionGames, async () => {
    await db.collectionGames.delete([args.collection_name, args.game_id]);
    if ((await db.collectionGames.where('gameId').equals(args.game_id).count()) === 0) {
      await db.games.delete(args.game_id);
    }
  });
}

async function async_exportDatabase(): Promise<string> {
  try {
    const data = {
      games: await db.games.toArray(),
      collections: await db.collections.toArray(),
      collectionGames: await db.collectionGames.toArray(),
    };
    return JSON.stringify(data);
  } catch (error) {
    Core_Console_Error(error);
  }
  return '{}';
}

async function async_importDatabase(json: string): Promise<void> {
  try {
    const data = JSON.parse(json);
    await db.transaction('rw', db.games, db.collections, db.collectionGames, async () => {
      if (Array.isArray(data.games)) {
        await db.games.bulkPut(data.games);
      }
      if (Array.isArray(data.collections)) {
        await db.collections.bulkPut(data.collections);
      }
      if (Array.isArray(data.collectionGames)) {
        await db.collectionGames.bulkPut(data.collectionGames);
      }
    });
  } catch (error) {
    Core_Console_Error(error);
  }
}
