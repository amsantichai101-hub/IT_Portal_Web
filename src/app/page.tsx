import { Metadata } from "next";

import { SessionProvider } from "next-auth/react";


export const metadata: Metadata = {
  title: "Home | IT Portal",
  description: "Home Page IT Portal",
};

export default async function Home() {
  return (
    <div>
      Welcome to IT Portal
    </div>
  );
}
