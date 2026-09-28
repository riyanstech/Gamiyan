/**
 * Konfigurasi Supabase
 * Anon key AMAN untuk di-commit — dilindungi Row Level Security (RLS)
 * Ganti nilai di bawah dengan milikmu dari dashboard Supabase
 */
export const SUPABASE_URL = "https://xxxxx.supabase.co";
export const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...";

/** Nama tabel untuk save game */
export const TABLE_NAME = "player_saves";

/** Aktifkan cloud sync (set false kalau mau mode offline saja) */
export const CLOUD_SYNC_ENABLED = true;