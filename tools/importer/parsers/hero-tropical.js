/* eslint-disable */
/* global WebImporter */
/**
 * Parser for hero-tropical. Base: hero.
 * Source: https://www.7up.com/en
 * Generated: 2026-08-27
 *
 * Block library (hero): 1 column, 3 rows.
 *   Row 1: block name.
 *   Row 2: Background Image (optional).
 *   Row 3: Title (heading), Subheading (optional), Call-to-Action (optional).
 *
 * Source structure: <div class="banner-wrapper1"> with an <img> background
 * banner, then a <div class="text-banner1"> holding an <h1> title and an
 * <a class="button-banner1"> CTA.
 */
export default function parse(element, { document }) {
  // Background image (row 2). Prefer the banner image; fall back to any img.
  const bgImage = element.querySelector(
    'img#banner-desktop, img[id*="banner"], img[class*="banner"], :scope > img, img',
  );

  // Title (heading) — validated against source <h1 class="text-banner-h1">.
  const heading = element.querySelector(
    'h1, h2, [class*="text-banner-h1"], [class*="title"], [class*="heading"]',
  );

  // Subheading — optional paragraph text (not present in current source).
  const subheading = element.querySelector(
    'p, [class*="subtitle"], [class*="subheading"]',
  );

  // Call-to-action links — validated against source <a class="button-banner1">.
  const ctaLinks = Array.from(
    element.querySelectorAll('a[class*="button-banner"], a.button, a[class*="cta"], .text-banner1 a'),
  );

  // Empty-block guard: bail if there is no meaningful content.
  if (!heading && !subheading && ctaLinks.length === 0 && !bgImage) {
    element.replaceWith(...element.childNodes);
    return;
  }

  const cells = [];

  // Row 2: background image (optional).
  if (bgImage) {
    cells.push([bgImage]);
  }

  // Row 3: title + subheading + CTA(s), all in the single hero cell.
  const contentCell = [];
  if (heading) contentCell.push(heading);
  if (subheading) contentCell.push(subheading);
  contentCell.push(...ctaLinks);
  if (contentCell.length) {
    cells.push([contentCell]);
  }

  const block = WebImporter.Blocks.createBlock(document, { name: 'hero-tropical', cells });
  element.replaceWith(block);
}
