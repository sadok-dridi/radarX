"use server";

import { requireOwnerSession } from "@/lib/auth/session";
import { getDb, isDatabaseConfigured } from "@/lib/db";
import { revalidatePath } from "next/cache";
import { Pool } from "pg";
import { randomUUID } from "crypto";

export async function updateOpportunityStatus(opportunityId: string, status: string) {
  const session = await requireOwnerSession();
  if (!session) {
    throw new Error("Unauthorized");
  }

  if (!isDatabaseConfigured()) {
    throw new Error("Database not configured");
  }

  const pool = new Pool({ connectionString: process.env.DATABASE_URL });
  
  try {
    // Get current status first
    const res = await pool.query(`SELECT status FROM opportunities WHERE id = $1`, [opportunityId]);
    const currentStatus = res.rows[0]?.status || 'new';

    // Update status
    await pool.query(
      `UPDATE opportunities SET status = $1::opportunity_status WHERE id = $2`,
      [status, opportunityId]
    );

    // Log the review action
    await pool.query(
      `INSERT INTO reviews (id, opportunity_id, user_id, from_status, to_status) VALUES ($1, $2, $3, $4, $5)`,
      [randomUUID(), opportunityId, session.user.id, currentStatus, status]
    );

    revalidatePath(`/app/opportunities/${opportunityId}`);
    revalidatePath("/app/opportunities");
    revalidatePath("/app/reviews");
  } finally {
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
      `INSERT INTO reviews (id, opportunity_id, user_id, from_status, to_status, note) VALUES ($1, $2, $3, $4, $5, $6)`,
      [randomUUID(), opportunityId, session.user.id, currentStatus, currentStatus, note]
    );

    revalidatePath(`/app/opportunities/${opportunityId}`);
    revalidatePath("/app/reviews");
  } finally {
    await pool.end();
  }
}

