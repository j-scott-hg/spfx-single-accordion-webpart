/**
 * Lightweight allowlist-based HTML sanitiser.
 *
 * SPFx bundles run in a trusted intranet context, but authors can paste
 * arbitrary HTML into the property pane textarea. This utility strips tags
 * and attributes that are not in the allowlist before we pass the string to
 * dangerouslySetInnerHTML.
 *
 * We intentionally avoid importing a heavy library like DOMPurify because:
 *  - this component targets simple rich text (paragraphs, lists, bold/italic)
 *  - bundle size matters in SharePoint pages
 *  - DOMPurify would need to be loaded as a separate bundle in SPFx
 *
 * If you later need to support more complex HTML (tables, iframes, etc.)
 * consider adding @microsoft/sp-sanitize or DOMPurify via a CDN loader.
 */

const ALLOWED_TAGS = new Set([
  'p', 'br', 'b', 'strong', 'i', 'em', 'u', 's', 'del',
  'ul', 'ol', 'li',
  'h1', 'h2', 'h3', 'h4', 'h5', 'h6',
  'blockquote', 'pre', 'code',
  'a', 'span', 'div',
  'hr',
  'table', 'thead', 'tbody', 'tr', 'th', 'td',
]);

const ALLOWED_ATTRS: Record<string, Set<string>> = {
  a: new Set(['href', 'target', 'rel', 'title']),
  span: new Set(['style', 'class']),
  div: new Set(['style', 'class']),
  td: new Set(['colspan', 'rowspan', 'style']),
  th: new Set(['colspan', 'rowspan', 'style']),
  p: new Set(['style']),
};

/**
 * Parse an HTML string, walk the DOM, and return only allowed content.
 * Falls back gracefully if DOMParser is unavailable (SSR / test environments).
 */
export function sanitizeHtml(input: string): string {
  if (!input || typeof input !== 'string') return '';

  // Guard: non-browser environments (e.g. jest without jsdom configured)
  if (typeof document === 'undefined') return input;

  try {
    const parser = new DOMParser();
    const doc = parser.parseFromString(input, 'text/html');
    return sanitizeNode(doc.body);
  } catch {
    // If parsing fails, return empty string rather than potentially unsafe HTML
    return '';
  }
}

function sanitizeNode(node: Node): string {
  let result = '';

  node.childNodes.forEach((child) => {
    if (child.nodeType === Node.TEXT_NODE) {
      result += escapeText(child.textContent || '');
      return;
    }

    if (child.nodeType !== Node.ELEMENT_NODE) return;

    const el = child as Element;
    const tagName = el.tagName.toLowerCase();

    if (!ALLOWED_TAGS.has(tagName)) {
      // Still recurse into the element so text content is preserved
      result += sanitizeNode(el);
      return;
    }

    const allowedAttrs = ALLOWED_ATTRS[tagName];
    let attrString = '';

    if (allowedAttrs) {
      allowedAttrs.forEach((attrName) => {
        const val = el.getAttribute(attrName);
        if (val !== null) {
          // For href, only allow http/https/mailto — block javascript:
          if (attrName === 'href' && /^\s*javascript:/i.test(val)) return;
          attrString += ` ${attrName}="${escapeAttr(val)}"`;
        }
      });
    }

    // Self-closing tags
    if (tagName === 'br' || tagName === 'hr') {
      result += `<${tagName}${attrString}>`;
      return;
    }

    result += `<${tagName}${attrString}>${sanitizeNode(el)}</${tagName}>`;
  });

  return result;
}

function escapeText(text: string): string {
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');
}

function escapeAttr(val: string): string {
  return val
    .replace(/&/g, '&amp;')
    .replace(/"/g, '&quot;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');
}
