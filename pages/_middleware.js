import { getToken } from "next-auth/jwt";
import { NextResponse } from "next/server";

export async function middleware(req) {
  const path = req.nextUrl.pathname;
  if (path === "/dashboard" || path === "/assignments") {
    const session = await getToken({
      req,
      secret: process.env.JWT_SECRET,
      secureCookie: process.env.NODE_ENV === "production"
    });
    if (!session) return NextResponse.redirect("/");
  }
  if (
    path === "/" ||
    path === "/login" ||
    path === "/register" ||
    path === "/facultyRegister"
  ) {
    const session = await getToken({
      req,
      secret: process.env.JWT_SECRET,
      secureCookie: process.env.NODE_ENV === "production"
    });
    if (session) return NextResponse.redirect("/dashboard");
  }
}
