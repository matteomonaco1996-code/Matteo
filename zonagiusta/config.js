// Configurazione di Zona Giusta.
// Le richieste si attivano solo quando questi due valori sono compilati.
// Si trovano in Supabase → Project Settings → API:
//   supabaseUrl = "Project URL"
//   supabaseKey = chiave "publishable" (è pensata per stare nel browser: la sicurezza
//                 la fanno le regole del database in supabase/schema.sql)
// NON inserire MAI qui una chiave "secret" o "service_role": darebbe accesso a tutto il database.
window.ZG_CONFIG = {
  supabaseUrl: "https://nurjufjhzkobqgreckkg.supabase.co",
  supabaseKey: "sb_publishable_mcFrlzUCWhMcFdBeqcdPgA_yWJwKpMy",
  // Versioni dei documenti accettati con la richiesta: aggiornale se cambi privacy.html o termini.html.
  versioneTermini: "1.0",
  versionePrivacy: "1.0",
};
