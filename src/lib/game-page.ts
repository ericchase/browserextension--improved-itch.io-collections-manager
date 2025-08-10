import { WebPlatform_DOM_Element_Added_Observer_Class } from './ericchase/WebPlatform_DOM_Element_Added_Observer_Class.js';
import { async_showGamePageCollectionsManager } from './game-page-collections-manager.js';

export function setupGamePageObserver() {
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
}

function processGamePage(game_id: string) {
  WebPlatform_DOM_Element_Added_Observer_Class({
    selector: '#user_tools',
  }).subscribe(async (ul_user_tools, unsubscribe) => {
    if (ul_user_tools instanceof HTMLUListElement) {
      unsubscribe();
      await async_setupGamePage(ul_user_tools, game_id);
    }
  });
}

async function async_setupGamePage(ul_user_tools: HTMLUListElement, game_id: string) {
  await async_showGamePageCollectionsManager(ul_user_tools, game_id);
}
