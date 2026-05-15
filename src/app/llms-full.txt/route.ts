import { getPostsForLlms } from "@/lib/blog/seoQueries";
import { buildLlmsFullTxt } from "@/lib/llms/buildLlms";
import {
  isSeoFeedAllowed,
  seoFeedBlockedResponse,
} from "@/lib/seo/seoFeeds";

export const dynamic = "force-dynamic";

export async function GET() {
  if (!isSeoFeedAllowed()) {
    return seoFeedBlockedResponse();
  }

  const posts = await getPostsForLlms();
  const body = buildLlmsFullTxt(posts);

  return new Response(body, {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Cache-Control": "public, max-age=3600, s-maxage=3600",
    },
  });
}
