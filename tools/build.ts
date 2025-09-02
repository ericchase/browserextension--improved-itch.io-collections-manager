import { BunPlatform_Argv_Includes } from '../src/lib/ericchase/BunPlatform_Argv_Includes.js';
import { Step_Dev_Format } from './core-dev/step/Step_Dev_Format.js';
import { Step_Dev_Project_Update_Config } from './core-dev/step/Step_Dev_Project_Update_Config.js';
import { Processor_HTML_Custom_Component_Processor } from './core-web/processor/Processor_HTML_Custom_Component_Processor.js';
import { Processor_HTML_Remove_HotReload_On_Build } from './core-web/processor/Processor_HTML_Remove_HotReload_On_Build.js';
import { DEV_SERVER_HOST, Step_Run_Dev_Server } from './core-web/step/Step_Run_Dev_Server.js';
import { Builder } from './core/Builder.js';
import { Processor_Set_Writable } from './core/processor/Processor_Set_Writable.js';
import { Processor_TypeScript_Generic_Bundler } from './core/processor/Processor_TypeScript_Generic_Bundler.js';
import { Processor_TypeScript_Generic_Transpiler } from './core/processor/Processor_TypeScript_Generic_Transpiler.js';
import { Step_Async } from './core/step/Step_Async.js';
import { Step_Bun_Run } from './core/step/Step_Bun_Run.js';
import { Step_FS_Clean_Directory } from './core/step/Step_FS_Clean_Directory.js';
import { Processor_Browser_Extension_Update_Manifest_Cache } from './lib-browser-extension/processors/Processor_Browser_Extension_Update_Manifest_Cache.js';
import { Step_Browser_Extension_Bundle } from './lib-browser-extension/steps/Step_Browser_Extension_Bundle.js';

// await AddLoggerOutputDirectory('cache');

if (BunPlatform_Argv_Includes('--dev')) {
  Builder.SetMode(Builder.MODE.DEV);
}
Builder.SetVerbosity(Builder.VERBOSITY._1_LOG);

Builder.SetStartUpSteps(
  Step_Dev_Project_Update_Config({ project_dir: '.' }),
  Step_Bun_Run({ cmd: ['bun', 'update', '--latest'], showlogs: false }),
  Step_Bun_Run({ cmd: ['bun', 'install'], showlogs: false }),
  Step_FS_Clean_Directory(Builder.Dir.Out),
  //
);

Builder.SetProcessorModules(
  Processor_HTML_Remove_HotReload_On_Build(),
  Processor_HTML_Custom_Component_Processor(),
  Processor_TypeScript_Generic_Transpiler({}, { include_patterns: ['manifest.ts'] }),
  Processor_Browser_Extension_Update_Manifest_Cache({ manifest_path: 'manifest.ts' }),
  Processor_TypeScript_Generic_Bundler({ define: () => ({ 'process.env.SERVERHOST': DEV_SERVER_HOST }) }, { bundler_mode: 'iife' }),
  Processor_TypeScript_Generic_Bundler({ define: () => ({ 'process.env.SERVERHOST': DEV_SERVER_HOST }) }, { bundler_mode: 'module' }),
  Processor_Set_Writable({ include_patterns: ['**/*{.css,.html,.png}'], value: true }),
  Processor_Set_Writable({ include_patterns: ['manifest.ts'], value: false }),
  //
);

Builder.SetAfterProcessingSteps(
  Step_Async([
    Step_Browser_Extension_Bundle({ release_dir: 'release' }),
    Step_Run_Dev_Server(),
    //
  ]),
  //
);

Builder.SetCleanUpSteps(
  Step_Dev_Format({ showlogs: false }),
  //
);

await Builder.Start();
