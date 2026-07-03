"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function Rootpage(){
  const router = useRouter();
  useEffect(()=> {
    router.replace("/dashboard");
  }, [router]);

  return (
    <div className=" min-h-screen bg-slate-950 flex items-center justify-center">
      <div className=" w-5 h-5 border-2 border-emerald-400 border-t-transparent rounded-full animate-spin"/>
    </div>
  );
}