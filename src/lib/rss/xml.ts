/** Экранирование текста для XML-атрибутов и элементов. */
export function escapeXml(input: string | null | undefined): string {
  if (!input) return "";
  return input
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

/** Безопасная CDATA-секция (разбивает вложенные `]]>`). */
export function cdata(input: string | null | undefined): string {
  if (!input) return "";
  const safe = input.replace(/]]>/g, "]]]]><![CDATA[>");
  return `<![CDATA[${safe}]]>`;
}
