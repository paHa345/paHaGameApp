import { SessionProvider } from "next-auth/react";

const SessionProviderComponent = ({ children, session }: any) => {
  return <SessionProvider session={session}> {children}</SessionProvider>;
};

export default SessionProviderComponent;
