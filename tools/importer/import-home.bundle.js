/* eslint-disable */
var CustomImportScript = (() => {
  var __defProp = Object.defineProperty;
  var __defProps = Object.defineProperties;
  var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
  var __getOwnPropDescs = Object.getOwnPropertyDescriptors;
  var __getOwnPropNames = Object.getOwnPropertyNames;
  var __getOwnPropSymbols = Object.getOwnPropertySymbols;
  var __hasOwnProp = Object.prototype.hasOwnProperty;
  var __propIsEnum = Object.prototype.propertyIsEnumerable;
  var __defNormalProp = (obj, key, value) => key in obj ? __defProp(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
  var __spreadValues = (a, b) => {
    for (var prop in b || (b = {}))
      if (__hasOwnProp.call(b, prop))
        __defNormalProp(a, prop, b[prop]);
    if (__getOwnPropSymbols)
      for (var prop of __getOwnPropSymbols(b)) {
        if (__propIsEnum.call(b, prop))
          __defNormalProp(a, prop, b[prop]);
      }
    return a;
  };
  var __spreadProps = (a, b) => __defProps(a, __getOwnPropDescs(b));
  var __export = (target, all) => {
    for (var name in all)
      __defProp(target, name, { get: all[name], enumerable: true });
  };
  var __copyProps = (to, from, except, desc) => {
    if (from && typeof from === "object" || typeof from === "function") {
      for (let key of __getOwnPropNames(from))
        if (!__hasOwnProp.call(to, key) && key !== except)
          __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
    }
    return to;
  };
  var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

  // tools/importer/import-home.js
  var import_home_exports = {};
  __export(import_home_exports, {
    default: () => import_home_default
  });

  // tools/importer/parsers/hero-tropical.js
  function parse(element, { document: document2 }) {
    const bgImage = element.querySelector(
      'img#banner-desktop, img[id*="banner"], img[class*="banner"], :scope > img, img'
    );
    const heading = element.querySelector(
      'h1, h2, [class*="text-banner-h1"], [class*="title"], [class*="heading"]'
    );
    const subheading = element.querySelector(
      'p, [class*="subtitle"], [class*="subheading"]'
    );
    const ctaLinks = Array.from(
      element.querySelectorAll('a[class*="button-banner"], a.button, a[class*="cta"], .text-banner1 a')
    );
    if (!heading && !subheading && ctaLinks.length === 0 && !bgImage) {
      element.replaceWith(...element.childNodes);
      return;
    }
    const cells = [];
    if (bgImage) {
      cells.push([bgImage]);
    }
    const contentCell = [];
    if (heading) contentCell.push(heading);
    if (subheading) contentCell.push(subheading);
    contentCell.push(...ctaLinks);
    if (contentCell.length) {
      cells.push([contentCell]);
    }
    const block = WebImporter.Blocks.createBlock(document2, { name: "hero-tropical", cells });
    element.replaceWith(block);
  }

  // tools/importer/parsers/cards-promo.js
  function parse2(element, { document: document2 }) {
    let cardEls = Array.from(element.querySelectorAll(":scope > .banner-wrapper3"));
    if (cardEls.length === 0) cardEls = Array.from(element.querySelectorAll(".banner-wrapper3"));
    if (cardEls.length === 0) cardEls = [element];
    const cells = [];
    cardEls.forEach((card) => {
      const image = card.querySelector(
        'img[id*="banner-desktop3"]:not([id*="mobile"]), img[id*="banner-desktop"]:not([id*="mobile"]), img'
      );
      const heading = card.querySelector(
        'h1, h2, h3, [class*="text-banner-h3"], [class*="title"], [class*="heading"]'
      );
      const description = card.querySelector(
        'p, [class*="text-p"], [class*="description"]'
      );
      const ctaLinks = Array.from(
        card.querySelectorAll('a[class*="button-banner"], a.button, a[class*="cta"], .text-banner3 a')
      );
      const textCell = [];
      if (heading) textCell.push(heading);
      if (description) textCell.push(description);
      textCell.push(...ctaLinks);
      if (!image && textCell.length === 0) return;
      cells.push([image || "", textCell.length ? textCell : ""]);
    });
    if (cells.length === 0) {
      element.replaceWith(...element.childNodes);
      return;
    }
    const block = WebImporter.Blocks.createBlock(document2, { name: "cards-promo", cells });
    element.replaceWith(block);
  }

  // tools/importer/parsers/carousel-product.js
  function parse3(element, { document: document2 }) {
    let slideEls = Array.from(element.querySelectorAll("#product-carousel > li, ul > li"));
    if (slideEls.length === 0) slideEls = Array.from(element.querySelectorAll("li"));
    const cells = [];
    slideEls.forEach((slide) => {
      const image = slide.querySelector("img");
      if (!image) return;
      const sourceLink = slide.querySelector("a[href]");
      const imageCell = sourceLink || image;
      cells.push([imageCell, ""]);
    });
    if (cells.length === 0) {
      element.replaceWith(...element.childNodes);
      return;
    }
    const block = WebImporter.Blocks.createBlock(document2, { name: "carousel-product", cells });
    element.replaceWith(block);
  }

  // tools/importer/parsers/table-nutrition.js
  function parse4(element, { document: document2 }) {
    const table = element.matches("table") ? element : element.querySelector("table");
    if (!table) {
      element.replaceWith(...element.childNodes);
      return;
    }
    const rows = Array.from(table.querySelectorAll("tr"));
    if (rows.length === 0) {
      element.replaceWith(...element.childNodes);
      return;
    }
    const columnCount = rows.reduce(
      (max, tr) => Math.max(max, tr.querySelectorAll("th, td").length),
      0
    );
    const cells = [];
    rows.forEach((tr) => {
      const rowCells = Array.from(tr.querySelectorAll("th, td")).map((cell) => {
        const content = Array.from(cell.childNodes);
        return content.length ? content : cell.textContent.trim() || "";
      });
      while (rowCells.length < columnCount) rowCells.push("");
      cells.push(rowCells);
    });
    const block = WebImporter.Blocks.createBlock(document2, { name: "table-nutrition", cells });
    element.replaceWith(block);
  }

  // tools/importer/transformers/7up-cleanup.js
  var TransformHook = { beforeTransform: "beforeTransform", afterTransform: "afterTransform" };
  function transform(hookName, element, payload) {
    if (hookName === TransformHook.beforeTransform) {
      WebImporter.DOMUtils.remove(element, [
        "#privacy_modal",
        "#tos_modal",
        "#reviews-modal",
        "#smart-cart",
        "#fb-root"
      ]);
    }
    if (hookName === TransformHook.afterTransform) {
      WebImporter.DOMUtils.remove(element, [
        "header#header",
        "section#recipes.home-recipes",
        "section#enjoy-7up",
        "footer#footer",
        "iframe"
      ]);
    }
  }

  // tools/importer/transformers/7up-sections.js
  var SECTION_MARKER_ATTR = "data-excat-section-id";
  function transform2(hookName, element, payload) {
    const sections = payload.template && payload.template.sections || [];
    if (hookName === "beforeTransform") {
      for (let i = sections.length - 1; i >= 0; i -= 1) {
        const section = sections[i];
        if (i === 0 && !section.style) continue;
        const sectionEl = element.querySelector(section.selector);
        if (!sectionEl) continue;
        const hr = document.createElement("hr");
        if (section.style) hr.setAttribute(SECTION_MARKER_ATTR, section.id);
        sectionEl.before(hr);
      }
    }
    if (hookName === "afterTransform") {
      for (let i = sections.length - 1; i >= 0; i -= 1) {
        const section = sections[i];
        if (!section.style) continue;
        const marker = element.querySelector(`[${SECTION_MARKER_ATTR}="${section.id}"]`);
        const anchor = marker || element.querySelector(section.selector);
        if (!anchor) continue;
        const metadataBlock = WebImporter.Blocks.createBlock(document, {
          name: "Section Metadata",
          cells: { style: section.style }
        });
        anchor.after(metadataBlock);
        if (marker) {
          marker.removeAttribute(SECTION_MARKER_ATTR);
          if (i === 0) marker.remove();
        }
      }
    }
  }

  // tools/importer/import-home.js
  var parsers = {
    "hero-tropical": parse,
    "cards-promo": parse2,
    "carousel-product": parse3,
    "table-nutrition": parse4
  };
  var PAGE_TEMPLATE = {
    name: "home",
    description: "7UP homepage: tropical hero banner, two promo tiles, product intro, 6-product carousel selector, and per-product nutrition facts.",
    urls: [
      "https://www.7up.com/en"
    ],
    blocks: [
      {
        name: "hero-tropical",
        instances: ["#simple-7up-banner-new > div.banner-wrapper1"]
      },
      {
        name: "cards-promo",
        instances: ["#simple-7up-banner-new > div.banner-wrapper3"]
      },
      {
        name: "carousel-product",
        instances: ["#product-carousel-container"]
      },
      {
        name: "table-nutrition",
        instances: ["#products > div.product table"]
      }
    ],
    sections: [
      {
        id: "simple-7up-banner-new",
        name: "Hero + Promo Tiles",
        selector: "#simple-7up-banner-new",
        style: null,
        blocks: ["hero-tropical", "cards-promo"],
        defaultContent: []
      },
      {
        id: "products",
        name: "Products",
        selector: "#products",
        style: "light",
        blocks: ["carousel-product", "table-nutrition"],
        defaultContent: [
          "#products > header.container",
          "#products > div.product h1",
          "#products > div.product h2"
        ]
      }
    ]
  };
  var transformers = [
    transform,
    ...PAGE_TEMPLATE.sections && PAGE_TEMPLATE.sections.length > 1 ? [transform2] : []
  ];
  function executeTransformers(hookName, element, payload) {
    const enhancedPayload = __spreadProps(__spreadValues({}, payload), {
      template: PAGE_TEMPLATE
    });
    transformers.forEach((transformerFn) => {
      try {
        transformerFn.call(null, hookName, element, enhancedPayload);
      } catch (e) {
        console.error(`Transformer failed at ${hookName}:`, e);
      }
    });
  }
  function findBlocksOnPage(document2, template) {
    const pageBlocks = [];
    template.blocks.forEach((blockDef) => {
      blockDef.instances.forEach((selector) => {
        const elements = document2.querySelectorAll(selector);
        if (elements.length === 0) {
          console.warn(`Block "${blockDef.name}" selector not found: ${selector}`);
        }
        elements.forEach((element) => {
          pageBlocks.push({
            name: blockDef.name,
            selector,
            element,
            section: blockDef.section || null
          });
        });
      });
    });
    console.log(`Found ${pageBlocks.length} block instances on page`);
    return pageBlocks;
  }
  var import_home_default = {
    transform: (payload) => {
      const {
        document: document2,
        url,
        html,
        params
      } = payload;
      const main = document2.body;
      executeTransformers("beforeTransform", main, payload);
      const pageBlocks = findBlocksOnPage(document2, PAGE_TEMPLATE);
      pageBlocks.forEach((block) => {
        if (!block.element.parentNode) return;
        const parser = parsers[block.name];
        if (parser) {
          try {
            parser(block.element, { document: document2, url, params });
          } catch (e) {
            console.error(`Failed to parse ${block.name} (${block.selector}):`, e);
          }
        } else {
          console.warn(`No parser found for block: ${block.name}`);
        }
      });
      executeTransformers("afterTransform", main, payload);
      const hr = document2.createElement("hr");
      main.appendChild(hr);
      WebImporter.rules.createMetadata(main, document2);
      WebImporter.rules.transformBackgroundImages(main, document2);
      WebImporter.rules.adjustImageUrls(main, url, params.originalURL);
      const rawPath = new URL(params.originalURL).pathname.replace(/\/$/, "").replace(/\.html?$/, "");
      const path = WebImporter.FileUtils.sanitizePath(rawPath === "" ? "/index" : rawPath);
      return [{
        element: main,
        path,
        report: {
          title: document2.title,
          template: PAGE_TEMPLATE.name,
          blocks: pageBlocks.map((b) => b.name)
        }
      }];
    }
  };
  return __toCommonJS(import_home_exports);
})();
