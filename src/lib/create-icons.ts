import eyeoffsvg from '../assets/icons/eye-off.svg' with { type: 'text' };
import heartsvg from '../assets/icons/heart.svg' with { type: 'text' };
import { WebPlatform_Node_Reference_Class } from './ericchase/WebPlatform_Node_Reference_Class.js';

const parser = new DOMParser();

export function CreateEyeOffIcon(): SVGElement {
  const svg = WebPlatform_Node_Reference_Class(parser.parseFromString(eyeoffsvg, 'text/html').querySelector('svg')).as(SVGElement);
  svg.classList.add('eye-off-icon');
  return svg;
}

export function CreateHeartIcon(): SVGElement {
  const svg = WebPlatform_Node_Reference_Class(parser.parseFromString(heartsvg, 'text/html').querySelector('svg')).as(SVGElement);
  svg.classList.add('heart-icon');
  return svg;
}
