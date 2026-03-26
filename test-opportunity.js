const { Pool } = require('pg');
const pool = new Pool({ connectionString: 'postgresql://radar_app:CHANGE_THIS_STRONG_PASSWORD@127.0.0.1:55433/opportunity_radar' });

async function run() {
  try {
    const res = await pool.query(`
        SELECT
          o.id,
          o.title,
          COALESCE(s.name, 'Unknown source') AS source_name,
          o.platform::text AS platform,
          o.score,
          o.confidence,
          o.status::text AS status,
          o.routing_action::text AS routing_action,
          o.published_at,
          o.location_text,
          o.content,
          o.ai_reason,
          o.canonical_url,
          o.author_name,
          o.intent::text AS intent,
          o.is_job,
          o.created_at,
          o.updated_at
        FROM opportunities o
        LEFT JOIN sources s ON s.id = o.source_id
        WHERE o.id = '7a665148-3d3e-4881-8c2a-25f7641bc456'
        LIMIT 1
    `);
    console.log(res.rows);
  } catch (err) {
    console.error("OPPORTUNITY ERROR:", err);
  }

  try {
    const cls = await pool.query(`
        SELECT
          id,
          provider,
          model_name,
          verdict,
          confidence,
          reason,
          created_at
        FROM classifications
        WHERE opportunity_id = '7a665148-3d3e-4881-8c2a-25f7641bc456'
        ORDER BY created_at DESC
    `);
    console.log("CLASSIFICATIONS:", cls.rows.length);
  } catch (err) {
    console.error("CLASSIFICATION ERROR:", err);
  }

  try {
    const rev = await pool.query(`
        SELECT
          r.id,
          r.from_status,
          r.to_status,
          r.note,
          r.created_at,
          u.display_name,
          u.email
        FROM reviews r
        LEFT JOIN users u ON u.id = r.reviewer_user_id
        WHERE r.opportunity_id = '7a665148-3d3e-4881-8c2a-25f7641bc456'
        ORDER BY r.created_at DESC
    `);
    console.log("REVIEWS:", rev.rows.length);
  } catch (err) {
    console.error("REVIEWS ERROR:", err);
  }
  
  await pool.end();
}
run();
