import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

import { animatedDetailsAccordions } from '$components/accordions';
import { initBgColorChange } from '$components/bg-color-change';
import '$components/dialog';
import { setSearchDialogTrigger } from '$components/search-dialog';
import { initializeVimeoPlayers } from '$components/vimeo-player';
import { fadeUp } from '$utils/fade';

window.gsap = gsap;
window.ScrollTrigger = ScrollTrigger;
window.gsap.registerPlugin(ScrollTrigger);

window.Webflow = window.Webflow || [];
window.Webflow?.push(() => {
  initBgColorChange();
  animatedDetailsAccordions();
  fadeUp();
  setSearchDialogTrigger();
  initializeVimeoPlayers();
});

window.fsAttributes = window.fsAttributes || [];
window.fsAttributes.push([
  'cmsfilter',
  (filterInstances) => {
    const [filterInstance] = filterInstances;
    filterInstance.listInstance.on('renderitems', (renderedItems) => {
      // refresh scrolltrigger after cmsfilter items are rendered
      setTimeout(() => {
        window.ScrollTrigger.refresh();
      }, 100);
    });
  },
]);

const CURRENT_YEAR = document.getElementById('current-year');

if (CURRENT_YEAR) {
  CURRENT_YEAR.textContent = new Date().getFullYear().toString();
}
