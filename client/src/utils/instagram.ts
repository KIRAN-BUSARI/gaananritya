/**
 * Extracts a normalized Instagram post/reel permalink from a URL or embed HTML.
 */
export function parseInstagramUrl(input: string): string | null {
  if (!input?.trim()) return null;

  const value = input.trim();

  const permalinkMatch = value.match(
    /data-instgrm-permalink=["']([^"']+)["']/i,
  );
  if (permalinkMatch?.[1]) {
    const permalink = permalinkMatch[1].split('?')[0];
    if (/instagram\.com\/(?:p|reel|tv)\//i.test(permalink)) {
      return permalink.endsWith('/') ? permalink : `${permalink}/`;
    }
  }

  const hrefMatch = value.match(
    /href=["'](https?:\/\/(?:www\.)?instagram\.com\/(?:p|reel|tv)\/[^"'?]+)/i,
  );
  if (hrefMatch?.[1]) {
    const href = hrefMatch[1].split('?')[0];
    return href.endsWith('/') ? href : `${href}/`;
  }

  const urlMatch = value.match(
    /https?:\/\/(?:www\.)?instagram\.com\/(?:p|reel|tv)\/([A-Za-z0-9_-]+)/i,
  );
  if (urlMatch) {
    const base = urlMatch[0].split('?')[0];
    return base.endsWith('/') ? base : `${base}/`;
  }

  return null;
}
