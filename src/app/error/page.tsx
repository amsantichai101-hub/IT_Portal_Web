import { Metadata } from "next";

export const metadata: Metadata = {
  title: {
    default: "Error | IT Portal",
    template: "%s",
  }
};

export default function ErrorPage() {  
  return (
    <div className="flex h-screen items-center justify-center text-center">
      <main>
        <label className="text-xl">Error</label>
      </main>
    </div>
  );
}