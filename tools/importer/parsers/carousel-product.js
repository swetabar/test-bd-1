/* eslint-disable */
/* global WebImporter */
/**
 * Parser for carousel-product. Base: carousel.
 * Source: https://www.7up.com/en
 * Generated: 2026-08-27
 *
 * Block library (carousel): 2 columns, multiple rows.
 *   Row 1: block name.
 *   Each subsequent row = one slide:
 *     Cell 1: Image (mandatory), no other content.
 *     Cell 2: Text content (optional) — Title, Description, Call-to-Action.
 *
 * Source structure: <ul id="product-carousel"> of <li class="item-N">, each
 * containing an <a href="#product-..."> that wraps an <img alt="...">. A
 * separate <div id="product-carousel-nav"> holds prev/next controls, which are
 * navigation chrome and are intentionally excluded from the content.
 */
export default function parse(element, { document }) {
  // Each <li> is one slide. Exclude the nav container by scoping to the list.
  let slideEls = Array.from(element.querySelectorAll('#product-carousel > li, ul > li'));
  if (slideEls.length === 0) slideEls = Array.from(element.querySelectorAll('li'));

  const cells = [];

  slideEls.forEach((slide) => {
    const image = slide.querySelector('img');
    if (!image) return;

    // Preserve the slide's original product link wrapping the image so the
    // href is retained. The source slides contain no visible text/CTA copy,
    // so the second (text) cell is left empty per the source content.
    const sourceLink = slide.querySelector('a[href]');
    const imageCell = sourceLink || image;

    cells.push([imageCell, '']);
  });

  // Empty-block guard.
  if (cells.length === 0) {
    element.replaceWith(...element.childNodes);
    return;
  }

  const block = WebImporter.Blocks.createBlock(document, { name: 'carousel-product', cells });
  element.replaceWith(block);
}
