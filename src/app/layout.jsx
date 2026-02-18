import AuthSessionProvider from "@/components/session-provider";

export const metadata = {
  title: "ציידת האותיות",
  description: "בואי נלמד את האותיות!",
};

export default function RootLayout({ children }) {
  return (
    <html lang="he" dir="rtl">
      <head>
        <link
          href="https://fonts.googleapis.com/css2?family=Secular+One&family=Rubik:wght@400;600;700&family=Suez+One&display=swap"
          rel="stylesheet"
        />
      </head>
      <body style={{ margin: 0, padding: 0, boxSizing: "border-box", overflowX: "hidden" }}>
        <AuthSessionProvider>{children}</AuthSessionProvider>
      </body>
    </html>
  );
}
