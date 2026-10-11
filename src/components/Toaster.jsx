'use client';
import { useEffect, useState } from 'react';
export default function Toaster(){
 const [items,setItems]=useState([]);
 useEffect(()=>{const handler=(event)=>{const id=Date.now()+Math.random();setItems(current=>[...current,{id,type:event.detail?.type||'success',message:String(event.detail?.message||'')}].slice(-4));setTimeout(()=>setItems(current=>current.filter(item=>item.id!==id)),3500)};window.addEventListener('bazardor-toast',handler);return()=>window.removeEventListener('bazardor-toast',handler)},[]);
 return <div className="toast-stack" aria-live="polite">{items.map(item=><div className={`toast-item toast-${item.type}`} key={item.id}>{item.message}</div>)}</div>
}
