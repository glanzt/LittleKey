"use client";

import { SessionProvider } from "next-auth/react";

export default function AuthSessionProvider(props) {
  var children = props.children;
  var session = props.session;

  return <SessionProvider session={session}>{children}</SessionProvider>;
}
