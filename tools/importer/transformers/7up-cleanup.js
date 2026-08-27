/* eslint-disable */
/* global WebImporter */

/**
 * Transformer: 7up site-wide cleanup.
 * Removes non-authorable site chrome (header/nav, footer, modals, widgets,
 * tracking iframes) so the import contains only page-level authorable content.
 * All selectors verified against migration-work/cleaned.html.
 */
const TransformHook = { beforeTransform: 'beforeTransform', afterTransform: 'afterTransform' };

export default function transform(hookName, element, payload) {
  if (hookName === TransformHook.beforeTransform) {
    // Overlays / modals / widgets that could interfere with block parsing.
    // Found in cleaned.html: #privacy_modal, #tos_modal, #reviews-modal (lines 688-728),
    // #smart-cart (line 729), #fb-root Facebook SDK (lines 5-10).
    WebImporter.DOMUtils.remove(element, [
      '#privacy_modal',
      '#tos_modal',
      '#reviews-modal',
      '#smart-cart',
      '#fb-root',
    ]);
  }

  if (hookName === TransformHook.afterTransform) {
    // Non-authorable site chrome.
    // Found in cleaned.html: header#header + nav#nav-baar (lines 11-72),
    // empty section.home-recipes#recipes (line 74),
    // section#enjoy-7up wrapping footer#footer (lines 590-686),
    // tracking iframes (lines 731-736).
    WebImporter.DOMUtils.remove(element, [
      'header#header',
      'section#recipes.home-recipes',
      'section#enjoy-7up',
      'footer#footer',
      'iframe',
    ]);
  }
}
