'use client';
import React from 'react';
function Base({children,size=18,className='',...props}){return <svg aria-hidden="true" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className={className} {...props}>{children}</svg>}
export function ArrowRight(p){return <Base {...p}><path d="M5 12h14M12 5l7 7-7 7"/></Base>}
export function ChevronDown({className='',...p}){return <Base className={className} {...p}><path d="m6 9 6 6 6-6"/></Base>}
export function LogOut(p){return <Base {...p}><path d="M10 17l5-5-5-5M15 12H3"/><path d="M12 3h6a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-6"/></Base>}
export function UserRound(p){return <Base {...p}><circle cx="12" cy="8" r="4"/><path d="M5 21a7 7 0 0 1 14 0"/></Base>}
export function Github(p){return <Base {...p}><path d="M9 19c-4.3 1.4-4.3-2.5-6-3m12 6v-3.9a3.4 3.4 0 0 0-.9-2.7c3-.3 6.1-1.5 6.1-6.7a5.2 5.2 0 0 0-1.4-3.6 4.8 4.8 0 0 0-.1-3.6S17.5 1.2 15 3a13.4 13.4 0 0 0-7 0C5.5 1.2 3.3 1.5 3.3 1.5a4.8 4.8 0 0 0-.1 3.6A5.2 5.2 0 0 0 1.8 8.7c0 5.2 3.1 6.4 6.1 6.7A3.4 3.4 0 0 0 7 18.1V22"/></Base>}
export function Chrome(p){return <Base {...p}><circle cx="12" cy="12" r="10"/><circle cx="12" cy="12" r="4"/><path d="M2.5 7h9.5M8.5 21l4.7-8.2M21.5 7l-4.8 8.3"/></Base>}
export function LoaderCircle({className='',...p}){return <Base className={className} {...p}><path d="M21 12a9 9 0 1 1-6.2-8.6"/></Base>}
