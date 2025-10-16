export default function AuthLayout({ children, title = "Authentication" }) {
  return (
    <div style={{minHeight:"100vh",display:"grid",placeItems:"center",background:"#eef2f7"}}>
      <div style={{width:"min(420px, 92vw)",background:"#fff",border:"1px solid #e5e7eb",borderRadius:12,padding:24,boxShadow:"0 10px 26px rgba(0,0,0,.08)"}}>
        {title && <h1 style={{margin:"0 0 12px",fontSize:20,fontWeight:700}}>{title}</h1>}
        {children}
      </div>
    </div>
  );
}
