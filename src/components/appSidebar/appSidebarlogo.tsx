"use client";

import Image from "next/image";
import Link from "next/link";
import { useSidebar } from "../ui/sidebar";
import kpmgLogo from "@/../public/assets/kpmglogo.png";

export function BrandLogo() {
  const { state } = useSidebar();
  const isExpanded = state === "expanded";

  return (
    <Link href={"/"} className="w-full">
      <div className={`flex items-center justify-center transition-all duration-300 hover:scale-110 w-full ${
        !isExpanded 
          ? 'py-5 px-0' // เมื่อพับ: จัดกึ่งกลาง Logo ตัวเดียว
          : 'py-3 px-4 gap-4' // เมื่อกาง: จัดกึ่งกลางกลุ่ม Logo + ข้อความ
      }`}>
        
        {/* Logo Container */}
        <div className="flex-shrink-0 transition-all duration-300 flex items-center justify-center">
          <Image
            src={kpmgLogo}
            width={isExpanded ? 70 : 35} 
            height={isExpanded ? 70 : 35}
            alt="kpmg logo"
            className="object-contain"
          />
        </div>

        {/* Group: Line + Text (แสดงเฉพาะตอนกาง) */}
        {isExpanded && (
          <div className="flex items-center gap-4 animate-in fade-in zoom-in-95 duration-300">
            {/* เส้นคั่นแนวตั้ง: จัดวางให้กึ่งกลางแนวตั้งด้วย items-center ของ div พ่อ */}
            <div className="h-7 w-[2px] bg-white/80 flex-shrink-0" />
            
            <div className="flex flex-col justify-center leading-tight whitespace-nowrap">
              <span className="text-white text-sm font-semibold tracking-widest text-left">
                IT Portal
              </span>
              <span className="text-white/90 text-[12px] font-light tracking-[0.1em] text-left">
                System
              </span>
            </div>
          </div>
        )}
      </div>
    </Link>
  );
}