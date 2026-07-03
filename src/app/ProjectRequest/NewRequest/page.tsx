import ProjectRequestForm from "@/app/ProjectRequest/NewRequest/Client";
import { GenerateRequestFromNew } from "@/app/ProjectRequest/Api/ServerApi"
export const metadata = {
  title: "New Request | IT Portal",
};
export default async function Page() {
    const RequestFromNew = await GenerateRequestFromNew();
  return (
    <div className="min-h-screen bg-[#F8FAFC] p-6 md:p-12 font-sans selection:bg-blue-100">
      <div className="max-w-4xl mx-auto space-y-10">
        <header className="flex flex-col md:flex-row md:items-center justify-between gap-6 border-b border-slate-200 pb-8">
          <div className="space-y-2">
            <div className="flex items-center gap-2 mb-1">
              <div className="h-2 w-2 bg-[#00338D] rounded-full animate-pulse"></div>
              <span className="text-[12px] font-bold text-[#00338D] tracking-[0.1em] uppercase">Project Request</span>
            </div>
            <h1 className="text-4xl font-black text-slate-900 tracking-tight">New Request</h1>
          </div>
        </header>

      <ProjectRequestForm initialData={RequestFromNew.data} />
      </div>
    </div>
  );
}