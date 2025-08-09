import { WebPlatform_DOM_Inject_CSS } from '../../lib/ericchase/WebPlatform_DOM_Inject_CSS.js';
import { Async_WebPlatform_DOM_ReadyState_Callback } from '../../lib/ericchase/WebPlatform_DOM_ReadyState_Callback.js';
import { WebPlatform_Node_Reference_Class } from '../../lib/ericchase/WebPlatform_Node_Reference_Class.js';
import eyeoffcss from './eye-off.css' assert { type: 'text' };
import eyeoffsvg from './eye-off.svg' assert { type: 'text' };

Async_WebPlatform_DOM_ReadyState_Callback({
  async DOMContentLoaded() {
    WebPlatform_DOM_Inject_CSS(eyeoffcss);
  },
});

const parser = new DOMParser();

export function CreateEyeOffIcon() {
  const svg = WebPlatform_Node_Reference_Class(parser.parseFromString(eyeoffsvg, 'text/html').querySelector('svg')).as(SVGElement);
  svg.classList.add('eye-off-icon');
  return svg;
}
