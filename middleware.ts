export { default } from "next-auth/middleware";

export const config = {
  matcher: ["/servers/:path*", "/dashboard/:path*"],
};
