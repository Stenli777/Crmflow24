import Script from "next/script";
import { cookies } from "next/headers";
import { ANALYTICS_COOKIE_NAME } from "@/lib/cookieConsentStorage";
import { getYandexMetrikaInlineScript, YANDEX_METRIKA_ID } from "@/lib/yandexMetrika";

/**
 * Метрика в разметке при наличии cookie согласия — видна в SSR после принятия
 * аналитики (и при повторных визитах), в соответствии с политикой cookie.
 */
export async function YandexMetrikaServer() {
  const jar = await cookies();
  if (jar.get(ANALYTICS_COOKIE_NAME)?.value !== "1") {
    return null;
  }

  return (
    <>
      <Script id="ym-counter" strategy="afterInteractive">
        {getYandexMetrikaInlineScript()}
      </Script>
      <noscript>
        <div>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={`https://mc.yandex.ru/watch/${YANDEX_METRIKA_ID}`}
            style={{ position: "absolute", left: "-9999px" }}
            alt=""
          />
        </div>
      </noscript>
    </>
  );
}
