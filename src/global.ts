import { animatedDetailsAccordions } from '$components/accordions';
import { dialogInit } from '$components/dialog';

window.Webflow = window.Webflow || {};
window.Webflow?.push(() => {
  animatedDetailsAccordions();
  dialogInit();
});
