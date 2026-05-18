-- CreateTable
CREATE TABLE "ScrapArticleImport" (
    "id" TEXT NOT NULL,
    "provider" TEXT NOT NULL DEFAULT 'scrap',
    "documentId" TEXT NOT NULL,
    "revisionId" TEXT NOT NULL DEFAULT 'latest',
    "sourceUrl" TEXT,
    "sourceDomain" TEXT,
    "scrapedAt" TIMESTAMP(3),
    "postId" TEXT NOT NULL,
    "payloadVersion" TEXT NOT NULL DEFAULT 'article_v2',
    "remoteStatus" TEXT NOT NULL DEFAULT 'draft',
    "editorialJson" JSONB,
    "lastPayload" JSONB,
    "importedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ScrapArticleImport_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "ScrapArticleImport_provider_documentId_revisionId_key" ON "ScrapArticleImport"("provider", "documentId", "revisionId");

-- CreateIndex
CREATE INDEX "ScrapArticleImport_postId_idx" ON "ScrapArticleImport"("postId");

-- CreateIndex
CREATE INDEX "ScrapArticleImport_sourceDomain_idx" ON "ScrapArticleImport"("sourceDomain");

-- AddForeignKey
ALTER TABLE "ScrapArticleImport" ADD CONSTRAINT "ScrapArticleImport_postId_fkey" FOREIGN KEY ("postId") REFERENCES "Post"("id") ON DELETE CASCADE ON UPDATE CASCADE;
