import AuthSessionProvider from "@/components/session-provider";
import { auth } from "@/lib/auth";
import packageJson from "../../package.json";

export const metadata = {
  title: "ציידת האותיות",
  description: "בואי נלמד את האותיות!",
};

export const viewport = {
  width: "device-width",
  initialScale: 1,
};

export default async function RootLayout({ children }) {
  var appVersion = "v" + packageJson.version;
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
