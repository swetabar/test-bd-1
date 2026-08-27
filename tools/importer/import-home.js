/* eslint-disable */
/* global WebImporter */

// PARSER IMPORTS
import heroTropicalParser from './parsers/hero-tropical.js';
import cardsPromoParser from './parsers/cards-promo.js';
import carouselProductParser from './parsers/carousel-product.js';
import tableNutritionParser from './parsers/table-nutrition.js';

// TRANSFORMER IMPORTS
import cleanupTransformer from './transformers/7up-cleanup.js';
import sectionsTransformer from './transformers/7up-sections.js';

// PARSER REGISTRY
const parsers = {
  'hero-tropical': heroTropicalParser,
  'cards-promo': cardsPromoParser,
  'carousel-product': carouselProductParser,
  'table-nutrition': tableNutritionParser,
};

// PAGE TEMPLATE CONFIGURATION - Embedded from page-templates.json
const PAGE_TEMPLATE = {
  name: 'home',
  description: '7UP homepage: tropical hero banner, two promo tiles, product intro, 6-product carousel selector, and per-product nutrition facts.',
  urls: [
    'https://www.7up.com/en',
  ],
  blocks: [
    {
      name: 'hero-tropical',
      instances: ['#simple-7up-banner-new > div.banner-wrapper1'],
    },
    {
      name: 'cards-promo',
      instances: ['#simple-7up-banner-new > div.banner-wrapper3'],
    },
    {
      name: 'carousel-product',
      instances: ['#product-carousel-container'],
    },
    {
      name: 'table-nutrition',
      instances: ['#products > div.product table'],
    },
  ],
  sections: [
    {
      id: 'simple-7up-banner-new',
      name: 'Hero + Promo Tiles',
      selector: '#simple-7up-banner-new',
      style: null,
      blocks: ['hero-tropical', 'cards-promo'],
      defaultContent: [],
    },
    {
      id: 'products',
      name: 'Products',
      selector: '#products',
      style: 'light',
      blocks: ['carousel-product', 'table-nutrition'],
      defaultContent: [
        '#products > header.container',
        '#products > div.product h1',
        '#products > div.product h2',
      ],
    },
  ],
};

// TRANSFORMER REGISTRY
const transformers = [
  cleanupTransformer,
  ...(PAGE_TEMPLATE.sections && PAGE_TEMPLATE.sections.length > 1 ? [sectionsTransformer] : []),
];

/**
 * Execute all page transformers for a specific hook
 * @param {string} hookName - The hook name ('beforeTransform' or 'afterTransform')
 * @param {Element} element - The DOM element to transform
 * @param {Object} payload - The payload containing { document, url, html, params }
 */
function executeTransformers(hookName, element, payload) {
  const enhancedPayload = {
    ...payload,
    template: PAGE_TEMPLATE,
  };

  transformers.forEach((transformerFn) => {
    try {
      transformerFn.call(null, hookName, element, enhancedPayload);
    } catch (e) {
      console.error(`Transformer failed at ${hookName}:`, e);
    }
  });
}

/**
 * Find all blocks on the page based on the embedded template configuration
 * @param {Document} document - The DOM document
 * @param {Object} template - The embedded PAGE_TEMPLATE object
 * @returns {Array} Array of block instances found on the page
 */
function findBlocksOnPage(document, template) {
  const pageBlocks = [];

  template.blocks.forEach((blockDef) => {
    blockDef.instances.forEach((selector) => {
      const elements = document.querySelectorAll(selector);
      if (elements.length === 0) {
        console.warn(`Block "${blockDef.name}" selector not found: ${selector}`);
      }
      elements.forEach((element) => {
        pageBlocks.push({
          name: blockDef.name,
          selector,
          element,
          section: blockDef.section || null,
        });
      });
    });
  });

  console.log(`Found ${pageBlocks.length} block instances on page`);
  return pageBlocks;
}

// EXPORT DEFAULT CONFIGURATION
export default {
  transform: (payload) => {
    const {
      document, url, html, params,
    } = payload;

    const main = document.body;

    // 1. Execute beforeTransform transformers (initial cleanup)
    executeTransformers('beforeTransform', main, payload);

    // 2. Find blocks on page using embedded template
    const pageBlocks = findBlocksOnPage(document, PAGE_TEMPLATE);

    // 3. Parse each block using registered parsers
    pageBlocks.forEach((block) => {
      if (!block.element.parentNode) return; // Already replaced by earlier parser
      const parser = parsers[block.name];
      if (parser) {
        try {
          parser(block.element, { document, url, params });
        } catch (e) {
          console.error(`Failed to parse ${block.name} (${block.selector}):`, e);
        }
      } else {
        console.warn(`No parser found for block: ${block.name}`);
      }
    });

    // 4. Execute afterTransform transformers (final cleanup + section breaks/metadata)
    executeTransformers('afterTransform', main, payload);

    // 5. Apply WebImporter built-in rules
    const hr = document.createElement('hr');
    main.appendChild(hr);
    WebImporter.rules.createMetadata(main, document);
    WebImporter.rules.transformBackgroundImages(main, document);
    WebImporter.rules.adjustImageUrls(main, url, params.originalURL);

    // 6. Generate sanitized path (map root URL to /index)
    const rawPath = new URL(params.originalURL).pathname
      .replace(/\/$/, '')
      .replace(/\.html?$/, '');
    const path = WebImporter.FileUtils.sanitizePath(rawPath === '' ? '/index' : rawPath);

    return [{
      element: main,
      path,
      report: {
        title: document.title,
        template: PAGE_TEMPLATE.name,
        blocks: pageBlocks.map((b) => b.name),
      },
    }];
  },
};
