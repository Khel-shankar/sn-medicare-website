import { NextRequest, NextResponse } from "next/server";
import { getAdminSessionFromRequest } from "@/lib/admin-auth";
import { listOrders } from "@/lib/orders";
import { formatDbError, isSupabaseConfigured } from "@/lib/supabase";

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
    const dbUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "NOT_SET";
    const hasKey = Boolean(process.env.SUPABASE_SERVICE_ROLE_KEY);
    console.error("List orders error:", detail);
    return NextResponse.json(
      { error: "Failed to load orders", detail, dbUrl, hasKey },
      { status: 500 }
    );
  }
}
