import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

import { animatedDetailsAccordions } from '$components/accordions';
import { initBgColorChange } from '$components/bg-color-change';
import { dialogInit } from '$components/dialog';

window.gsap = gsap;
window.ScrollTrigger = ScrollTrigger;
window.gsap.registerPlugin(ScrollTrigger);

window.Webflow = window.Webflow || {};
window.Webflow?.push(() => {
  initBgColorChange();
  animatedDetailsAccordions();
  dialogInit();
});
