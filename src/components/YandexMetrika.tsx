"use client";

import Script from "next/script";
import { useCookieConsent } from "@/context/CookieConsentContext";

const METRIKA_ID = 109166748;

const inlineMetrika = `
(function(m,e,t,r,i,k,a){
  m[i]=m[i]||function(){(m[i].a=m[i].a||[]).push(arguments)};
  m[i].l=1*new Date();
  for (var j = 0; j < document.scripts.length; j++) { if (document.scripts[j].src === r) { return; } }
  k=e.createElement(t),a=e.getElementsByTagName(t)[0],k.async=1,k.src=r,a.parentNode.insertBefore(k,a)
})(window, document, 'script', 'https://mc.yandex.ru/metrika/tag.js?id=${METRIKA_ID}', 'ym');
ym(${METRIKA_ID}, 'init', {
  ssr: true,
  webvisor: true,
  clickmap: true,
  accurateTrackBounce: true,
  trackLinks: true,
  referrer: document.referrer,
  url: location.href
});
`;

/**
 * Загрузка Яндекс.Метрики только при analyticsAllowed (после согласия в баннере).
 */
export function YandexMetrika() {
  const { hydrated, analyticsAllowed } = useCookieConsent();

  if (!hydrated || !analyticsAllowed) {
    return null;
  }

  return (
    <>
      <Script id="ym-counter" strategy="afterInteractive">
        {inlineMetrika}
      </Script>
      <noscript>
        <div>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={`https://mc.yandex.ru/watch/${METRIKA_ID}`}
            style={{ position: "absolute", left: "-9999px" }}
            alt=""
          />
        </div>
      </noscript>
    </>
  );
}
