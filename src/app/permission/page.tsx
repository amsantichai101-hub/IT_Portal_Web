import { Button } from "@/components/ui/button";
import { UserCheck } from "lucide-react";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Manage Permission | IT Portal",
  description: "Manage IT Portal Permission",
};

export default async function Permission() {
  return (
    <>
      <div className="flex items-center gap-x-2">
        <UserCheck size={20}/>
        <h2 className="font-semibold text-base">Manage Permission</h2>
      </div>
      <hr className="my-3"/>
      {/* Button Section */}
      <div className="grid grid-cols-1 lg:grid-cols-4 md:grid-cols-3 grid-rows-1 gap-x-2">
        <Button size="sm" variant="secondary">Add new permission</Button>
      </div>
    </>
  );
}
