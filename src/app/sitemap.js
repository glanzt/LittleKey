const SITE_URL = "https://www.littlekey.live";

export default function sitemap() {
  var now = new Date();
  return [
    { url: SITE_URL, lastModified: now, changeFrequency: "weekly", priority: 1 },
    { url: SITE_URL + "/play", lastModified: now, changeFrequency: "weekly", priority: 0.8 },
  ];
}
