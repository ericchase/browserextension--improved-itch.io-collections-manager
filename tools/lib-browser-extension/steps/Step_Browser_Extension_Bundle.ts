import { Async_BunPlatform_File_Read_Text } from '../../../src/lib/ericchase/BunPlatform_File_Read_Text.js';
import { Async_BunPlatform_File_Write_Text } from '../../../src/lib/ericchase/BunPlatform_File_Write_Text.js';
import { NODE_PATH } from '../../../src/lib/ericchase/NodePlatform.js';
import { NodePlatform_PathObject_Relative_Class } from '../../../src/lib/ericchase/NodePlatform_PathObject_Relative_Class.js';
import { Builder } from '../../core/Builder.js';
import { ZIP_UTIL } from '../../core/bundle/zip-util/zip-util.js';
import { Logger } from '../../core/Logger.js';
import { Step_FS_Mirror_Directory } from '../../core/step/Step_FS_Mirror_Directory.js';
import { Get_Manifest_Browsers, Get_Per_Browser_Manifest, Get_Per_Browser_Package_Manifest, MANIFEST_REQUIRED } from '../ManifestCache.js';

export function Step_Browser_Extension_Bundle(config: Config): Builder.Step {
  return new Class(config);
}
class Class implements Builder.Step {
  StepName = Step_Browser_Extension_Bundle.name;
  channel = Logger(this.StepName).newChannel();

  constructor(readonly config: Config) {}
  async onStartUp(): Promise<void> {
    this.config.release_dir = NODE_PATH.join(this.config.release_dir);
  }
  async onRun(): Promise<void> {
    const tasks: Promise<void>[] = [];
    for (const browser of Get_Manifest_Browsers()) {
      tasks.push(
        (async () => {
          // Build Temp Folder
          const dirpath = NODE_PATH.join(this.config.release_dir, browser, 'temp');
          await Builder.ExecuteStep(Step_FS_Mirror_Directory({ from_dir: Builder.Dir.Out, into_dir: dirpath, include_patterns: ['**'] }));

          // Inject Environment Variables
          const envpath = NODE_PATH.join(dirpath, Builder.Dir.Lib, 'lib.env.module.js');
          const { value: envtext } = await Async_BunPlatform_File_Read_Text(envpath);
          if (envtext !== undefined) {
            await Async_BunPlatform_File_Write_Text(envpath, envtext.replace(`var BrowserName = "chrome";`, `var BrowserName = "${browser}";`));
          }

          // Build Zip Archive
          const zip = ZIP_UTIL.Instance();
          zip.addLocalFolder(dirpath);
          zip.addFile('manifest.json', Buffer.from(JSON.stringify(Get_Per_Browser_Package_Manifest(browser), null, 2), 'utf8'));
          zip.writeZip(NODE_PATH.join(this.config.release_dir, browser, `${GetSanitizedFileName(MANIFEST_REQUIRED.name)}-v${MANIFEST_REQUIRED.version}.zip`));

          // Replace Bundle Manifest With Debug Manifest
          await Async_BunPlatform_File_Write_Text(NODE_PATH.join(dirpath, 'manifest.json'), JSON.stringify(Get_Per_Browser_Manifest(browser), null, 2));
        })(),
      );
    }
    await Promise.all(tasks);
  }
  async onCleanUp(): Promise<void> {}
}
interface Config {
  release_dir: string;
}

function GetSanitizedFileName(name: string): string {
  return NodePlatform_PathObject_Relative_Class(name)
    .toPosix()
    .join()
    .replace(/ /g, '-')
    .replace(/[^a-z0-9\.\_\-]/gi, '_')
    .toLowerCase();
}
