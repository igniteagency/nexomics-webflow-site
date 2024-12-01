/**
 * Popups with dialog HTML element
 * Set `data-ig-dialog="{unique-number}"` attribute on the dialog element to target it
 * Set `data-ig-dialog-open="{unique-number}"` attribute on open trigger element(s) to open the dialog
 * Set `data-ig-dialog-close="{unique-number}"` attribute on close trigger element(s) to close the dialog. Close triggers should be inside the dialog element
 */
import { SCRIPTS_LOADED_EVENT } from 'src/constants';

const DATA_ATTR = 'data-ig-dialog';

const DATA_COMPONENT_SELECTOR = `dialog[${DATA_ATTR}]`;

window.addEventListener(SCRIPTS_LOADED_EVENT, () => {
  dialogInit();
});

export function dialogInit() {
  const dialogList = document.querySelectorAll<HTMLDialogElement>(DATA_COMPONENT_SELECTOR);

  dialogList.forEach((dialogEl) => {
    const id = dialogEl.getAttribute(DATA_ATTR);
    if (!id) {
      console.error('No ID found for dialog component', dialogEl);
      return;
    }

    const openTriggersList = document.querySelectorAll(`[${DATA_ATTR}-open="${id}"]`);
    const closeTriggersList = dialogEl.querySelectorAll(`[${DATA_ATTR}-close="${id}"]`);

    openTriggersList.forEach((openTriggerEl) => {
      openTriggerEl.addEventListener('click', () => {
        dialogEl.showModal();
      });
    });

    closeTriggersList.forEach((closeTriggerEl) => {
      closeTriggerEl.addEventListener('click', () => {
        dialogEl.close();
      });
    });
  });
}
