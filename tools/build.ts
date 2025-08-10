import { BunPlatform_Args_Has } from '../src/lib/ericchase/BunPlatform_Args_Has.js';
import { Step_Dev_Format } from './core-dev/step/Step_Dev_Format.js';
import { Step_Dev_Project_Update_Config } from './core-dev/step/Step_Dev_Project_Update_Config.js';
import { Processor_HTML_Custom_Component_Processor } from './core-web/processor/Processor_HTML_Custom_Component_Processor.js';
import { Step_Dev_Server } from './core-web/step/Step_Dev_Server.js';
import { Builder } from './core/Builder.js';
import { Processor_Set_Writable } from './core/processor/Processor_Set_Writable.js';
import { Processor_TypeScript_Generic_Bundler } from './core/processor/Processor_TypeScript_Generic_Bundler.js';
import { Processor_TypeScript_Generic_Transpiler } from './core/processor/Processor_TypeScript_Generic_Transpiler.js';
import { Step_Bun_Run } from './core/step/Step_Bun_Run.js';
import { Step_FS_Clean_Directory } from './core/step/Step_FS_Clean_Directory.js';
import { Processor_Browser_Extension_Update_Manifest_Cache } from './lib-browser-extension/processors/Processor_Browser_Extension_Update_Manifest_Cache.js';
import { Step_Browser_Extension_Bundle } from './lib-browser-extension/steps/Step_Browser_Extension_Bundle.js';

const manifest_pattern = `${Builder.Dir.Src}/manifest.ts`;

if (BunPlatform_Args_Has('--dev')) {
  Builder.SetMode(Builder.MODE.DEV);
}
Builder.SetVerbosity(Builder.VERBOSITY._1_LOG);
Builder.SetStartUpSteps(
  Step_Dev_Project_Update_Config({ project_path: './' }),
  Step_Bun_Run({ cmd: ['bun', 'update', '--latest'], showlogs: false }),
  Step_Bun_Run({ cmd: ['bun', 'install'], showlogs: false }),
  Step_FS_Clean_Directory(Builder.Dir.Out),
  Step_Dev_Format({ showlogs: false }),
  //
);
Builder.SetProcessorModules(
  Processor_HTML_Custom_Component_Processor(),
  Processor_TypeScript_Generic_Bundler({ target: 'browser' }),
  Processor_Browser_Extension_Update_Manifest_Cache({ manifest_path: manifest_pattern }),
  Processor_TypeScript_Generic_Transpiler({ include_patterns: [manifest_pattern] }, { target: 'browser' }),
  Processor_Set_Writable({ include_patterns: [manifest_pattern], value: false }),
  Processor_Set_Writable({ include_patterns: ['**/*{.css,.html,.png}'], value: true }),
  //
);
Builder.SetAfterProcessingSteps(
  Step_Browser_Extension_Bundle({ release_dir: 'release' }),
  Step_Dev_Server(),
  //
);
await Builder.Start();
