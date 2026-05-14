/**
 * Реквизиты оператора ПДн, контакты и версия согласий (публикуются на сайте).
 */
export const legalConfig = {
  operatorName: "ООО «Лиса Эдженси»",
  legalAddress:
    "191002, г. Санкт-Петербург, ул. Рубинштейна, д. 19/8, лит. А, пом. 22-Н, оф. 4",
  /** Фрагменты адреса для JSON-LD (совпадают с legalAddress) */
  addressStructured: {
    postalCode: "191002",
    addressLocality: "Санкт-Петербург",
    streetAddress: "ул. Рубинштейна, д. 19/8, лит. А, пом. 22-Н, оф. 4",
    addressCountry: "RU",
  },
  inn: "7840091736",
  kpp: "784001001",
  ogrn: "1207800025290",
  /** Запросы субъектов ПДн и вопросы по политике */
  privacyEmail: "privacy@crmflow24.ru",
  /** Заявки и общая связь */
  contactEmail: "info@crmflow24.ru",
  phoneDisplay: "+7 (981) 763-96-61",
  phoneTel: "+79817639661",
  telegramUrl: "https://t.me/AlekseySten",
  businessPartnerSinceYear: 2020,
  /** Фактическое число завершённых/ведущихся проектов по данным владельца */
  projectsCount: 35,
  workSinceYear: 2020,
  longestClientYearsMin: 5,
  workHours: "пн–пт, 10:00–19:00 МСК",
  workFormat: "удалённо с компаниями по РФ",
  /** Отрасли клиентов — для тегов и текстовых перечислений */
  clientIndustries: [
    "строительство",
    "недвижимость",
    "майнинг-оборудование",
    "арендный бизнес",
    "продажа автозапчастей",
    "протезирование",
  ] as const,
  industriesLine:
    "строительство, недвижимость, майнинг-оборудование, арендный бизнес, продажа автозапчастей, протезирование",
  /** Версия текста согласия на обработку ПДн (/consent, DOCX Согласие_на_обработку_персональных_данных) */
  consentVersion: "1.2",
  consentEffectiveDate: "2026-05-14",
  policyVersion: "1.2",
  policyEffectiveDate: "2026-05-14",
  /** Версия политики cookie (страница /cookies, документ Политика_cookie) */
  cookiePolicyVersion: "1.2",
  cookiePolicyEffectiveDate: "2026-05-14",
  /** Версия пользовательского соглашения (/terms, DOCX Пользовательское_соглашение) */
  termsVersion: "1.2",
  termsEffectiveDate: "2026-05-14",
  /** Согласие на рекламные и информационные сообщения (/marketing-consent) */
  marketingConsentVersion: "1.2",
  marketingConsentEffectiveDate: "2026-05-14",
  /** Хостинг и сервисы (для политики ПДн / cookie) */
  hostingProvider: "REG.RU",
} as const;
