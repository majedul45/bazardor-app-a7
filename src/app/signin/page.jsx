import { Suspense } from 'react';
import AuthForm from '@/components/AuthForm';
export default function SignInPage(){return <Suspense fallback={<div className="container page-wrap">লোড হচ্ছে…</div>}><AuthForm mode="signin"/></Suspense>}
