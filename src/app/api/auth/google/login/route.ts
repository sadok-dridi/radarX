import { NextResponse } from "next/server";
import { googleClient } from "@/lib/auth/google";

export async function GET() {
  const url = googleClient.generateAuthUrl({
    access_type: "offline",
    scope: ["https://www.googleapis.com/auth/userinfo.profile", "https://www.googleapis.com/auth/userinfo.email"],
  });

  return NextResponse.redirect(url);
}
