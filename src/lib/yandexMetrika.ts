/** Счётчик Яндекс.Метрики (см. политику cookie на сайте). */
export const YANDEX_METRIKA_ID = 109166748;

/** Inline-инициализация tag.js — общая для серверного и клиентского рендера. */
export function getYandexMetrikaInlineScript(): string {
  const id = YANDEX_METRIKA_ID;
  return `(function(m,e,t,r,i,k,a){
  m[i]=m[i]||function(){(m[i].a=m[i].a||[]).push(arguments)};
  m[i].l=1*new Date();
  for (var j = 0; j < document.scripts.length; j++) { if (document.scripts[j].src === r) { return; } }
  k=e.createElement(t),a=e.getElementsByTagName(t)[0],k.async=1,k.src=r,a.parentNode.insertBefore(k,a)
})(window, document, 'script', 'https://mc.yandex.ru/metrika/tag.js?id=${id}', 'ym');
ym(${id}, 'init', {
  ssr: true,
  webvisor: true,
  clickmap: true,
  accurateTrackBounce: true,
  trackLinks: true,
  referrer: document.referrer,
  url: location.href
});`;
}
