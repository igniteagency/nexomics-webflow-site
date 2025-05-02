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
  handleBackdropClick();
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

/**
 * Handles backdrop click to close dialog
 * Only closes if the click was directly on the dialog element (backdrop) and not its children
 */
function handleBackdropClick() {
  const dialogEl = document.querySelectorAll<HTMLDialogElement>('dialog');
  dialogEl.forEach((dialog) => {
    dialog.addEventListener('click', (event) => {
      const dialogEl = event.target as HTMLDialogElement;
      if (!(dialogEl instanceof HTMLDialogElement)) return;

      console.log('dialog click');

      // Check if click was directly on the dialog element (backdrop)
      const rect = dialogEl.getBoundingClientRect();
      const clickedInDialog =
        rect.top <= event.clientY &&
        event.clientY <= rect.top + rect.height &&
        rect.left <= event.clientX &&
        event.clientX <= rect.left + rect.width;

      if (clickedInDialog && event.target === dialogEl) {
        console.log('clicked in dialog; Closing dialog');
        dialogEl.close();
      }
    });
  });
}
