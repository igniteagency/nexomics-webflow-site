import { SCRIPTS_LOADED_EVENT } from 'src/constants';

const tocAccordionEl = document.querySelector<HTMLDetailsElement>('[data-el="toc-accordion"]');
const tocAccordionToggleEl = tocAccordionEl?.querySelector<HTMLElement>('summary');

window.addEventListener(SCRIPTS_LOADED_EVENT, () => {
  if (!tocAccordionEl) return;

  toggleTOCAccordion();
  window.Webflow?.resize.on(() => {
    toggleTOCAccordion();
  });
});

function toggleTOCAccordion() {
  if (window.innerWidth > 991) {
    if (!tocAccordionEl?.open) {
      tocAccordionToggleEl?.click();
    }
  } else {
    if (tocAccordionEl?.open) {
      tocAccordionEl.open = false;
    }
  }
}
