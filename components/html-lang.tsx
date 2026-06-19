"use client";

import { useEffect } from "react";

// Syncs `<html lang>` with the active locale on the client. The root layout
// renders the default locale into the server HTML (it can't read the `[locale]`
// segment without forcing dynamic rendering), so this corrects the attribute
// after hydration and on every locale switch. `lang` is a non-visual attribute,
// so updating it post-hydration causes no flash.
export function HtmlLang({ locale }: { locale: string }) {
  useEffect(() => {
    document.documentElement.lang = locale;
  }, [locale]);

  return null;
}
