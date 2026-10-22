import { NextRequest, NextResponse } from "next/server";
import { getAdminSessionFromRequest } from "@/lib/admin-auth";
import { listOrders } from "@/lib/orders";
import {
  formatDbError,
  getSupabaseKey,
  getSupabaseUrl,
  isSupabaseConfigured,
} from "@/lib/supabase";

export async function GET(req: NextRequest) {
  const session = await getAdminSessionFromRequest(req);
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  if (!isSupabaseConfigured()) {
    return NextResponse.json(
      { error: "Database not configured", orders: [] },
      { status: 503 }
    );
  }

  try {
    const orders = await listOrders(150);
    return NextResponse.json({ orders });
  } catch (error) {
    const detail = formatDbError(error);
    const rawUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "NOT_SET";
    const actualUrl = getSupabaseUrl();
    const actualKey = getSupabaseKey();
    const keyPreview = actualKey
      ? `${actualKey.slice(0, 10)}...${actualKey.slice(-5)} (len: ${actualKey.length})`
      : "EMPTY";
    console.error("List orders error:", detail, { actualUrl, keyPreview });
    return NextResponse.json(
      { error: "Failed to load orders", detail, rawUrl, actualUrl, keyPreview },
      { status: 500 }
    );
  }
}
