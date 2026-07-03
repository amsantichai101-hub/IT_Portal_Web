import React from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { RadioGroupItem } from "@/components/ui/radio-group";
import { Upload, CheckCircle2, ArrowRight } from "lucide-react";

export function SectionHeader({ icon, title }: { icon: React.ReactNode, title: string }) {
  return (
    <div className="flex items-center gap-4">
      <div className="h-10 w-10 rounded-xl bg-[#00338D] text-white flex items-center justify-center shadow-lg shadow-blue-200">
        {icon}
      </div>
      <h2 className="text-2xl font-black text-slate-800 tracking-tighter">{title}</h2>
      <div className="h-[2px] flex-grow bg-slate-100 hidden md:block ml-4 rounded-full"></div>
    </div>
  );
}

export function CustomLabel({ 
  children, 
  htmlFor, 
  notRequired = false // ค่าเริ่มต้นคือ false (แปลว่าปกติจะ 'ต้องใส่' หรือ 'โชว์ *')
}: { 
  children: React.ReactNode, 
  htmlFor?: string,
  notRequired?: boolean 
}) {
  return (
    <Label htmlFor={htmlFor} className="text-[15px] font-black tracking-tight text-slate-600 ml-1 flex items-center gap-1">
      {children}
      
      {/* Logic: ถ้า NOT notRequired (ไม่ใช่ตัวที่ไม่ต้องการ) ให้โชว์ดอกจัน */}
      {!notRequired && (
        <span className="text-red-500 font-bold">*</span>
      )}
    </Label>
  );
}

// 2. ปรับสี description ใน MetricInput เป็นสีแดง
export function MetricInput({ label, placeholder, icon, description }: { label: string, placeholder: string, icon: React.ReactNode, description: string }) {
  return (
    <div className="group space-y-3">
      <CustomLabel>{label}</CustomLabel>
      <div className="flex flex-col md:flex-row md:items-center gap-4">
        <div className="relative flex-grow">
          <div className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-[#00338D] transition-colors">{icon}</div>
          <Input placeholder={placeholder} className="pl-14 h-14 rounded-2xl border-slate-200 focus:ring-4 focus:ring-blue-50 focus:border-[#00338D] outline-none transition-all duration-300" />
        </div>
        
        {/* แก้ไขตรงนี้: ใส่ text-red-500 ที่ div หุ้ม เพื่อให้ลูกศรเปลี่ยนสีตามไปด้วย */}
        <div className="flex items-center gap-2 md:w-64 px-2 text-red-500">
           <ArrowRight className="w-3 h-3 transition-colors" /> {/* ไม่ต้องใส่ text-slate-300 แล้ว */}
           <span className="text-[11px] font-bold tracking-tighter">
             {description}
           </span>
        </div>
      </div>
    </div>
  );
}

// ส่วนอื่นๆ เหมือนเดิม (หรือเพิ่ม CustomLabel ไปใช้ในส่วนที่ยังไม่มี)
export function FileUploadRow({ id, label, fileName, onChange }: { id: string, label: string, fileName: string | null, onChange: (e: React.ChangeEvent<HTMLInputElement>) => void }) {
  return (
    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-6 bg-white rounded-3xl border border-slate-100 shadow-sm transition-all duration-300 hover:border-blue-200 gap-4">
      <div className="flex items-center gap-4">
        <div className={`h-12 w-12 rounded-2xl flex items-center justify-center transition-colors ${fileName ? 'bg-green-50 text-green-600' : 'bg-slate-50 text-slate-400'}`}>
          <Upload className="w-5 h-5" />
        </div>
        <div className="space-y-0.5">
          {/* ใช้ CustomLabel เพื่อให้มี * เหมือนกัน */}
          <p className="font-black text-slate-800 tracking-tight flex items-center gap-1">
            {label} <span className="text-red-500">*</span>
          </p>
          {fileName ? (
            <div className="flex items-center gap-2 text-[11px] text-green-600 font-black"><CheckCircle2 className="w-3.5 h-3.5" /> {fileName}</div>
          ) : (
            <p className="text-[11px] text-slate-400 font-bold uppercase tracking-widest">Format: PDF, JPG, PNG</p>
          )}
        </div>
      </div>
      <div className="w-full sm:w-auto">
        <input type="file" id={id} className="hidden" onChange={onChange} />
        <label htmlFor={id} className={`flex items-center justify-center gap-2 h-12 px-8 rounded-2xl border-2 border-dashed transition-all cursor-pointer font-extrabold text-sm ${fileName ? 'border-green-200 bg-green-50/50 text-green-700 hover:bg-green-100' : 'border-slate-200 text-slate-500 hover:border-[#00338D] hover:bg-blue-50 hover:text-[#00338D]'}`}>
          {fileName ? "Update File" : "Select Document"}
        </label>
      </div>
    </div>
  );
}

export function StyledRadio({ id, value, label }: { id: string, value: string, label: string }) {
  return (
    <div className="relative group">
      <RadioGroupItem value={value} id={id} className="peer sr-only" />
      <Label htmlFor={id} className="flex items-center justify-between px-5 h-14 bg-white border border-slate-200 rounded-2xl cursor-pointer transition-all duration-200 peer-data-[state=checked]:border-[#00338D] peer-data-[state=checked]:border-2 peer-data-[state=checked]:bg-blue-50/30 group-hover:border-slate-300">
        <span className="font-bold text-slate-800 leading-none select-none">{label}</span>
        <div className="flex-shrink-0 w-5 h-5 border-2 border-slate-200 rounded-full flex items-center justify-center transition-all peer-data-[state=checked]:border-[#00338D] bg-white">
          <div className="w-2.5 h-2.5 bg-[#00338D] rounded-full opacity-0 scale-0 transition-all duration-200 peer-data-[state=checked]:opacity-100 peer-data-[state=checked]:scale-100" />
        </div>
      </Label>
    </div>
  );
}

export function PlatformCheckbox({ id, label }: { id: string, label: string }) {
  return (
    <label 
      htmlFor={id} 
      className="group relative flex items-center justify-between p-5 h-14 bg-white border border-slate-200 rounded-2xl cursor-pointer transition-all duration-300 hover:border-[#00338D] has-[:checked]:border-[#00338D] has-[:checked]:border-2 has-[:checked]:bg-blue-50/30"
    >
      <span className="text-[15px] font-bold text-slate-800 leading-none select-none">{label}</span>
      <div className="flex items-center">
        <Checkbox 
          id={id} 
          className="h-5 w-5 rounded-full border-slate-200 data-[state=checked]:bg-white data-[state=checked]:text-[#00338D] data-[state=checked]:border-[#00338D] data-[state=checked]:border-2" 
        />
      </div>
    </label>
  );
}