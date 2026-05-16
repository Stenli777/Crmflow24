export type VkConfig = {
  accessToken: string | null;
  groupId: string | null;
  apiVersion: string;
  dryRun: boolean;
};

/** VK_DRY_RUN !== "false" → dry-run (по умолчанию безопасный режим). */
export function getVkConfig(): VkConfig {
  const accessToken = process.env.VK_ACCESS_TOKEN?.trim() || null;
  const groupId = process.env.VK_GROUP_ID?.trim() || null;
  const apiVersion = process.env.VK_API_VERSION?.trim() || "5.199";
  const dryRun = process.env.VK_DRY_RUN?.trim().toLowerCase() !== "false";

  return { accessToken, groupId, apiVersion, dryRun };
}

export function isVkPublishConfigured(config: VkConfig): boolean {
  return Boolean(config.accessToken && config.groupId);
}
