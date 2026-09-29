import { getDb } from "@/lib/d1";
import { DEFAULT_TRUST_YAML } from "@/lib/trust-config";

const CONFIG_ID = "default";

export type StoredTrustConfig = {
  yaml: string;
  updatedAt: string | null;
};

function defaultConfig(): StoredTrustConfig {
  return {
    yaml: DEFAULT_TRUST_YAML,
    updatedAt: null,
  };
}

type TrustConfigRow = {
  yaml: string;
  updated_at: string | null;
};

export async function getStoredTrustConfig(): Promise<StoredTrustConfig> {
  try {
    const db = await getDb();
    const row = await db
      .prepare(
        "SELECT yaml, updated_at FROM trust_configs WHERE id = ? LIMIT 1"
      )
      .bind(CONFIG_ID)
      .first<TrustConfigRow>();

    return {
      yaml: row?.yaml ?? DEFAULT_TRUST_YAML,
      updatedAt: row?.updated_at ?? null,
    };
  } catch (error) {
    console.warn(
      "Trust config unavailable from D1; using default YAML.",
      error instanceof Error ? error.message : error
    );
    return defaultConfig();
  }
}

export async function saveTrustConfig(yaml: string): Promise<StoredTrustConfig> {
  const db = await getDb();
  const updatedAt = new Date().toISOString();

  await db
    .prepare(
      `INSERT INTO trust_configs (id, yaml, updated_at)
       VALUES (?, ?, ?)
       ON CONFLICT(id) DO UPDATE SET
         yaml = excluded.yaml,
         updated_at = excluded.updated_at`
    )
    .bind(CONFIG_ID, yaml, updatedAt)
    .run();

  return {
    yaml,
    updatedAt,
  };
}
