import NextAuth from "next-auth";
import { NextResponse } from "next/server";
import { authConfig } from "@/auth.config";

const { auth } = NextAuth(authConfig);

export default auth((req) => {
  const isPatientArea = req.nextUrl.pathname.startsWith("/patient");
  if (!isPatientArea) return NextResponse.next();

  if (!req.auth?.user) {
    return NextResponse.redirect(new URL("/login", req.url));
  }

  const role = (req.auth.user as { role?: string }).role;
  if (role !== "PATIENT") {
    return NextResponse.redirect(new URL("/", req.url));
  }

  return NextResponse.next();
});

export const config = {
  matcher: ["/patient/:path*"],
};
