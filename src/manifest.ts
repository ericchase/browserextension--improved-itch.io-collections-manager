// do not remove any of these, they are generally required by addon stores
export const MANIFEST_REQUIRED: Record<string, any> = {
  manifest_version: 3, // must be 3 for chrome now
  name: 'Improved Itch.io Collections Manager',
  version: '0.0.0',
  description: 'Improved Itch.io Collections Manager',
  icons: {
    16: 'assets/icon-16.png',
    // 32: 'assets/icon-32.png',
    48: 'assets/icon-48.png',
    128: 'assets/icon-128.png',
  },
};

// these are optional and should work on each target browser
export const MANIFEST_OPTIONAL = {
  author: 'ericchase',
  action: {
    default_popup: 'popup/popup.html',
  },
  content_scripts: [
    {
      matches: ['https://*.itch.io/*'],
      css: [
        'assets/icons/eye-off.css',
        'assets/icons/heart.css',
        'assets/game-cell-collections-manager.css',
        'assets/game-cell.css',
        'assets/game-page-collections-manager.css',
        //
      ],
      js: ['content_scripts/content.iife.js'],
      run_at: 'document_start',
    },
  ],
  web_accessible_resources: [],
  permissions: ['contextMenus', 'storage', 'scripting'],
  host_permissions: ['https://*.itch.io/*'],
  content_security_policy: {
    extension_pages: "script-src 'self' 'wasm-unsafe-eval'; object-src 'self';",
  },
};

// these are optional per browser keys
export const PER_BROWSER_MANIFEST_OPTIONAL = {
  chrome: {
    background: {
      service_worker: 'background.module.js',
      type: 'module',
    },
    options_page: 'options/options.html',
    minimum_chrome_version: '120',
  },
  firefox: {
    // action: {
    //   default_icon: {
    //     16: 'assets/icon-dark-16.png',
    //     32: 'assets/icon-dark-32.png',
    //     48: 'assets/icon-dark-48.png',
    //     128: 'assets/icon-dark-128.png',
    //   },
    //   theme_icons: [
    //     {
    //       dark: 'assets/icon-dark-16.png',
    //       light: 'assets/icon-light-16.png',
    //       size: 16,
    //     },
    //     {
    //       dark: 'assets/icon-dark-32.png',
    //       light: 'assets/icon-light-32.png',
    //       size: 32,
    //     },
    //     {
    //       dark: 'assets/icon-dark-48.png',
    //       light: 'assets/icon-light-48.png',
    //       size: 48,
    //     },
    //     {
    //       dark: 'assets/icon-dark-128.png',
    //       light: 'assets/icon-light-128.png',
    //       size: 128,
    //     },
    //   ],
    // },
    background: {
      scripts: ['background.module.js'],
      type: 'module',
    },
    options_ui: {
      page: 'options/options.html',
      open_in_tab: false,
    },
    browser_specific_settings: {
      gecko: {
        strict_min_version: '120.0',
      },
      gecko_android: {},
    },
  },
};

// these are per browser keys for the final addon package
export const PER_BROWSER_MANIFEST_PACKAGE = {
  chrome: {
    key: '',
  },
  firefox: {
    browser_specific_settings: {
      gecko: {
        // https://extensionworkshop.com/documentation/develop/extensions-and-the-add-on-id/#when-do-you-need-an-add-on-id
        // All Manifest V3 extensions need an add-on ID in their manifest.json when submitted to AMO.
        // For Manifest V2 extensions, you need to add an add-on ID for certain situations.
        id: 'browserextension--improved-itch.io-collections-manager',
      },
    },
  },
};
