"use server";

import { requireOwnerSession } from "@/lib/auth/session";
import { getDb, isDatabaseConfigured } from "@/lib/db";
import { revalidatePath } from "next/cache";
import { Pool } from "pg";
import { randomUUID } from "crypto";

const REVIEW_ACTION_BY_STATUS: Record<string, string> = {
  interesting: "mark_interesting",
  qualified: "mark_qualified",
  watch: "mark_watch",
  ignored: "mark_ignored",
  duplicate: "mark_duplicate",
  acted_on: "mark_acted_on",
  new: "reopen",
};

export async function updateOpportunityStatus(opportunityId: string, status: string) {
  const session = await requireOwnerSession();
  if (!session) {
    throw new Error("Unauthorized");
  }

  if (!isDatabaseConfigured()) {
    throw new Error("Database not configured");
  }

  const pool = new Pool({ connectionString: process.env.DATABASE_URL });
  const client = await pool.connect();
  let transactionStarted = false;
  let transactionCommitted = false;
  
  try {
    const reviewAction = REVIEW_ACTION_BY_STATUS[status];
    if (!reviewAction) {
      throw new Error("Invalid opportunity status");
    }

    await client.query("BEGIN");
    transactionStarted = true;

    // Get current status first
    const res = await client.query(`SELECT status FROM opportunities WHERE id = $1`, [opportunityId]);
    const currentStatus = res.rows[0]?.status || 'new';

    // Update status
    await client.query(
      `UPDATE opportunities SET status = $1::opportunity_status WHERE id = $2`,
      [status, opportunityId]
    );

    // Log the review action
    await client.query(
      `INSERT INTO reviews (id, opportunity_id, reviewer_user_id, action, from_status, to_status) VALUES ($1, $2, $3, $4::review_action, $5, $6)`,
      [randomUUID(), opportunityId, session.user.id, reviewAction, currentStatus, status]
    );

    await client.query("COMMIT");
    transactionCommitted = true;

    revalidatePath(`/app/opportunities/${opportunityId}`);
    revalidatePath("/app/opportunities");
    revalidatePath("/app/reviews");
  } catch (error) {
    if (transactionStarted && !transactionCommitted) {
      await client.query("ROLLBACK");
    }
    throw error;
  } finally {
    client.release();
    await pool.end();
  }
}

export async function addReviewNote(opportunityId: string, currentStatus: string, note: string) {
  const session = await requireOwnerSession();
  if (!session) {
    throw new Error("Unauthorized");
  }

  if (!isDatabaseConfigured()) {
    throw new Error("Database not configured");
  }

  const pool = new Pool({ connectionString: process.env.DATABASE_URL });
  
  try {
    await pool.query(
      `INSERT INTO reviews (id, opportunity_id, reviewer_user_id, action, from_status, to_status, note) VALUES ($1, $2, $3, 'add_note'::review_action, $4, $5, $6)`,
      [randomUUID(), opportunityId, session.user.id, currentStatus, currentStatus, note]
    );

    revalidatePath(`/app/opportunities/${opportunityId}`);
    revalidatePath("/app/reviews");
  } finally {
    await pool.end();
  }
}
