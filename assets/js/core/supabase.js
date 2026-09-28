/* =====================================================
   SUPABASE — cloud save/load
   ===================================================== */
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import { SUPABASE_URL, SUPABASE_ANON_KEY, TABLE_NAME, CLOUD_SYNC_ENABLED } from "../config.js";
import { state } from "./state.js";
import { getDeviceId } from "./storage.js";

export const supabase =
  CLOUD_SYNC_ENABLED && SUPABASE_URL && !SUPABASE_URL.includes("xxxxx")
    ? createClient(SUPABASE_URL, SUPABASE_ANON_KEY)
    : null;

/**
 * Simpan progress ke Supabase (upsert by device_id).
 */
export async function saveCloud() {
  if (!supabase) return;
  try {
    const deviceId = getDeviceId();
    const payload = {
      device_id: deviceId,
      user_id: state.userId,
      ore: state.ore,
      tap_power: state.tapPower,
      per_second: state.perSecond,
      upgrades: state.upgrades,
      updated_at: new Date().toISOString(),
    };

    const { error } = await supabase
      .from(TABLE_NAME)
      .upsert(payload, { onConflict: "device_id" });

    if (error) console.warn("Cloud save error:", error.message);
  } catch (e) {
    console.warn("Cloud save exception:", e);
  }
}

/**
 * Load progress dari Supabase berdasarkan device_id.
 */
export async function loadCloud() {
  if (!supabase) return null;
  try {
    const deviceId = getDeviceId();
    const { data, error } = await supabase
      .from(TABLE_NAME)
      .select("*")
      .eq("device_id", deviceId)
      .maybeSingle();

    if (error) {
      console.warn("Cloud load error:", error.message);
      return null;
    }
    return data;
  } catch (e) {
    console.warn("Cloud load exception:", e);
    return null;
  }
}