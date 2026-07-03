import { BadgeCheck, CheckCircle } from "lucide-react";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Manage Role | IT Portal",
  description: "Manage IT Portal Role",
};

export default async function Role() {
  return (
    <>
      <div className="flex items-center gap-x-2">
        <BadgeCheck size={20}/>
        <h2 className="font-semibold text-base">Manage Role</h2>
      </div>
      <hr className="my-3"/>
    </>
  );
}
