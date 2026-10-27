import { NextResponse, type NextRequest } from "next/server";
import {
  ADMIN_DEMO_COOKIE,
  isAdminDemoAvailable,
  isAllowedAdminEmail,
} from "@/lib/admin/config";
import { isSupabaseConfigured } from "@/lib/supabase/config";
import { createSupabaseProxyClient } from "@/lib/supabase/proxy";

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const isLoginRoute = pathname === "/admin/login";

  if (isAdminDemoAvailable()) {
    if (request.cookies.get(ADMIN_DEMO_COOKIE)?.value === "1") {
      return NextResponse.next();
    }

    if (!isSupabaseConfigured()) {
      return isLoginRoute
        ? NextResponse.next()
        : NextResponse.redirect(new URL("/admin/login", request.url));
    }
  }

  if (!isSupabaseConfigured()) {
    return isLoginRoute
      ? NextResponse.next()
      : NextResponse.redirect(new URL("/admin/login", request.url));
  }

  const { supabase, getResponse } = createSupabaseProxyClient(request);

  try {
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user?.email || !isAllowedAdminEmail(user.email)) {
      return isLoginRoute
        ? NextResponse.next()
        : NextResponse.redirect(new URL("/admin/login", request.url));
    }

    return getResponse();
  } catch {
    return isLoginRoute
      ? NextResponse.next()
      : NextResponse.redirect(new URL("/admin/login", request.url));
  }
}

export const config = {
  matcher: ["/admin", "/admin/:path*"],
};
