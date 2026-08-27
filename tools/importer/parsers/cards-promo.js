/* eslint-disable */
/* global WebImporter */
/**
 * Parser for cards-promo. Base: cards.
 * Source: https://www.7up.com/en
 * Generated: 2026-08-27
 *
 * Block library (cards): 2 columns, multiple rows.
 *   Row 1: block name.
 *   Each subsequent row = one card:
 *     Cell 1: Image or Icon (mandatory).
 *     Cell 2: Text content — Title (heading), Description, Call-to-Action.
 *
 * Source structure: one or more <div class="banner-wrapper3"> promo tiles,
 * each with desktop/mobile <img> plus a <div class="text-banner3"> containing
 * an <h1 class="text-banner-h3"> title, <p class="text-p"> description, and an
 * <a class="button-banner3"> CTA. The mapping selector matches each tile
 * individually, so parse handles a single tile per call but also supports a
 * container holding multiple tiles.
 */
export default function parse(element, { document }) {
  // Resolve the set of card source elements defensively.
  let cardEls = Array.from(element.querySelectorAll(':scope > .banner-wrapper3'));
  if (cardEls.length === 0) cardEls = Array.from(element.querySelectorAll('.banner-wrapper3'));
  if (cardEls.length === 0) cardEls = [element];

  const cells = [];

  cardEls.forEach((card) => {
    // Image cell: prefer the desktop banner image; fall back to any image.
    const image = card.querySelector(
      'img[id*="banner-desktop3"]:not([id*="mobile"]), img[id*="banner-desktop"]:not([id*="mobile"]), img',
    );

    // Text cell contents.
    const heading = card.querySelector(
      'h1, h2, h3, [class*="text-banner-h3"], [class*="title"], [class*="heading"]',
    );
    const description = card.querySelector(
      'p, [class*="text-p"], [class*="description"]',
    );
    const ctaLinks = Array.from(
      card.querySelectorAll('a[class*="button-banner"], a.button, a[class*="cta"], .text-banner3 a'),
    );

    const textCell = [];
    if (heading) textCell.push(heading);
    if (description) textCell.push(description);
    textCell.push(...ctaLinks);

    // Skip empty cards.
    if (!image && textCell.length === 0) return;

    cells.push([image || '', textCell.length ? textCell : '']);
  });

  // Empty-block guard.
  if (cells.length === 0) {
    element.replaceWith(...element.childNodes);
    return;
  }

  const block = WebImporter.Blocks.createBlock(document, { name: 'cards-promo', cells });
  element.replaceWith(block);
}
