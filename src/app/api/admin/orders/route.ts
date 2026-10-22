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
    console.error("List orders error:", detail);
    return NextResponse.json(
      { error: "Failed to load orders", detail },
      { status: 500 }
    );
  }
}
