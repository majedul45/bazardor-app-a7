/* eslint react-hooks/set-state-in-effect: off */
'use client';
import { useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import { LogOut } from '@/components/Icons';
import { authClient } from '@/lib/auth-client';
import toast from '@/lib/toast';

export default function ProfilePage() {
  const { data: session, isPending } = authClient.useSession();
  const router = useRouter();
  const fileInputRef = useRef(null);
  const lastSavedName = useRef('');
  const [name, setName] = useState('');
  const [busy, setBusy] = useState(false);
  const [photoBusy, setPhotoBusy] = useState(false);
  const [previewImage, setPreviewImage] = useState('');

  // Synchronize editable profile fields when the remote session first becomes available.
  useEffect(() => {
    if (session?.user) {
      const savedName = session.user.name || '';
      setName(savedName);
      lastSavedName.current = savedName;
    }
    if (!isPending && !session) {
      toast.error('প্রোফাইল দেখতে আগে সাইন ইন করুন');
      router.replace('/signin?redirect=/profile');
    }
  }, [isPending, session, router]);

  if (isPending || !session) {
    return <main className="profile-page"><div className="profile-container profile-loading">লোড হচ্ছে…</div></main>;
  }

  const user = session.user || {};
  const currentImage = previewImage || user.image || '';
  const initial = (user.name || user.email || 'U').trim().charAt(0).toUpperCase();

  async function saveName() {
    const nextName = name.trim();
    if (!nextName) {
      toast.error('আপনার নাম খালি রাখা যাবে না');
      setName(lastSavedName.current);
      return;
    }
    if (nextName === lastSavedName.current || busy) return;

    setBusy(true);
    try {
      const result = await authClient.updateUser({ name: nextName });
      if (result?.error) throw new Error(result.error.message || 'নাম আপডেট করা যায়নি');
      lastSavedName.current = nextName;
      setName(nextName);
      toast.success('নাম আপডেট হয়েছে');
      router.refresh();
    } catch (error) {
      setName(lastSavedName.current);
      toast.error(error?.message || 'নাম আপডেট করা যায়নি');
    } finally {
      setBusy(false);
    }
  }

  function choosePhoto(event) {
    const input = event.target;
    const file = input.files?.[0];
    if (!file) return;
    if (!file.type.startsWith('image/')) {
      toast.error('একটি image file নির্বাচন করুন');
      input.value = '';
      return;
    }
    if (file.size > 2 * 1024 * 1024) {
      toast.error('ছবির সাইজ ২ MB-এর মধ্যে রাখুন');
      input.value = '';
      return;
    }

    const reader = new FileReader();
    reader.onload = async () => {
      const image = String(reader.result || '');
      if (!image) {
        toast.error('ছবিটি পড়া যায়নি');
        input.value = '';
        return;
      }
      setPreviewImage(image);
      setPhotoBusy(true);
      try {
        const result = await authClient.updateUser({ image });
        if (result?.error) throw new Error(result.error.message || 'প্রোফাইল ছবি আপডেট করা যায়নি');
        toast.success('প্রোফাইল ছবি আপডেট হয়েছে');
        router.refresh();
      } catch (error) {
        setPreviewImage('');
        toast.error(error?.message || 'প্রোফাইল ছবি আপডেট করা যায়নি');
      } finally {
        setPhotoBusy(false);
        input.value = '';
      }
    };
    reader.onerror = () => {
      toast.error('ছবিটি পড়া যায়নি');
      input.value = '';
    };
    reader.readAsDataURL(file);
  }

  async function signOut() {
    setBusy(true);
    try {
      const result = await authClient.signOut();
      if (result?.error) throw new Error(result.error.message || 'সাইন আউট করা যায়নি');
      toast.success('সাইন আউট হয়েছে');
      router.replace('/signin');
      router.refresh();
    } catch (error) {
      toast.error(error?.message || 'সাইন আউট করা যায়নি');
    } finally {
      setBusy(false);
    }
  }

  return (
    <main className="profile-page">
      <div className="profile-container">
        <header className="profile-heading">
          <h1>আমার প্রোফাইল</h1>
          <p>আপনার অ্যাকাউন্টের তথ্য দেখুন ও পরিবর্তন করুন।</p>
        </header>

        <section className="profile-summary-card" aria-label="অ্যাকাউন্টের পরিচিতি">
          <button type="button" className="profile-user-avatar profile-photo-button" onClick={() => fileInputRef.current?.click()} aria-label="ছবি পরিবর্তন করতে ক্লিক করুন" title="ছবি পরিবর্তন করতে ক্লিক করুন" disabled={photoBusy}>
            {currentImage ? <img src={currentImage} alt="প্রোফাইল ছবি" /> : <span>{initial}</span>}
          </button>
          <input ref={fileInputRef} className="profile-file-input" type="file" accept="image/*" onChange={choosePhoto} />
          <div className="profile-user-copy">
            <h2>{user.name || 'নাম দেওয়া হয়নি'}</h2>
            <p>{user.email}</p>
          </div>
          <div className="profile-summary-actions">
            <button type="button" className="profile-signout-btn" onClick={signOut} disabled={busy || photoBusy}><LogOut size={14} /> সাইন আউট</button>
          </div>
        </section>

        <section className="profile-info-card">
          <div className="profile-info-heading"><h2>তথ্য</h2></div>
          <div className="profile-info-form">
            <label htmlFor="profile-name">নাম</label>
            <input
              id="profile-name"
              className="profile-name-input"
              value={name}
              onChange={event => setName(event.target.value)}
              onKeyDown={event => { if (event.key === 'Enter') event.currentTarget.blur(); }}
              maxLength={80}
              required
              placeholder="আপনার নাম লিখুন"
              disabled={busy}
            />
            <button type="button" className="profile-save-btn" onClick={saveName} disabled={busy || photoBusy}>{busy ? 'সংরক্ষণ হচ্ছে…' : 'আপডেট'}</button>
          </div>
        </section>
      </div>
    </main>
  );
}
