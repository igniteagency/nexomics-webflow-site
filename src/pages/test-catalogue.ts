interface FilterItem {
  filterID: string;
  filtersDataIndex: number;
  elSelector: string;
  templateEl: HTMLElement | null;
  textEl: HTMLElement | null;
  deleteEl: HTMLElement | null;
}

/**
 * Custom finsweet CMS filter reactivity on the filter tag templates
 * Use `data-el` attribute with values `{{type}}-tag-template`, `{{type}}-tag-text`, `{{type}}-tag-remove` to target the respective elements
 */
window.fsAttributes = window.fsAttributes || [];
window.fsAttributes.push([
  'cmsfilter',
  (filterInstances) => {
    console.log('cmsfilter Successfully loaded!');

    const [filterInstance] = filterInstances;

    const filters: Record<string, FilterItem> = {
      categories: {
        filterID: 'categories',
        filtersDataIndex: 1,
        elSelector: 'categories',
        templateEl: null,
        textEl: null,
        deleteEl: null,
      },
      methodologies: {
        filterID: 'methodologies',
        filtersDataIndex: 2,
        elSelector: 'methodologies',
        templateEl: null,
        textEl: null,
        deleteEl: null,
      },
      search: {
        filterID: '*',
        filtersDataIndex: 0,
        elSelector: 'search',
        templateEl: null,
        textEl: null,
        deleteEl: null,
      },
    };

    Object.entries(filters).forEach(([type, filter]) => {
      filter.templateEl = document.querySelector(`[data-el="${filter.elSelector}-tag-template"]`);
      filter.textEl = document.querySelector(`[data-el="${filter.elSelector}-tag-text"]`);
      filter.deleteEl = document.querySelector(`[data-el="${filter.elSelector}-tag-remove"]`);

      if (!filter.templateEl || !filter.textEl || !filter.deleteEl) {
        console.warn(
          `template / text / delete element not detected in DOM for ${filter.filterID}. Dynamic filter tags won't show`
        );
        return;
      }

      filter.deleteEl.addEventListener('click', () => {
        filterInstance.resetFilters([filter.filterID]);
      });
    });

    // initial render
    toggleFilterTags();

    filterInstance.listInstance.on('renderitems', (renderedItems) => {
      toggleFilterTags();
    });

    function toggleFilterTags() {
      Object.entries(filters).forEach(([type, filter]) => {
        filter.templateEl?.classList.add('hide');
        const filterValuesSet = filterInstance.filtersData[filter.filtersDataIndex].values;
        if (filterValuesSet.size) {
          filter.templateEl?.classList.remove('hide');
          filter.textEl.textContent = filterValuesSet.values().next().value;
        }
      });
    }
  },
]);
