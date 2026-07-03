"use client";
import { useEffect, useState } from "react";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { RadioGroup } from "@/components/ui/radio-group";

import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import {
  Info, Laptop, Clock, ShieldCheck, Database,
  ArrowRight, Save, Banknote, History, ExternalLink,
  Import,Search
} from "lucide-react";
import {
  SectionHeader, CustomLabel, MetricInput,
  FileUploadRow, StyledRadio, PlatformCheckbox
} from "@/app/ProjectRequest/NewRequest/Componets";
import { useSession, getSession, signIn } from "next-auth/react";
import { apiClient, SearchApplicationName, SearchEmployeeName} from "@/app/ProjectRequest/Api/ClientApi";
import {GenerateNewRequest} from "@/app/ProjectRequest/Model/NewRequest"

export default function ProjectRequestForm({ initialData }: GenerateNewRequest) {
    const { typeOfRequests, applicationOrigins, applicationTypes , requester, unitgroup } = initialData;
    const [riskFileName, setRiskFileName] = useState<string | null>(null);
    const [mockupFileName, setMockupFileName] = useState<string | null>(null);
    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>, setter: (name: string) => void) => {
        if (e.target.files && e.target.files[0]) {
        setter(e.target.files[0].name);
        }
    };
    const { data: session, status } = useSession();
    const [data, setData] = useState<any>(null);
    const [error, setError] = useState<any>(null);
    
  useEffect(() => {
    if (status !== "authenticated" || !session?.accessToken) return;
    const token = session.accessToken;
    const reqId = apiClient.interceptors.request.use((config) => {
      config.headers = config.headers || {};
      (config.headers as any).Authorization = `Bearer ${token}`;
      return config;
    });
    const resId = apiClient.interceptors.response.use(
      (res) => res,
      async (err) => {
        const original = err.config;
        if (err.response?.status === 401 && !original._retry) {
          original._retry = true;
          const fresh = await getSession();
          if (!fresh?.accessToken) {
            await signIn(); // ให้ล็อกอินใหม่ถ้า refresh พังจริง ๆ
            return Promise.reject(err);
          }
          original.headers = original.headers || {};
          original.headers.Authorization = `Bearer ${fresh.accessToken}`;
          return apiClient.request(original);
        }
        return Promise.reject(err);
      }
    );
    return () => {
      apiClient.interceptors.request.eject(reqId);
      apiClient.interceptors.response.eject(resId);
    };

  }, [status, session?.accessToken]);

        // ประกาศ State สำหรับเก็บค่า Request Type เพื่อนำไปเช็คเงื่อนไขการค้นหา
        const [requestType, setRequestType] = useState<string>(initialData?.typeOfRequests?.[0]?.typeOfRequestId || "");

        // State สำหรับการค้นหาพนักงาน
        const [itSearch, setItSearch] = useState("");
        const [itSuggestions, setItSuggestions] = useState<any[]>([]);
        const [selectedIT, setSelectedIT] = useState<any>(null);

        // State สำหรับการค้นหา Application
        const [appSearch, setAppSearch] = useState("");
        const [appSuggestions, setAppSuggestions] = useState<any[]>([]);
        const [isLoading, setIsLoading] = useState({ it: false, app: false });

        // วางไว้กลุ่มเดียวกับ State อื่นๆ ของคุณ
        const [itError, setItError] = useState(false); // เช็ค Error ช่อง IT
        const [appError, setAppError] = useState(false); // เช็ค Error ช่อง App
        const [selectedApp, setSelectedApp] = useState<any>(null); // เพิ่มตัวนี้ (แก้ Error ในภาพ)
    
    // 1. Logic สำหรับ First IT Contact (ยิง API เมื่อพิมพ์ 3 ตัวขึ้นไป)
    useEffect(() => {
    const timer = setTimeout(async () => {
        if (itSearch.length >= 3 && !selectedIT) {
        setIsLoading(prev => ({ ...prev, it: true }));
        try {
            // เปลี่ยนตรงนี้เป็น function ยิง API พนักงานของคุณ (เช่น getEmp)
            const res = await SearchEmployeeName(itSearch)
            setItSuggestions(res.data || []);
        } catch (err) { console.error(err); }
        finally { setIsLoading(prev => ({ ...prev, it: false })); }
        } else {
        setItSuggestions([]);
        }
    }, 500);
    return () => clearTimeout(timer);
    }, [itSearch, selectedIT]);

    // 2. Logic สำหรับ Application Name (เฉพาะ Maintenance และพิมพ์ 3 ตัวขึ้นไป)
    useEffect(() => {
    const timer = setTimeout(async () => {
        if (appSearch.length >= 3 && requestType === "H9UTplzuPlygWhCm+826tw==") {
        setIsLoading(prev => ({ ...prev, app: true }));
        try {
            const res = await SearchApplicationName(appSearch);
            setAppSuggestions(res.data || []);
        } catch (err) { console.error(err); }
        finally { setIsLoading(prev => ({ ...prev, app: false })); }
        } else {
        setAppSuggestions([]);
        }
    }, 500);
    return () => clearTimeout(timer);
    }, [appSearch, requestType]);

    const validateField = (type: 'it' | 'app') => {
    if (type === 'it') {
        // ถ้ามีข้อความในช่อง แต่ selectedIT เป็น null แปลว่าไม่ได้กดเลือกจาก list
        setItError(itSearch !== "" && !selectedIT);
    } else {
        setAppError(appSearch !== "" && !selectedApp);
    }
    };
    
    return (
    <Card className="border-none shadow-[0_20px_50px_rgba(0,0,0,0.05)] rounded-[32px] overflow-hidden bg-white">
      <CardContent className="p-0">
        <form>
          {/* Section 1: Basic Info */}
          <div className="p-8 md:p-12 space-y-10">
            <SectionHeader icon={<Info className="w-5 h-5" />} title="Basic Information" />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-10 gap-y-8">
              <div className="group space-y-2.5">
                <CustomLabel htmlFor="requester">Requester Profile</CustomLabel>
                <Input id="requester" disabled value = {requester}
                  className="bg-slate-50/80 border-slate-200 h-14 rounded-2xl font-semibold text-slate-600 cursor-not-allowed" />
              </div>
              <div className="group space-y-2.5">
                <CustomLabel htmlFor="unitgroup">Unit Group / Department</CustomLabel>
                <Input id="unitgroup" disabled value = {unitgroup}
                  className="bg-slate-50/80 border-slate-200 h-14 rounded-2xl font-semibold text-slate-600 cursor-not-allowed" />
              </div>            
            </div>
            <div className="space-y-3 relative group">
            <CustomLabel notRequired>First IT Contact Person</CustomLabel>
            <div className="relative">
                <Input
                // ... props เดิมของคุณ ... 
                onChange={(e) => { 
                    setItSearch(e.target.value); 
                    setSelectedIT(null); // ล้างค่า selection ทันทีที่เริ่มพิมพ์ใหม่
                    setItError(false);   // ล้างสีแดงทันทีที่เริ่มพิมพ์ใหม่
                }}
                onBlur={() => validateField('it')} 
                // เช็คทันทีที่เมาส์ออกจากช่อง
                className={`h-14 pl-12 rounded-2xl transition-all ${
                    itError 
                    ? "border-red-500 bg-red-50 focus:ring-red-100 focus:border-red-500" // สีเมื่อผิด
                    : "border-slate-200 bg-white focus:ring-blue-50 focus:border-[#00338D]" // สีปกติ
                }`}
                />
                {/* แสดงข้อความเตือนใต้ช่อง */}
                {itError && <p className="text-red-500 text-[10px] font-bold mt-1 ml-2 animate-bounce">⚠️ Please select a person from the list</p>}
                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">
                <Search className="w-5 h-5" />
                </div>
                {/* Dropdown พนักงาน */}
                {itSuggestions.length > 0 && (
                <div className="absolute z-[100] w-full mt-2 bg-white border border-slate-100 shadow-[0_15px_40px_rgba(0,0,0,0.1)] rounded-2xl max-h-64 overflow-auto py-1">
                    {itSuggestions.map((emp: any) => (
                    <div 
                        key={emp.employeeNo}
                        /* ไฮไลท์สีฟ้าอ่อนเมื่อ Hover */
                        className="px-5 py-4 hover:bg-blue-50/80 cursor-pointer flex justify-between items-center group/item transition-all mx-1 rounded-xl"
                        onClick={() => {
                        setSelectedIT(emp);
                        setItSearch(`${emp.employeeNo} : ${emp.employeeName}`);
                        setItSuggestions([]);
                        setItError(false); // เลือกแล้ว ปิด Error ทันที
                        }}
                    >
                        <div className="flex flex-col">
                        {/* 1. ชื่อพนักงาน: เปลี่ยนเป็นสีน้ำเงินเข้ม (#00338D) เมื่อ Hover */}
                        <span className="font-semibold text-slate-700 group-hover/item:text-[#00338D] transition-colors">
                            {emp.employeeNo} : {emp.employeeName}
                        </span>
                        </div>
                        
                        {/* 2. Badge รหัสพนักงาน (องค์ประกอบเดิม): เปลี่ยนพื้นหลังเป็นสีน้ำเงินเข้มและตัวหนังสือขาวเมื่อ Hover */}
                        <span className="text-[11px] font-bold text-slate-400 bg-slate-50 px-3 py-1.5 rounded-lg group-hover/item:bg-[#00338D] group-hover/item:text-white transition-all">
                        {emp.employeeNo}
                        </span>
                        
                    </div>
                    ))}
                </div>
                )}
            </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12 pt-4">
              <div className="space-y-5">
                <CustomLabel>Type Of Request</CustomLabel>
                  <RadioGroup
                    value={requestType}
                    onValueChange={setRequestType} // เชื่อมต่อกับ State
                    className="grid grid-cols-1 gap-4"
                  >
                    {typeOfRequests.map((item: any) => (
                      <StyledRadio
                        key={item.typeOfRequestId}
                        id={`type-${item.typeOfRequestId}`}
                        value={item.typeOfRequestId} // ส่งค่า ID เป็น string
                        label={item.typeOfRequestName}
                      />
                    ))}
                  </RadioGroup>
              </div>
              <div className="space-y-5">
                <CustomLabel>Application Origin</CustomLabel>
                <RadioGroup defaultValue={applicationOrigins[0]?.applicationOriginId?.toString()} className="grid grid-cols-1 gap-4">
                {applicationOrigins.map((item: any) => (
                  <StyledRadio
                      key={item.applicationOriginId}          
                      id={`origin-${item.applicationOriginId}`}
                      value={item.applicationOriginId.toString()}
                      label={item.applicationOriginName}
                    />
                  ))}
                </RadioGroup>
              </div>
            </div>
          </div>
          {/* Section 2: App Details */}
          <div className="p-8 md:p-12 space-y-10 bg-slate-50/50 border-y border-slate-100">
            <SectionHeader icon={<Laptop className="w-5 h-5" />} title="Application Details" />
            <div className="space-y-5">
              <CustomLabel>Application Type</CustomLabel>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                {applicationTypes.map((item) => (
                  <PlatformCheckbox key={item.applicationTypeId} id={item.applicationTypeId} label={item.applicationTypeName} />
                ))}
              </div>
            </div>
            <div className="grid gap-8  bg-white">
                <div className="space-y-3 relative group">
                <div className="flex justify-between items-end px-1">
                    <CustomLabel>Application Name</CustomLabel>
                    {requestType === "H9UTplzuPlygWhCm+826tw==" && (
                    /* จุดที่ 3: ปรับแต่งแถบ Maintenance Mode - เปลี่ยนสีข้อความ */
                    <span className="text-[10px] font-black text-[#00338D] uppercase tracking-widest bg-blue-50 px-2 py-1 rounded-md mb-1 animate-pulse">
                        Maintenance Mode
                    </span>
                    )}
                </div>

                {requestType === "H9UTplzuPlygWhCm+826tw==" ? (
                    <div className="relative">
                    {/* Input Field: ปรับให้ดูนุ่มนวลขึ้น */}
                    <div className="relative">
                        <Input
                        // ... props เดิมของคุณ ...
                        onChange={(e) => { 
                            setAppSearch(e.target.value); 
                            setSelectedApp(null); // ล้างค่า selection
                            setAppError(false);   // ล้างสีแดง
                        }}
                        onBlur={() => validateField('app')}
                        className={`h-14 pl-12 rounded-2xl transition-all ${
                            appError 
                            ? "border-red-500 bg-red-50 focus:ring-red-100 focus:border-red-500" 
                            : "border-slate-200 bg-white focus:ring-blue-50 focus:border-blue-400"
                        }`}
                        />
                        {/* แสดงข้อความเตือนใต้ช่อง */}
                        {appError && <p className="text-red-500 text-[10px] font-bold mt-1 ml-2 animate-bounce">⚠️ Please select an application from the list</p>}
                        <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">
                        <Laptop className="w-5 h-5" />
                        </div>
                    </div>

                    {/* Dropdown รายชื่อ Application */}
                    {appSuggestions.length > 0 && (
                    <div className="absolute z-[100] w-full mt-3 bg-white/95 backdrop-blur-sm border border-slate-100 shadow-[0_20px_50px_rgba(0,0,0,0.1)] rounded-[24px] max-h-64 overflow-auto py-2 animate-in fade-in slide-in-from-top-2">
                        {appSuggestions.map((app: any) => (
                        <div 
                            key={app.applicationNameId || app.id}
                            /* พื้นหลังเปลี่ยนเป็นสีฟ้าอ่อนเมื่อ Hover (hover:bg-blue-50/80) */
                            className="px-5 py-4 hover:bg-blue-50/80 cursor-pointer flex items-center justify-between group/item transition-all mx-2 rounded-xl"
                            onClick={() => {
                            setSelectedApp(app); // อย่าลืมสร้าง State selectedApp ด้านบนด้วยนะครับ
                            setAppSearch(app.applicationName || app.appName);
                            setAppSuggestions([]);
                            setAppError(false); // เลือกแล้ว ปิด Error ทันที
                            }}
                        >
                            <div className="flex flex-col">
                            {/* ชื่อแอปเปลี่ยนเป็นสีน้ำเงินเข้มเมื่อ Hover ตาม First IT Contact Person */}
                                                   
                            <span className="font-semibold text-sm text-slate-700 group-hover/item:text-[#00338D] transition-colors">
                                {app.applicationName}
                            </span>
                            </div>

                            {/* วงกลมไอคอน: ปกติสีเทาอ่อน เมื่อ Hover จะเป็นสีน้ำเงินเข้ม (#00338D) และไอคอนสีขาว */}
                            <div className="h-8 w-8 rounded-full bg-slate-50 flex items-center justify-center text-slate-400 group-hover/item:bg-[#00338D] group-hover/item:text-white transition-all shadow-sm">
                            <ArrowRight className="w-4 h-4" />
                            </div>
                        </div>
                        ))}
                    </div>
                    )}
                    </div>
                ) : (
                    <div className="relative">
                    <Input 
                        placeholder="Enter new project name" 
                        className="h-14 rounded-2xl border-slate-200 bg-white transition-all focus:ring-4 focus:ring-slate-50" 
                    />
                    </div>
                )}
                </div>
                <div className="space-y-2.5">
                    <CustomLabel>Purpose / Business Reason</CustomLabel>
                    <Textarea placeholder="What problem does this solve?" className="min-h-[140px] rounded-[24px] resize-none border-slate-200 p-5 focus:ring-4 focus:ring-blue-50 focus:border-[#00338D] outline-none transition-all duration-300" />
                </div>
            </div>
          </div>
          {/* Section 3: Metrics */}
          <div className="p-8 md:p-12 space-y-10 bg-white">
            <SectionHeader icon={<History className="w-5 h-5" />} title="Current Process" />
            <div className="space-y-2.5">
              <CustomLabel>Process step</CustomLabel>
              <Textarea placeholder="Step-by-step explanation..." className="min-h-[140px] rounded-[24px] resize-none border-slate-200 p-5 focus:ring-4 focus:ring-blue-50 focus:border-[#00338D] outline-none" />
              <div className="flex items-center gap-2 mt-2 px-1">
                <div className="h-1 w-1 rounded-full bg-red-400"></div>
                <p className="text-red-500 text-[11px] font-bold tracking-wider">Description is mandatory for approval</p>
              </div>
            </div>
            <div className="grid grid-cols-1 gap-6 pt-4">
              <MetricInput label="Time usage" placeholder="e.g. 20 hrs/wk" icon={<Clock className="w-4 h-4" />} description="Estimated resource hours saved" />
              <MetricInput label="Tool usage" placeholder="Excel, SQL, Python" icon={<Database className="w-4 h-4" />} description="Software tools required" />
              <MetricInput label="Tool cost" placeholder="0.00" icon={<Banknote className="w-4 h-4" />} description="Estimated implementation cost (THB)" />
            </div>
          </div>
          {/* Section 4: Attachments */}
          <div className="p-8 md:p-12 space-y-10 bg-[#00338D]/[0.02] border-t border-slate-100">
            <SectionHeader icon={<ShieldCheck className="w-5 h-5" />} title="Compliance & Support Documents" />
            <div className="grid grid-cols-1 gap-5">
              <div className="group flex flex-col sm:flex-row items-start sm:items-center justify-between p-6 bg-white rounded-3xl border border-slate-100 shadow-sm hover:shadow-md transition-all duration-300 gap-4">
                <div className="flex items-center gap-4">
                  <div className="h-12 w-12 rounded-2xl bg-blue-50 flex items-center justify-center text-[#00338D]">
                    <ShieldCheck className="w-6 h-6" />
                  </div>
                  <div className="space-y-0.5">
                    <p className="font-black text-slate-800 tracking-tight">Data Privacy Policy</p>
                    <p className="text-xs text-slate-400 font-medium normal-case">Review our compliance guidelines</p>
                  </div>
                </div>
                <Button variant="ghost" className="rounded-xl font-bold gap-2 text-[#00338D] hover:bg-blue-50" onClick={(e) => { e.preventDefault(); window.open('#', '_blank'); }}>
                  View Documentation <ExternalLink className="w-4 h-4" />
                </Button>
              </div>
              <FileUploadRow id="risk-up" label="Risk Assessment" fileName={riskFileName} onChange={(e) => handleFileChange(e, setRiskFileName)} />
              <FileUploadRow id="mock-up" label="Visual Mockup / Workflow" fileName={mockupFileName} onChange={(e) => handleFileChange(e, setMockupFileName)} />
            </div>
          </div>
        </form>
      </CardContent>
      <CardFooter className="bg-white p-10 flex flex-col sm:flex-row justify-between items-center gap-6 border-t border-slate-100">
        <p className="text-xs font-bold text-slate-400 italic"></p>
        <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
          <Button variant="ghost" className="px-8 h-14 rounded-2xl text-slate-500 font-bold hover:bg-slate-100 transition-all">
            <Save className="w-4 h-4 mr-2" /> Save Draft
          </Button>
          <Button className="px-10 h-14 rounded-2xl bg-[#00338D] hover:bg-[#002b7a] font-black shadow-[0_15px_30px_rgba(0,51,141,0.25)] text-white transition-all transform hover:-translate-y-1 active:scale-95">
            Submit Request <ArrowRight className="w-4 h-4 ml-2" />
          </Button>
        </div>
      </CardFooter>
    </Card>
    );
}