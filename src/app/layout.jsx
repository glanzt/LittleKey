import AuthSessionProvider from "@/components/session-provider";
import packageJson from "../../package.json";

export const metadata = {
  title: "ציידת האותיות",
  description: "בואי נלמד את האותיות!",
};

export const viewport = {
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({ children }) {
  var appVersion = "v" + packageJson.version;

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
          top: "0.75rem",
          left: "0.9rem",
          zIndex: 1200,
          pointerEvents: "none",
          fontFamily: "'Rubik', sans-serif",
          fontSize: "0.78rem",
          color: "rgba(17,19,25,0.32)",
          background: "rgba(255,255,255,0.22)",
          border: "1px solid rgba(17,19,25,0.05)",
          borderRadius: 999,
          padding: "0.18rem 0.55rem",
          backdropFilter: "blur(6px)",
          WebkitBackdropFilter: "blur(6px)",
        }}>
          {appVersion}
        </div>
        <AuthSessionProvider>{children}</AuthSessionProvider>
      </body>
    </html>
  );
}
