/**
 * Dynamic background color theming on section scroll
 * Set `.background-color-primary` class on sections to target them
 */

export function initBgColorChange() {
  const SECTION_SELECTOR = '.background-color-primary';

  // Fetch the actual colour values from your CSS variables
  const textPrimaryColor = getVariableColorValue('text-primary');
  const backgroundDefaultColor = getVariableColorValue('background-secondary');
  const backgroundLightColor = getVariableColorValue('bg-switch-tertiary');
  const textAlternateColor = getVariableColorValue('text-alternate');
  const backgroundAlternateColor = getVariableColorValue('background-alternate');

  const setColoredTheme = (isDark: boolean) => {
    window.gsap.to(document.body, {
      duration: 0.5,
      backgroundColor: isDark ? backgroundAlternateColor : backgroundLightColor,
      color: isDark ? textAlternateColor : textPrimaryColor,
      overwrite: true,
    });
  };

  const setDefaultTheme = () => {
    window.gsap.to(document.body, {
      duration: 0.5,
      backgroundColor: backgroundDefaultColor,
      color: textPrimaryColor,
      overwrite: true,
    });
  };

  window.gsap.set(document.body, {
    backgroundColor: backgroundDefaultColor,
    color: textPrimaryColor,
  });

  const sectionList = document.querySelectorAll(SECTION_SELECTOR);
  sectionList.forEach((sectionEl, index) => {
    const isDarkTheme = sectionEl.matches('[data-theme="dark"]');

    const isPreviousSectionColored =
      sectionList[index - 1] && sectionEl.previousElementSibling === sectionList[index - 1];
    const isNextSectionColored =
      sectionList[index + 1] && sectionEl.nextElementSibling === sectionList[index + 1];

    window.ScrollTrigger.create({
      trigger: sectionEl,
      start: 'top 80%',
      end: isNextSectionColored ? 'bottom 80%' : 'bottom 20%',
      onEnter: () => setColoredTheme(isDarkTheme),
      onLeave: !isNextSectionColored ? setDefaultTheme : undefined,
      onEnterBack: () => setColoredTheme(isDarkTheme),
      onLeaveBack: !isPreviousSectionColored ? setDefaultTheme : undefined,
    });
  });
}

/**
 * Get the computed colour value of a CSS variable
 * @param varName - The name of the CSS variable without the Webflow variable folder prefix
 * @returns The computed colour value of the CSS variable
 */
function getVariableColorValue(varName: string) {
  return getComputedStyle(document.documentElement)
    .getPropertyValue(`--color--elements--${varName}`)
    .trim();
}
