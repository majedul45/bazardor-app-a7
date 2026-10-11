'use client';

import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { useState } from 'react';
import toast from '@/lib/toast';
import { authClient } from '@/lib/auth-client';
import { Github, Chrome, LoaderCircle } from '@/components/Icons';

export default function AuthForm({ mode }) {
  const signup = mode === 'signup';
  const router = useRouter();
  const params = useSearchParams();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [busy, setBusy] = useState(false);
  const redirect = params.get('redirect') || '/';
  const safeRedirect = redirect.startsWith('/') && !redirect.startsWith('//') ? redirect : '/';

  async function submit(e) {
    e.preventDefault();
    const normalizedEmail = email.trim().toLowerCase();

    if (signup && !name.trim()) return toast.error('আপনার নাম লিখুন');
    if (!normalizedEmail || !password) return toast.error('ইমেইল ও পাসওয়ার্ড দিন');
    if (signup && password.length < 8) return toast.error('পাসওয়ার্ড কমপক্ষে ৮ অক্ষরের হতে হবে');
    if (signup && password !== confirmPassword) return toast.error('দুটি পাসওয়ার্ড মিলছে না');

    setBusy(true);
    try {
      if (signup) {
        const res = await authClient.signUp.email({
          name: name.trim(),
          email: normalizedEmail,
          password,
        });
        if (res?.error) throw new Error(res.error.message || 'রেজিস্ট্রেশন করা যায়নি');

        // Better Auth signs the user in after a successful signup by default.
        // Do not immediately sign out: that extra request could fail and make a
        // successful registration look like a failed one.
        toast.success('অ্যাকাউন্ট তৈরি হয়েছে');
        router.replace(safeRedirect);
      } else {
        const res = await authClient.signIn.email({
          email: normalizedEmail,
          password,
        });
        if (res?.error) throw new Error(res.error.message || 'সাইন ইন করা যায়নি');
        toast.success('সফলভাবে সাইন ইন হয়েছে');
        router.replace(safeRedirect);
      }
      router.refresh();
    } catch (err) {
      toast.error(err?.message || (signup ? 'অ্যাকাউন্ট তৈরি করা যায়নি' : 'সাইন ইন করা যায়নি'));
    } finally {
      setBusy(false);
    }
  }

  async function social(provider) {
    setBusy(true);
    try {
      const result = await authClient.signIn.social({
        provider,
        callbackURL: safeRedirect,
        errorCallbackURL: '/signin',
      });
      if (result?.error) throw new Error(result.error.message || `${provider} login failed`);
    } catch (err) {
      toast.error(err?.message || `${provider} লগইন ব্যর্থ হয়েছে। OAuth configuration পরীক্ষা করুন।`);
      setBusy(false);
    }
  }

  return (
    <section className={`auth-page ${signup ? 'auth-page-signup' : 'auth-page-signin'}`}>
      <header className="auth-page-heading">
        <h1>{signup ? 'অ্যাকাউন্ট তৈরি করুন' : 'সাইন ইন'}</h1>
        <p>{signup ? 'বিনা খরচে সাইন আপ করে সব বিস্তারিত দাম দেখুন।' : 'বিস্তারিত দাম, বাজার তুলনা ও প্রোফাইল দেখতে অ্যাকাউন্টে ঢুকুন।'}</p>
      </header>
      <div className="auth-shell">
        <div className="auth-card">
          <form onSubmit={submit}>
            {signup && <div className="field">
              <label htmlFor="name">নাম</label>
              <input id="name" autoComplete="name" value={name} onChange={e => setName(e.target.value)} placeholder="আপনার পূর্ণ নাম লিখুন" required />
            </div>}
            <div className="field">
              <label htmlFor="email">ইমেইল</label>
              <input id="email" type="email" autoComplete="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="name@example.com" required />
            </div>
            <div className="field">
              <label htmlFor="password">পাসওয়ার্ড</label>
              <input id="password" type="password" autoComplete={signup ? 'new-password' : 'current-password'} value={password} onChange={e => setPassword(e.target.value)} placeholder="কমপক্ষে ৮ অক্ষর" minLength={8} required />
            </div>
            {signup && <div className="field">
              <label htmlFor="confirmPassword">পাসওয়ার্ড নিশ্চিত করুন</label>
              <input id="confirmPassword" type="password" autoComplete="new-password" value={confirmPassword} onChange={e => setConfirmPassword(e.target.value)} placeholder="একই পাসওয়ার্ড আবার লিখুন" minLength={8} required aria-describedby="password-match-hint" />
              <small id="password-match-hint" className={confirmPassword && password !== confirmPassword ? 'password-match-error' : 'password-match-hint'}>
                {confirmPassword ? (password === confirmPassword ? 'পাসওয়ার্ড মিলেছে' : 'পাসওয়ার্ড দুটি মিলছে না') : 'নিশ্চিত করার জন্য পাসওয়ার্ডটি আবার লিখুন'}
              </small>
            </div>}
            <button className="btn btn-primary full auth-submit" disabled={busy} type="submit">
              {busy && <LoaderCircle size={16} className="animate-spin" />}
              {signup ? 'অ্যাকাউন্ট তৈরি করুন' : 'সাইন ইন'}
            </button>
          </form>
          <div className="auth-sep">অথবা চালিয়ে যান</div>
          <div className="social-row">
            <button className="social-btn" disabled={busy} onClick={() => social('google')} type="button"><Chrome size={17} /> Google</button>
            <button className="social-btn" disabled={busy} onClick={() => social('github')} type="button"><Github size={17} /> GitHub</button>
          </div>
          <p className="auth-switch">{signup ? 'আগেই অ্যাকাউন্ট আছে?' : 'অ্যাকাউন্ট নেই?'} <Link href={signup ? '/signin' : '/signup'}>{signup ? 'সাইন ইন' : 'অ্যাকাউন্ট তৈরি করুন'}</Link></p>
        </div>
      </div>
      <Link href="/" className="auth-home-link">← হোম পেজে ফিরে যান</Link>
    </section>
  );
}
