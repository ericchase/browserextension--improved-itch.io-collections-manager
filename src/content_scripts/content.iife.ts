import { Async_WebPlatform_DOM_ReadyState_Callback } from '../lib/ericchase/WebPlatform_DOM_ReadyState_Callback.js';
import { setupGameCellObserver, updateGameCells } from '../lib/game-cell.js';
import { updateGamePageCollectionsManager } from '../lib/game-page-collections-manager.js';
import { setupGamePageObserver } from '../lib/game-page.js';

Async_WebPlatform_DOM_ReadyState_Callback({
  async DOMContentLoaded() {
    setupGameCellObserver();
    setupGamePageObserver();
  },
});

function updateIcons(args: { collection_name: string; game_id: string }, force_value?: boolean) {
  updateGameCells(args, force_value);
  updateGamePageCollectionsManager(args, force_value);
}

chrome.runtime.onMessage.addListener((message: { type: 'REFRESH_UI'; data: { collection_name: string; game_id: string; contains: boolean }[] }) => {
  if (message.type === 'REFRESH_UI') {
    for (const item of message.data) {
      updateIcons(item, item.contains);
    }
  }
});
