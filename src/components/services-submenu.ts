export function placeServicesSubmenu() {
  const DROPDOWN_LIST_SELECTOR = '[data-el="services-dropdown-list"]';
  const ITEM_SELECTOR = '[data-el="services-menu-item"]';
  const LINK_SELECTOR = '[data-el="services-menu-link"]';
  const SUBMENU_WRAPPER_SELECTOR = '[data-el="services-submenu-wrapper"]';
  const LINK_TYPE_ATTR = 'data-services-menu-type';
  const LINK_PARENT_ATTR = 'data-services-menu-parent';
  const LINK_ITEM_NAME_ATTR = 'data-services-menu-item-name';

  const dropdownListEl = document.querySelector<HTMLElement>(DROPDOWN_LIST_SELECTOR);
  if (!dropdownListEl) {
    return;
  }

  document.querySelectorAll(ITEM_SELECTOR).forEach((itemEl) => {
    const linkEl = itemEl.querySelector(LINK_SELECTOR);
    if (!linkEl) {
      return;
    }

    const linkType = linkEl.getAttribute(LINK_TYPE_ATTR);
    const linkParent = linkEl.getAttribute(LINK_PARENT_ATTR);

    if (linkType !== 'Subpage') {
      return;
    }

    const destinationParentWrapper = dropdownListEl.querySelector(
      `[${LINK_ITEM_NAME_ATTR}="${linkParent}"]`
    );
    if (!destinationParentWrapper) {
      console.error('No destination parent wrapper found for', linkEl);
      return;
    }

    const destinationSubmenuWrapper =
      destinationParentWrapper.querySelector(SUBMENU_WRAPPER_SELECTOR);
    if (!destinationSubmenuWrapper) {
      console.error('No destination submenu wrapper found for', linkEl);
      return;
    }

    destinationSubmenuWrapper.appendChild(linkEl);
    itemEl.remove();
  });
}
