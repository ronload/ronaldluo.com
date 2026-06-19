import { Geist, Geist_Mono, Noto_Sans_TC } from "next/font/google";
import { ThemeProvider } from "@/components/theme-provider";
import { routing } from "@/i18n/routing";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

// Traditional Chinese web font. `preload: false` keeps the large CJK file off
// the critical path; the `--font-cjk-system` fallback in globals.css renders
// Chinese until it finishes loading.
const notoSansTC = Noto_Sans_TC({
  variable: "--font-noto-sans-tc",
  subsets: ["latin"],
  weight: ["400", "500", "700"],
  preload: false,
});

type Props = {
  children: React.ReactNode;
};

// The `<html>`/`<body>` shell and theme layer live here, above the `[locale]`
// segment, so a locale switch never remounts them. That keeps next-themes'
// `.dark` class on `<html>` stable and prevents the light-palette flash.
// `lang` is rendered as the default locale (a static constant, so the shell
// stays statically rendered) and corrected to the active locale on the client
// by `HtmlLang`.
export default function RootLayout({ children }: Props) {
  return (
    <html
      lang={routing.defaultLocale}
      className={`${geistSans.variable} ${geistMono.variable} ${notoSansTC.variable} h-full antialiased`}
      suppressHydrationWarning
    >
      <body className="min-h-full flex flex-col">
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
