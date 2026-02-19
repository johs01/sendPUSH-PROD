import type { Metadata } from "next";
import "./globals.css";
import { defaultMetadata } from "@/lib/seo";

export const metadata: Metadata = defaultMetadata;

const themeBootstrapScript = `(() => {
  const key = "wf-theme-mode";
  const valid = new Set(["light", "dark"]);
  let mode = "light";

  try {
    const stored = window.localStorage.getItem(key);
    if (valid.has(stored)) {
      mode = stored;
    }
  } catch (_error) {
    mode = "light";
  }

  const root = document.documentElement;
  root.setAttribute("data-theme-mode", mode);
  root.setAttribute("data-theme", mode);
  root.style.colorScheme = mode;
})();`;

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" data-theme="light" data-theme-mode="light" suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeBootstrapScript }} />
      </head>
      <body className="wr-page wf-page">{children}</body>
    </html>
  );
}
