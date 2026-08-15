export const MAX_BADGE_VALUE = 99;

export function getBadgeMargin(value) {
  if (value > 99) {
    return -16;
  } else if (value > 10) {
    return -12;
  } else {
    return -8;
  }
}

/**
 * Rotas que devem ocultar a TabBar.
 * Adicione pathnames aqui conforme novas sub-rotas forem criadas em (private)/.
 */
export const pathnamesToHideTabs = ["/home/dependent/[dependentId]"];

/**
 * Verifica se um pathname deve esconder as tabs, incluindo rotas dinâmicas
 * @param {string} pathname - O pathname atual
 * @returns {boolean} - Se deve esconder as tabs
 */
export function shouldHideTabsForPath(pathname) {
  return pathnamesToHideTabs.some((pattern) => {
    if (!pattern.includes("[") || !pattern.includes("]")) {
      return pathname === pattern;
    }

    const regexPattern = pattern.replace(/\[[^\]]+\]/g, "[^/]+");
    const regex = new RegExp(`^${regexPattern}$`);
    return regex.test(pathname);
  });
}
