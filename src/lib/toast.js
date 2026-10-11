function show(type, message){if(typeof window!=='undefined')window.dispatchEvent(new CustomEvent('bazardor-toast',{detail:{type,message}}))}
const toast={success:(message)=>show('success',message),error:(message)=>show('error',message)};
export default toast;
