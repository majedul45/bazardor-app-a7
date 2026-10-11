'use client';
import { useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { authClient } from '@/lib/auth-client';
import toast from '@/lib/toast';
export default function RequireAuth({children}){const {data:session,isPending}=authClient.useSession();const router=useRouter();const pathname=usePathname();useEffect(()=>{if(!isPending&&!session){toast.error('এই পেজটি দেখতে আগে সাইন ইন করুন');router.replace(`/signin?redirect=${encodeURIComponent(pathname)}`)}},[isPending,session,router,pathname]);if(isPending||!session)return <div className="container page-wrap"><div className="skeleton" style={{height:36,width:'45%',marginBottom:20}}/><div className="skeleton" style={{height:300}}/></div>;return <>{children}</>}
