import { WebPlatform_DOM_Element_Added_Observer_Class } from './ericchase/WebPlatform_DOM_Element_Added_Observer_Class.js';
import { WebPlatform_Node_Reference_Class } from './ericchase/WebPlatform_Node_Reference_Class.js';
import { async_showGamePageCollectionsManager } from './game-page-collections-manager.js';

const game_page_meta_selector = 'meta[name="itch:path"]';
const game_page_user_tools_selector = '#user_tools';

export function setupGamePageObserver(): void {
  WebPlatform_DOM_Element_Added_Observer_Class({
    selector: game_page_meta_selector,
  }).subscribe((meta_game_id) => {
    if (meta_game_id instanceof HTMLMetaElement) {
      const game_id = meta_game_id.getAttribute('content')?.slice('games/'.length);
      if (game_id !== undefined) {
        processGamePage(game_id);
      }
    }
  });
}

function processGamePage(game_id: string): void {
  WebPlatform_DOM_Element_Added_Observer_Class({
    selector: game_page_user_tools_selector,
  }).subscribe(async (ul_user_tools, unsubscribe) => {
    if (ul_user_tools instanceof HTMLUListElement) {
      unsubscribe();
      await async_setupGamePage(WebPlatform_Node_Reference_Class(ul_user_tools).as(HTMLUListElement), game_id);
    }
  });
}

async function async_setupGamePage(ul_user_tools: HTMLUListElement, game_id: string): Promise<void> {
  await async_showGamePageCollectionsManager(ul_user_tools, game_id);
}
