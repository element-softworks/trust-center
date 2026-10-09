import { getCloudflareContext } from "@opennextjs/cloudflare";

export async function getCloudflareEnv() {
  const { env } = await getCloudflareContext({ async: true });
  return env;
}

export async function getDb() {
  const env = await getCloudflareEnv();
  if (!env.DB) {
    throw new Error("D1 binding DB is not configured.");
  }
  return env.DB;
}
