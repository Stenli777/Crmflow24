/**
 * Единые визуальные токены для внутренних страниц и повторяющихся карточек.
 */

export const siteSurfaces = {
  cardBorder: "1px solid rgba(15, 23, 42, 0.08)",
  cardShadowSoft: "0 1px 2px rgba(15, 23, 42, 0.04), 0 8px 24px rgba(15, 23, 42, 0.06)",
  cardShadowHover: "0 10px 26px rgba(15, 23, 42, 0.08)",
  /** Лёгкая «плоскость» без глубокой тени (сетки коротких карточек) */
  cardShadowHairline: "0 1px 0 rgba(15, 23, 42, 0.04)",
  /** Разделитель внутри компактных карточек */
  dividerSubtle: "1px solid rgba(15, 23, 42, 0.06)",
  cardRadiusPx: 16,
} as const;

export const siteLayout = {
  /** Заголовок страницы (H1) */
  heroTitleMaxPx: 920,
  /** Лид / подзаголовок под H1 */
  heroLeadMaxPx: 720,
  /** Длинные юридические и «о компании» колонки */
  articleMaxPx: 900,
} as const;
