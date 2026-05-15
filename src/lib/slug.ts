const CYRILLIC_MAP: Record<string, string> = {
  а: "a",
  б: "b",
  в: "v",
  г: "g",
  д: "d",
  е: "e",
  ё: "e",
  ж: "zh",
  з: "z",
  и: "i",
  й: "y",
  к: "k",
  л: "l",
  м: "m",
  н: "n",
  о: "o",
  п: "p",
  р: "r",
  с: "s",
  т: "t",
  у: "u",
  ф: "f",
  х: "h",
  ц: "ts",
  ч: "ch",
  ш: "sh",
  щ: "sch",
  ъ: "",
  ы: "y",
  ь: "",
  э: "e",
  ю: "yu",
  я: "ya",
};

function transliterateChar(char: string): string {
  const lower = char.toLowerCase();
  if (CYRILLIC_MAP[lower] !== undefined) {
    return CYRILLIC_MAP[lower];
  }
  return lower;
}

/** Транслитерация и нормализация строки в URL-slug. */
export function slugify(input: string): string {
  const normalized = input
    .trim()
    .toLowerCase()
    .split("")
    .map((char) => transliterateChar(char))
    .join("");

  const slug = normalized
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");

  return slug;
}
