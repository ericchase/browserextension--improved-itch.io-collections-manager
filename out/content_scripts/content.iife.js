(() => {

// src/lib/ericchase/WebPlatform_DOM_Inject_CSS.ts
function WebPlatform_DOM_Inject_CSS(styles) {
  const stylesheet = new CSSStyleSheet;
  stylesheet.replaceSync(styles);
  document.adoptedStyleSheets.push(stylesheet);
  return stylesheet;
}

// src/lib/ericchase/WebPlatform_DOM_ReadyState_Callback.ts
async function Async_WebPlatform_DOM_ReadyState_Callback(config) {
  async function DOMContentLoaded() {
    removeEventListener("DOMContentLoaded", DOMContentLoaded);
    await config.DOMContentLoaded?.();
  }
  async function load() {
    removeEventListener("load", load);
    await config.load?.();
  }
  switch (document.readyState) {
    case "loading":
      if (config.DOMContentLoaded !== undefined) {
        addEventListener("DOMContentLoaded", DOMContentLoaded);
      }
      if (config.load !== undefined) {
        addEventListener("load", load);
      }
      break;
    case "interactive":
      await config.DOMContentLoaded?.();
      if (config.load !== undefined) {
        addEventListener("load", load);
      }
      break;
    case "complete":
      await config.DOMContentLoaded?.();
      await config.load?.();
      break;
  }
}

// src/lib/ericchase/WebPlatform_Node_Reference_Class.ts
class Class_WebPlatform_Node_Reference_Class {
  node;
  constructor(node) {
    this.node = node;
  }
  as(constructor_ref) {
    if (this.node instanceof constructor_ref) {
      return this.node;
    }
    throw new TypeError(`Reference node ${this.node} is not ${constructor_ref}`);
  }
  is(constructor_ref) {
    return this.node instanceof constructor_ref;
  }
  passAs(constructor_ref, fn) {
    if (this.node instanceof constructor_ref) {
      fn(this.node);
    }
  }
  tryAs(constructor_ref) {
    if (this.node instanceof constructor_ref) {
      return this.node;
    }
  }
  get classList() {
    return this.as(HTMLElement).classList;
  }
  get className() {
    return this.as(HTMLElement).className;
  }
  get style() {
    return this.as(HTMLElement).style;
  }
  getAttribute(qualifiedName) {
    return this.as(HTMLElement).getAttribute(qualifiedName);
  }
  setAttribute(qualifiedName, value) {
    this.as(HTMLElement).setAttribute(qualifiedName, value);
  }
  getStyleProperty(property) {
    return this.as(HTMLElement).style.getPropertyValue(property);
  }
  setStyleProperty(property, value, priority) {
    this.as(HTMLElement).style.setProperty(property, value, priority);
  }
}
function WebPlatform_Node_Reference_Class(node) {
  return new Class_WebPlatform_Node_Reference_Class(node);
}

// src/components/icon-eye-off/eye-off.css
var eye_off_default = `.eye-off-icon {
  cursor: pointer;
  user-select: none;
  width: calc(16em / 14);
  height: calc(16em / 14);
  margin-inline-end: 0.125em;
  vertical-align: bottom;
  stroke: lightgray;
  &:hover {
    stroke: gray;
  }
  &.toggled {
    stroke: red;
  }
}
`;

// src/components/icon-eye-off/eye-off.svg
var eye_off_default2 = `<!-- https://lucide.dev/icons/eye-off -->
<!--
Copyright (c) for portions of Lucide are held by Cole Bemis 2013-2022 as part
of Feather (MIT). All other copyright (c) for Lucide are held by Lucide
Contributors 2022.
-->
<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-eye-off-icon lucide-eye-off">
  <path d="M10.733 5.076a10.744 10.744 0 0 1 11.205 6.575 1 1 0 0 1 0 .696 10.747 10.747 0 0 1-1.444 2.49" />
  <path d="M14.084 14.158a3 3 0 0 1-4.242-4.242" />
  <path d="M17.479 17.499a10.75 10.75 0 0 1-15.417-5.151 1 1 0 0 1 0-.696 10.75 10.75 0 0 1 4.446-5.143" />
  <path d="m2 2 20 20" />
</svg>
`;

// src/components/icon-eye-off/eye-off.ts
Async_WebPlatform_DOM_ReadyState_Callback({
  async DOMContentLoaded() {
    WebPlatform_DOM_Inject_CSS(eye_off_default);
  }
});
var parser = new DOMParser;
function CreateEyeOffIcon() {
  const svg = WebPlatform_Node_Reference_Class(parser.parseFromString(eye_off_default2, "text/html").querySelector("svg")).as(SVGElement);
  svg.classList.add("eye-off-icon");
  return svg;
}

// src/components/icon-heart/heart.css
var heart_default = `.heart-icon {
  cursor: pointer;
  user-select: none;
  width: calc(16em / 14);
  height: calc(16em / 14);
  margin-inline-end: 0.125em;
  vertical-align: bottom;
  stroke: none;
  fill: lightgray;
  &:hover {
    fill: gray;
  }
  &.toggled {
    fill: red;
  }
}
`;

// src/components/icon-heart/heart.svg
var heart_default2 = `<!-- https://lucide.dev/icons/heart -->\r
<!--\r
Copyright (c) for portions of Lucide are held by Cole Bemis 2013-2022 as part\r
of Feather (MIT). All other copyright (c) for Lucide are held by Lucide\r
Contributors 2022.\r
-->\r
<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-heart">\r
  <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z" />\r
</svg>\r
`;

// src/components/icon-heart/heart.ts
Async_WebPlatform_DOM_ReadyState_Callback({
  async DOMContentLoaded() {
    WebPlatform_DOM_Inject_CSS(heart_default);
  }
});
var parser2 = new DOMParser;
function CreateHeartIcon() {
  const svg = WebPlatform_Node_Reference_Class(parser2.parseFromString(heart_default2, "text/html").querySelector("svg")).as(SVGElement);
  svg.classList.add("heart-icon");
  return svg;
}

// src/lib/ericchase/WebPlatform_DOM_Element_Added_Observer_Class.ts
class Class_WebPlatform_DOM_Element_Added_Observer_Class {
  constructor(config) {
    config.include_existing_elements ??= true;
    config.options ??= {};
    config.options.subtree ??= true;
    config.source ??= document.documentElement;
    this.mutationObserver = new MutationObserver((mutationRecords) => {
      for (const record of mutationRecords) {
        if (record.target instanceof Element && record.target.matches(config.selector)) {
          this.send(record.target);
        }
        const treeWalker = document.createTreeWalker(record.target, NodeFilter.SHOW_ELEMENT);
        while (treeWalker.nextNode()) {
          if (treeWalker.currentNode.matches(config.selector)) {
            this.send(treeWalker.currentNode);
          }
        }
      }
    });
    this.mutationObserver.observe(config.source, {
      childList: true,
      subtree: config.options.subtree ?? true
    });
    if (config.include_existing_elements === true) {
      const treeWalker = document.createTreeWalker(document, NodeFilter.SHOW_ELEMENT);
      while (treeWalker.nextNode()) {
        if (treeWalker.currentNode.matches(config.selector)) {
          this.send(treeWalker.currentNode);
        }
      }
    }
  }
  disconnect() {
    this.mutationObserver.disconnect();
    for (const callback of this.subscriptionSet) {
      this.subscriptionSet.delete(callback);
    }
  }
  subscribe(callback) {
    this.subscriptionSet.add(callback);
    let abort = false;
    for (const element of this.matchSet) {
      callback(element, () => {
        this.subscriptionSet.delete(callback);
        abort = true;
      });
      if (abort)
        return () => {};
    }
    return () => {
      this.subscriptionSet.delete(callback);
    };
  }
  mutationObserver;
  matchSet = new Set;
  subscriptionSet = new Set;
  send(element) {
    if (!this.matchSet.has(element)) {
      this.matchSet.add(element);
      for (const callback of this.subscriptionSet) {
        callback(element, () => {
          this.subscriptionSet.delete(callback);
        });
      }
    }
  }
}
function WebPlatform_DOM_Element_Added_Observer_Class(config) {
  return new Class_WebPlatform_DOM_Element_Added_Observer_Class(config);
}

// src/content_scripts/collections.css
var collections_default = `div.game_cell.collection-hidden {
  opacity: 10%;
}
div.game_cell.collection-hidden:hover {
  opacity: 50%;
}

div.collections-manager-panel {
  background-color: white;
  border-radius: 0.5em;
  border: 0.125em solid lightgray;
  font-size: 1rem;
  margin: 0.5em;
  padding: 0.5em;
  position: fixed;
  top: 0;
  z-index: 9999;
  /* min-width: 10em; */
  /* min-height: 5em; */
  width: max-content;
  /* height: 5em; */
}

@media screen and (width > 650px) and (width <= 960px) {
  div.collections-manager-panel {
    top: 2.75em;
  }
}
`;

// src/content_scripts/content.iife.ts
var processed_set = new Set;
Async_WebPlatform_DOM_ReadyState_Callback({
  async DOMContentLoaded() {
    console.log("DOMContentLoaded");
    WebPlatform_DOM_Inject_CSS(collections_default);
    WebPlatform_DOM_Element_Added_Observer_Class({
      selector: "div.game_cell"
    }).subscribe(async (div_game_cell) => {
      if (div_game_cell instanceof HTMLDivElement) {
        if (processed_set.has(div_game_cell) === false) {
          processed_set.add(div_game_cell);
          await async_processGameCell(div_game_cell);
        }
      }
    });
    WebPlatform_DOM_Element_Added_Observer_Class({
      selector: 'meta[name="itch:path"]'
    }).subscribe((meta_game_id) => {
      if (meta_game_id instanceof HTMLMetaElement) {
        const game_id = meta_game_id.getAttribute("content")?.slice("games/".length);
        if (game_id !== undefined) {
          processGamePage(game_id);
        }
      }
    });
  }
});
async function async_processGameCell(game_cell) {
  console.log("async_processGameCell");
  const game_id = game_cell.getAttribute("data-game_id") ?? undefined;
  const div_game_title = WebPlatform_Node_Reference_Class(game_cell.querySelector("div.game_title")).tryAs(HTMLDivElement);
  const a_title = WebPlatform_Node_Reference_Class(game_cell.querySelector("a.title")).tryAs(HTMLAnchorElement);
  if (game_id !== undefined && div_game_title !== undefined && a_title !== undefined) {
    const game_collection_set = await async_requestGetGameCollections({ game_id });
    console.log({ game_id, game_collection_set });
    if ((div_game_title.querySelector("& > svg.heart-icon") ?? undefined) === undefined) {
      let in_favorites = game_collection_set.has("favorites");
      const favorites_icon = CreateHeartIcon();
      if (in_favorites === true) {
        favorites_icon.classList.add("toggled");
        game_cell.classList.add("collection-favorites");
      }
      favorites_icon.addEventListener("click", async () => {
        if (in_favorites === true) {
          in_favorites = false;
          favorites_icon.classList.remove("toggled");
          await async_requestRemoveGameFromCollection({ collection_name: "favorites", game_id });
          game_cell.classList.remove("collection-favorites");
        } else {
          in_favorites = true;
          favorites_icon.classList.add("toggled");
          await async_requestAddGameToCollection({ collection_name: "favorites", game_id });
          game_cell.classList.add("collection-favorites");
        }
      });
      a_title.before(favorites_icon);
    }
    if ((div_game_title.querySelector("& > svg.eye-off-icon") ?? undefined) === undefined) {
      let in_hidden = game_collection_set.has("hidden");
      const eye_off_icon = CreateEyeOffIcon();
      if (in_hidden === true) {
        eye_off_icon.classList.add("toggled");
        game_cell.classList.add("collection-hidden");
      }
      eye_off_icon.addEventListener("click", async () => {
        if (in_hidden === true) {
          in_hidden = false;
          eye_off_icon.classList.remove("toggled");
          await async_requestRemoveGameFromCollection({ collection_name: "hidden", game_id });
          game_cell.classList.remove("collection-hidden");
        } else {
          in_hidden = true;
          eye_off_icon.classList.add("toggled");
          await async_requestAddGameToCollection({ collection_name: "hidden", game_id });
          game_cell.classList.add("collection-hidden");
        }
      });
      a_title.before(eye_off_icon);
    }
  }
}
function processGamePage(game_id) {
  console.log("processGamePage");
  WebPlatform_DOM_Element_Added_Observer_Class({
    selector: "#user_tools"
  }).subscribe(async (ul_user_tools, unsubscribe) => {
    if (ul_user_tools instanceof HTMLUListElement) {
      unsubscribe();
      await async_showManagerPanel(ul_user_tools, game_id);
    }
  });
}
async function async_showManagerPanel(ul_user_tools, game_id) {
  console.log("async_showManagerPanel");
  const div_manager_panel = document.createElement("div");
  div_manager_panel.classList.add("collections-manager-panel");
  ul_user_tools.after(div_manager_panel);
  const game_collection_set = await async_requestGetGameCollections({ game_id });
  console.log({ game_id, game_collection_set });
  {
    let in_favorites = game_collection_set.has("favorites");
    const favorites_icon = CreateHeartIcon();
    if (in_favorites === true) {
      favorites_icon.classList.add("toggled");
    }
    favorites_icon.addEventListener("click", async () => {
      if (in_favorites === true) {
        in_favorites = false;
        favorites_icon.classList.remove("toggled");
        await async_requestRemoveGameFromCollection({ collection_name: "favorites", game_id });
      } else {
        in_favorites = true;
        favorites_icon.classList.add("toggled");
        await async_requestAddGameToCollection({ collection_name: "favorites", game_id });
      }
    });
    div_manager_panel.appendChild(favorites_icon);
  }
  {
    let in_hidden = game_collection_set.has("hidden");
    const eye_off_icon = CreateEyeOffIcon();
    if (in_hidden === true) {
      eye_off_icon.classList.add("toggled");
    }
    eye_off_icon.addEventListener("click", async () => {
      if (in_hidden === true) {
        in_hidden = false;
        eye_off_icon.classList.remove("toggled");
        await async_requestRemoveGameFromCollection({ collection_name: "hidden", game_id });
      } else {
        in_hidden = true;
        eye_off_icon.classList.add("toggled");
        await async_requestAddGameToCollection({ collection_name: "hidden", game_id });
      }
    });
    div_manager_panel.appendChild(eye_off_icon);
  }
}
function sendMessage(message, cb) {
  chrome.runtime.sendMessage(message, cb);
}
function async_requestGetGameCollections(args) {
  return new Promise(async (resolve, reject) => {
    sendMessage({ type: "REQUEST_GET_GAME_COLLECTIONS", data: { game_id: args.game_id } }, (response) => {
      switch (response.type) {
        case "RESPONSE_GAME_COLLECTIONS":
          return resolve(new Set(response.data.collection_names));
          break;
        case "RESPONSE_ERROR":
          return reject(response.data.message);
          break;
        default:
          return reject(`incorrect event details: { type: ${response.type} }`);
      }
    });
  });
}
async function async_requestAddGameToCollection(args) {
  return new Promise(async (resolve, reject) => {
    sendMessage({ type: "REQUEST_ADD_GAME_TO_COLLECTION", data: { collection_name: args.collection_name, game_id: args.game_id } }, (response) => {
      switch (response.type) {
        case "RESPONSE_OK":
          return resolve();
          break;
        case "RESPONSE_ERROR":
          return reject(response.data.message);
          break;
        default:
          return reject(`incorrect event details: { type: ${response.type} }`);
      }
    });
  });
}
async function async_requestRemoveGameFromCollection(args) {
  return new Promise(async (resolve, reject) => {
    sendMessage({ type: "REQUEST_REMOVE_GAME_FROM_COLLECTION", data: { collection_name: args.collection_name, game_id: args.game_id } }, (response) => {
      switch (response.type) {
        case "RESPONSE_OK":
          return resolve();
          break;
        case "RESPONSE_ERROR":
          return reject(response.data.message);
          break;
        default:
          return reject(`incorrect event details: { type: ${response.type} }`);
      }
    });
  });
}

})();
