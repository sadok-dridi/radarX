const { Client } = require('pg');
const client = new Client({ connectionString: 'postgresql://radar_app:CHANGE_THIS_STRONG_PASSWORD@127.0.0.1:55433/opportunity_radar' });

async function run() {
  await client.connect();
  const q = "SELECT COUNT(*) FROM opportunities WHERE search_document @@ websearch_to_tsquery('english', 'remote') AND search_document @@ websearch_to_tsquery('english', 'developer OR engineer OR software');"
  const res = await client.query(q);
  console.log("COUNT:", res.rows[0].count);
  await client.end();
}
run().catch(console.error);
