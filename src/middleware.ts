import { auth } from "@/auth";

export default auth((req) => {
  const { nextUrl } = req;
  const isLoggedIn = !!req.auth;

  const privatePaths = ["/dashboard"];

  // Check if the path is private
  const isPrivatePath = privatePaths.some((path) =>
    req.nextUrl.pathname.startsWith(path)
  );

  if (isPrivatePath && !isLoggedIn) {
    if (req.nextUrl.pathname !== "/dashboard") {
      return Response.redirect(new URL("/dashboard", nextUrl));
    }
  }
});

// Don't invoke Middleware on some paths
export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};
