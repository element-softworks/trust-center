import { createServerClient } from "@/lib/supabase";
import { DEFAULT_TRUST_YAML } from "@/lib/trust-config";

const CONFIG_ID = "default";
const TABLE_NAME = "trust_configs";

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

export async function getStoredTrustConfig(): Promise<StoredTrustConfig> {
  try {
    const supabase = createServerClient();
    const { data, error } = await supabase
      .from(TABLE_NAME)
      .select("yaml, updated_at")
      .eq("id", CONFIG_ID)
      .maybeSingle();

    // PGRST116 = no rows; treat any other error as "use default" so the
    // public trust center still renders when Supabase is unreachable.
    if (error && error.code !== "PGRST116") {
      console.warn(
        "Trust config unavailable from Supabase; using default YAML.",
        error.message || error
      );
      return defaultConfig();
    }

    return {
      yaml: data?.yaml ?? DEFAULT_TRUST_YAML,
      updatedAt: data?.updated_at ?? null,
    };
  } catch (error) {
    console.warn(
      "Trust config unavailable from Supabase; using default YAML.",
      error instanceof Error ? error.message : error
    );
    return defaultConfig();
  }
}

export async function saveTrustConfig(yaml: string): Promise<StoredTrustConfig> {
  const supabase = createServerClient();
  const { data, error } = await supabase
    .from(TABLE_NAME)
    .upsert(
      {
        id: CONFIG_ID,
        yaml,
      },
      { onConflict: "id" }
    )
    .select("yaml, updated_at")
    .single();

  if (error || !data) {
    console.error("Failed to persist trust config:", error);
    throw new Error("Unable to save trust center config.");
  }

  return {
    yaml: data.yaml,
    updatedAt: data.updated_at ?? null,
  };
}
