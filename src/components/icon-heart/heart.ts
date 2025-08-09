import { WebPlatform_DOM_Inject_CSS } from '../../lib/ericchase/WebPlatform_DOM_Inject_CSS.js';
import { Async_WebPlatform_DOM_ReadyState_Callback } from '../../lib/ericchase/WebPlatform_DOM_ReadyState_Callback.js';
import { WebPlatform_Node_Reference_Class } from '../../lib/ericchase/WebPlatform_Node_Reference_Class.js';
import heartcss from './heart.css' assert { type: 'text' };
import heartsvg from './heart.svg' assert { type: 'text' };

Async_WebPlatform_DOM_ReadyState_Callback({
  async DOMContentLoaded() {
    WebPlatform_DOM_Inject_CSS(heartcss);
  },
});

const parser = new DOMParser();

export function CreateHeartIcon() {
  const svg = WebPlatform_Node_Reference_Class(parser.parseFromString(heartsvg, 'text/html').querySelector('svg')).as(SVGElement);
  svg.classList.add('heart-icon');
  return svg;
}
