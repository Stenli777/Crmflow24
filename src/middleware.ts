import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

/** Для JSON-LD (хлебные крошки) и иных SSR-решений по пути запроса. */
export function middleware(request: NextRequest) {
  const requestHeaders = new Headers(request.headers);
  requestHeaders.set("x-pathname", request.nextUrl.pathname);
  return NextResponse.next({
    request: { headers: requestHeaders },
  });
}

export const config = {
  matcher: [
    "/((?!api/|_next/static|_next/image|robots.txt|sitemap.xml|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico)$).*)",
  ],
};
