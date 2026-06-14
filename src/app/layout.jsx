import AuthSessionProvider from "@/components/session-provider";
import { auth } from "@/lib/auth";
import packageJson from "../../package.json";

const SITE_URL = "https://www.littlekey.live";

export const metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "ציידת האותיות — משחק לימוד אלף־בית ורגשות לילדים",
    template: "%s · ציידת האותיות",
  },
  description:
    "משחק חינמי בעברית ללימוד האלף־בית: זיהוי אותיות, רגשות, ספירה, צורות וצביעה — לגיל הרך. עם מעקב התקדמות, משחקי זיכרון והקראה קולית.",
  applicationName: "ציידת האותיות",
  keywords: [
    "אלף בית", "לימוד אותיות", "ללמוד לקרוא", "משחקים לילדים", "משחק חינוכי",
    "עברית לילדים", "גן חובה", "גיל הרך", "רגשות", "ציידת האותיות", "LittleKey",
  ],
  authors: [{ name: "LittleKey" }],
  alternates: { canonical: SITE_URL },
  openGraph: {
    type: "website",
    locale: "he_IL",
    url: SITE_URL,
    siteName: "ציידת האותיות",
    title: "ציידת האותיות — משחק לימוד אלף־בית ורגשות לילדים",
    description:
      "משחק חינמי בעברית ללימוד האלף־בית, רגשות, ספירה וצורות לגיל הרך.",
  },
  twitter: {
    card: "summary_large_image",
    title: "ציידת האותיות — משחק לימוד אלף־בית לילדים",
    description:
      "משחק חינמי בעברית ללימוד האלף־בית, רגשות, ספירה וצורות לגיל הרך.",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, "max-image-preview": "large" },
  },
};

export const viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#8ECDF6",
};

export default async function RootLayout({ children }) {
  var commitSha = process.env.VERCEL_GIT_COMMIT_SHA || "";
  var shortSha = commitSha ? commitSha.slice(0, 7) : "";
  var appVersion = "v" + packageJson.version + (shortSha ? " \u00b7 " + shortSha : "");
  var session = await auth();

  return (
    <html lang="he" dir="rtl">
      <head>
        <link
          href="https://fonts.googleapis.com/css2?family=Secular+One&family=Rubik:wght@400;600;700&family=Suez+One&display=swap"
          rel="stylesheet"
        />
      </head>
      <body style={{ margin: 0, padding: 0, boxSizing: "border-box", overflowX: "hidden" }}>
        <div style={{
          position: "fixed",
          top: "calc(env(safe-area-inset-top, 0px) + 0.28rem)",
          left: "0.45rem",
          zIndex: 1,
          pointerEvents: "none",
          fontFamily: "'Rubik', sans-serif",
          fontSize: "0.64rem",
          lineHeight: 1,
          color: "rgba(17,19,25,0.18)",
          padding: "0.08rem 0.18rem",
          textShadow: "0 1px 0 rgba(255,255,255,0.7)",
          mixBlendMode: "multiply",
        }}>
          {appVersion}
        </div>
        <AuthSessionProvider session={session}>{children}</AuthSessionProvider>
      </body>
    </html>
  );
}
