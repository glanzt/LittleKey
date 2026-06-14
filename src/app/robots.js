const SITE_URL = "https://www.littlekey.live";

export default function robots() {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      // No value in indexing JSON endpoints or the auth screens.
      disallow: ["/api/", "/auth/"],
    },
    sitemap: SITE_URL + "/sitemap.xml",
    host: SITE_URL,
  };
}
