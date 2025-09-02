import { NODE_PATH } from '../../../src/lib/ericchase/NodePlatform.js';
import { Builder } from '../../core/Builder.js';
import { Logger } from '../../core/Logger.js';
import { Async_Update_Manifest_Cache } from '../ManifestCache.js';

export function Processor_Browser_Extension_Update_Manifest_Cache(config: Config): Builder.Processor {
  return new Class(config);
}
class Class implements Builder.Processor {
  ProcessorName = Processor_Browser_Extension_Update_Manifest_Cache.name;
  channel = Logger(this.ProcessorName).newChannel();

  constructor(readonly config: Config) {}
  async onStartUp(): Promise<void> {
    this.config.manifest_path = NODE_PATH.join(Builder.Dir.Src, this.config.manifest_path);
  }
  async onAdd(files: Set<Builder.File>): Promise<void> {
    for (const file of files) {
      if (file.src_path === this.config.manifest_path) {
        file.addProcessor(this, this.onProcess);
      }
    }
  }

  async onProcess(file: Builder.File): Promise<void> {
    this.channel.log('Update Manifest Cache');
    await Async_Update_Manifest_Cache(file);
  }
}
interface Config {
  manifest_path: string;
}
