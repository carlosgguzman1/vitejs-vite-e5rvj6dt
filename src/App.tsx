import { useState, useRef } from "react";

const T = {
  bg: "#050D1A", card: "#0A1628", card2: "#0D1E35",
  teal: "#00C2D4", tealDim: "rgba(0,194,212,0.10)", tealBorder: "rgba(0,194,212,0.28)",
  gold: "#C9A84C", goldDim: "rgba(201,168,76,0.10)", goldBorder: "rgba(201,168,76,0.28)",
  green: "#4ecca3", greenDim: "rgba(78,204,163,0.10)", greenBorder: "rgba(78,204,163,0.3)",
  wa: "#25D366", waDim: "rgba(37,211,102,0.10)", waBorder: "rgba(37,211,102,0.3)",
  red: "#ff6b6b", redDim: "rgba(255,107,107,0.10)", redBorder: "rgba(255,107,107,0.28)",
  purple: "#a78bfa", purpleDim: "rgba(167,139,250,0.10)", purpleBorder: "rgba(167,139,250,0.28)",
  text: "#E0F4FF", muted: "rgba(224,244,255,0.50)", dim: "rgba(224,244,255,0.22)",
  border: "rgba(255,255,255,0.07)",
};

const WA_NUMBER = "19392901222";

const MEDS = [
  { nombre: "Crema Hidrocortisona 1%", categoria: "Dermatológico", precio: 45, unidad: "30g" },
  { nombre: "Crema Hidrocortisona 2.5%", categoria: "Dermatológico", precio: 65, unidad: "30g" },
  { nombre: "Ungüento Betametasona 0.05%", categoria: "Dermatológico", precio: 75, unidad: "30g" },
  { nombre: "Solución Minoxidil 5%", categoria: "Capilar", precio: 120, unidad: "60ml" },
  { nombre: "Solución Minoxidil 10%", categoria: "Capilar", precio: 180, unidad: "60ml" },
  { nombre: "Gel Diclofenaco 1%", categoria: "Antiinflamatorio", precio: 55, unidad: "50g" },
  { nombre: "Crema Tretinoína 0.025%", categoria: "Dermatológico", precio: 95, unidad: "30g" },
  { nombre: "Crema Tretinoína 0.05%", categoria: "Dermatológico", precio: 115, unidad: "30g" },
  { nombre: "Cápsulas Progesterona 100mg", categoria: "Hormonal", precio: 180, unidad: "30 cáps" },
  { nombre: "Cápsulas Progesterona 200mg", categoria: "Hormonal", precio: 280, unidad: "30 cáps" },
  { nombre: "Gel Testosterona 1%", categoria: "Hormonal", precio: 220, unidad: "50g" },
  { nombre: "Ketoconazol Crema 2%", categoria: "Antimicótico", precio: 85, unidad: "30g" },
  { nombre: "Otra / Fórmula especial", categoria: "Especial", precio: 0, unidad: "" },
];

const makeWALink = (number, msg) => `https://wa.me/${number}?text=${encodeURIComponent(msg)}`;

const WAIcon = ({ size = 18 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
  </svg>
);

const Card = ({ children, style }) => (
  <div style={{ background: T.card, border: `1px solid ${T.border}`, borderRadius: 14, padding: 24, ...style }}>{children}</div>
);

const Label = ({ children, required }) => (
  <div style={{ fontSize: 11, letterSpacing: "1.5px", color: T.muted, marginBottom: 7, textTransform: "uppercase", fontFamily: "sans-serif" }}>
    {children}{required && <span style={{ color: T.red }}> *</span>}
  </div>
);

const FInput = ({ label, value, onChange, placeholder, type = "text", required }) => (
  <div style={{ marginBottom: 16 }}>
    {label && <Label required={required}>{label}</Label>}
    <input type={type} value={value} onChange={e => onChange(e.target.value)} placeholder={placeholder}
      style={{ width: "100%", padding: "11px 14px", background: "rgba(255,255,255,0.04)", border: `1px solid ${T.border}`, borderRadius: 8, color: T.text, fontSize: 14, outline: "none", boxSizing: "border-box", fontFamily: "sans-serif" }}
      onFocus={e => e.target.style.borderColor = T.tealBorder}
      onBlur={e => e.target.style.borderColor = T.border} />
  </div>
);

const Btn = ({ children, onClick, color = T.teal, style, disabled, variant = "solid", size = "md" }) => {
  const pad = size === "lg" ? "14px 32px" : size === "sm" ? "8px 18px" : "11px 24px";
  return (
    <button onClick={onClick} disabled={disabled} style={{
      padding: pad, borderRadius: 9, border: variant === "outline" ? `1px solid ${color}` : "none",
      background: variant === "outline" ? "transparent" : disabled ? "rgba(255,255,255,0.08)" : color,
      color: variant === "outline" ? color : disabled ? T.muted : "#050D1A",
      fontSize: size === "lg" ? 15 : 13, fontWeight: 700, cursor: disabled ? "not-allowed" : "pointer",
      opacity: disabled ? 0.6 : 1, fontFamily: "sans-serif", letterSpacing: "0.5px",
      transition: "all 0.15s", ...style
    }}>{children}</button>
  );
};

const Badge = ({ children, color = T.teal }) => (
  <span style={{ display: "inline-block", padding: "3px 10px", borderRadius: 20, fontSize: 11, fontWeight: 600, background: `${color}20`, color, border: `1px solid ${color}44`, fontFamily: "sans-serif" }}>{children}</span>
);

const Progress = ({ steps, current, color = T.teal }) => (
  <div style={{ display: "flex", gap: 6, marginBottom: 28 }}>
    {steps.map((s, i) => (
      <div key={s} style={{ flex: 1 }}>
        <div style={{ height: 3, background: i <= current ? color : T.border, borderRadius: 2, marginBottom: 6, transition: "background 0.3s" }} />
        <div style={{ fontSize: 10, color: i === current ? color : i < current ? T.green : T.muted, fontFamily: "sans-serif", fontWeight: i === current ? 700 : 400 }}>
          {i < current ? "✓ " : ""}{s}
        </div>
      </div>
    ))}
  </div>
);

const PhotoUpload = ({ label, photo, setPhoto, hint }) => {
  const ref = useRef();
  const handleFile = (file) => {
    if (!file || !file.type.startsWith("image/")) return;
    const reader = new FileReader();
    reader.onload = e => setPhoto({ url: e.target.result, name: file.name });
    reader.readAsDataURL(file);
  };
  return (
    <div style={{ marginBottom: 20 }}>
      {label && <Label>{label}</Label>}
      {!photo ? (
        <div onClick={() => ref.current.click()}
          onDrop={e => { e.preventDefault(); handleFile(e.dataTransfer.files[0]); }}
          onDragOver={e => e.preventDefault()}
          style={{ border: `2px dashed ${T.tealBorder}`, borderRadius: 12, padding: "32px 20px", textAlign: "center", cursor: "pointer", background: T.tealDim }}
          onMouseEnter={e => e.currentTarget.style.borderColor = T.teal}
          onMouseLeave={e => e.currentTarget.style.borderColor = T.tealBorder}>
          <div style={{ fontSize: 40, marginBottom: 10 }}>📷</div>
          <div style={{ fontSize: 14, fontWeight: 600, color: T.text, fontFamily: "sans-serif", marginBottom: 6 }}>Toca para subir la foto de receta</div>
          <div style={{ fontSize: 12, color: T.muted, fontFamily: "sans-serif" }}>{hint || "JPG, PNG o HEIC"}</div>
          <input ref={ref} type="file" accept="image/*" capture="environment" onChange={e => handleFile(e.target.files[0])} style={{ display: "none" }} />
        </div>
      ) : (
        <div style={{ borderRadius: 12, overflow: "hidden", border: `1px solid ${T.greenBorder}` }}>
          <img src={photo.url} alt="Receta" style={{ width: "100%", maxHeight: 260, objectFit: "cover", display: "block" }} />
          <div style={{ padding: "10px 14px", background: T.greenDim, display: "flex", alignItems: "center", gap: 8 }}>
            <span style={{ fontSize: 13, color: T.green, fontFamily: "sans-serif", fontWeight: 600 }}>✅ {photo.name}</span>
            <button onClick={() => setPhoto(null)} style={{ marginLeft: "auto", background: "none", border: "none", color: T.muted, fontSize: 12, cursor: "pointer", fontFamily: "sans-serif" }}>✕ Cambiar</button>
          </div>
        </div>
      )}
    </div>
  );
};

const Done = ({ orderId, tipo, tel, onNueva }) => (
  <div style={{ maxWidth: 500, margin: "0 auto", textAlign: "center", padding: "60px 20px" }}>
    <div style={{ fontSize: 72, marginBottom: 20 }}>✅</div>
    <div style={{ fontSize: 26, fontWeight: 700, color: T.green, fontFamily: "sans-serif", marginBottom: 10 }}>¡Enviado!</div>
    <div style={{ fontSize: 14, color: T.muted, fontFamily: "sans-serif", marginBottom: 6 }}>ID: <span style={{ color: T.teal, fontWeight: 700 }}>{orderId}</span></div>
    <div style={{ fontSize: 13, color: T.muted, fontFamily: "sans-serif", marginBottom: 32, lineHeight: 1.7 }}>
      Farmacia Mia recibió tu {tipo === "medico" ? "orden" : "receta"}.<br />
      Te contactamos al <span style={{ color: T.text }}>{tel}</span> para confirmar.
    </div>
    <Card style={{ border: `1px solid ${T.waBorder}`, textAlign: "left", marginBottom: 24 }}>
      <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 8 }}>
        <WAIcon /><div style={{ fontSize: 14, fontWeight: 700, color: T.wa, fontFamily: "sans-serif" }}>¿Tienes foto de receta para adjuntar?</div>
      </div>
      <div style={{ fontSize: 13, color: T.muted, fontFamily: "sans-serif", lineHeight: 1.6 }}>
        Si no pudiste subir la foto, abre el chat de WhatsApp que se generó y adjunta la foto directo ahí.
      </div>
    </Card>
    <Btn onClick={onNueva} variant="outline" color={T.teal}>+ Nueva solicitud</Btn>
  </div>
);

// ═══════════ PORTAL MÉDICO ═══════════
const PortalMedico = ({ onBack }) => {
  const [step, setStep] = useState(0);
  const [done, setDone] = useState(false);
  const [orderId] = useState(`FM-M-${Date.now().toString().slice(-6)}`);
  const [med, setMed] = useState({ nombre:"", especialidad:"", licencia:"", tel:"", email:"", clinica:"" });
  const [pac, setPac] = useState({ nombre:"", dob:"", seguro:"", seguroNum:"", alergias:"", tel:"" });
  const [foto, setFoto] = useState(null);
  const [items, setItems] = useState([{ med:"", cantidad:1, instrucciones:"", urgente:false, especial:"" }]);
  const [notas, setNotas] = useState("");
  const [urgente, setUrgente] = useState(false);

  const addItem = () => setItems([...items, { med:"", cantidad:1, instrucciones:"", urgente:false, especial:"" }]);
  const updItem = (i,f,v) => { const n=[...items]; n[i][f]=v; setItems(n); };
  const remItem = (i) => items.length > 1 && setItems(items.filter((_,x)=>x!==i));
  const total = items.reduce((a,it) => { const m=MEDS.find(m=>m.nombre===it.med); return a+(m?m.precio*it.cantidad:0); }, 0);

  const canNext = [med.nombre&&med.licencia&&med.tel, pac.nombre&&pac.tel, items.every(i=>i.med), true][step];

  const buildMsg = () => {
    const lines = items.map((it,i) => {
      const m=MEDS.find(m=>m.nombre===it.med);
      return `  ${i+1}. ${it.med}${it.especial?` — ${it.especial}`:""}\n     Cant: ${it.cantidad}${m?.precio?` · $${(m.precio*it.cantidad).toFixed(2)}`:""}\n     Instruc: ${it.instrucciones||"Ninguna"}${it.urgente?"\n     🚨 URGENTE":""}`;
    }).join("\n\n");
    return `🏥 *NUEVA ORDEN MÉDICO — FARMACIA MIA*\nID: ${orderId}${urgente?"\n🚨 *URGENTE*":""}

👨‍⚕️ *MÉDICO*
Dr(a). ${med.nombre} | Lic: ${med.licencia}
Especialidad: ${med.especialidad||"—"} | Tel: ${med.tel}
Clínica: ${med.clinica||"—"}

🤒 *PACIENTE*
${pac.nombre} | Tel: ${pac.tel}
Nacimiento: ${pac.dob||"—"} | Seguro: ${pac.seguro||"Ninguno"}${pac.seguroNum?` #${pac.seguroNum}`:""}
Alergias: ${pac.alergias||"Ninguna conocida"}

💊 *PREPARACIONES*
${lines}

${total>0?`💰 *ESTIMADO: $${total.toFixed(2)}*\n\n`:""}📝 Notas: ${notas||"Ninguna"}${foto?"\n\n📎 *Foto de receta adjunta en este chat*":""}`;
  };

  if (done) return <Done orderId={orderId} tipo="medico" tel={med.tel} onNueva={()=>{setDone(false);setStep(0);setMed({nombre:"",especialidad:"",licencia:"",tel:"",email:"",clinica:""});setPac({nombre:"",dob:"",seguro:"",seguroNum:"",alergias:"",tel:""});setFoto(null);setItems([{med:"",cantidad:1,instrucciones:"",urgente:false,especial:""}]);setNotas("");setUrgente(false);}} />;

  return (
    <div style={{ maxWidth: 740, margin: "0 auto" }}>
      <button onClick={onBack} style={{ background:"none", border:"none", color:T.muted, fontSize:13, cursor:"pointer", fontFamily:"sans-serif", marginBottom:24, display:"flex", alignItems:"center", gap:6 }}>← Volver al inicio</button>
      <div style={{ display:"flex", alignItems:"center", gap:12, marginBottom:28 }}>
        <div style={{ width:44, height:44, borderRadius:10, background:T.tealDim, border:`1px solid ${T.tealBorder}`, display:"flex", alignItems:"center", justifyContent:"center", fontSize:22 }}>👨‍⚕️</div>
        <div>
          <div style={{ fontSize:22, fontWeight:700, color:T.text, fontFamily:"sans-serif" }}>Portal de Médicos</div>
          <div style={{ fontSize:12, color:T.teal, fontFamily:"sans-serif" }}>Enviar orden de preparación magistral</div>
        </div>
      </div>
      <Progress steps={["Médico","Paciente","Receta & Prep","Confirmar"]} current={step} color={T.teal} />

      {step===0 && (
        <Card>
          <div style={{ fontSize:16, fontWeight:700, color:T.text, marginBottom:20, fontFamily:"sans-serif" }}>👨‍⚕️ Sus Datos</div>
          <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:12 }}>
            <FInput label="Nombre completo" value={med.nombre} onChange={v=>setMed({...med,nombre:v})} placeholder="Dr. / Dra." required />
            <FInput label="Especialidad" value={med.especialidad} onChange={v=>setMed({...med,especialidad:v})} placeholder="Dermatología..." />
            <FInput label="Licencia médica" value={med.licencia} onChange={v=>setMed({...med,licencia:v})} placeholder="PR-12345" required />
            <FInput label="Teléfono / WhatsApp" value={med.tel} onChange={v=>setMed({...med,tel:v})} placeholder="787-555-0000" required type="tel" />
            <FInput label="Email" value={med.email} onChange={v=>setMed({...med,email:v})} placeholder="dr@clinica.pr" type="email" />
            <FInput label="Clínica / Hospital" value={med.clinica} onChange={v=>setMed({...med,clinica:v})} placeholder="Clínica San Juan" />
          </div>
        </Card>
      )}

      {step===1 && (
        <Card>
          <div style={{ fontSize:16, fontWeight:700, color:T.text, marginBottom:20, fontFamily:"sans-serif" }}>🤒 Datos del Paciente</div>
          <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:12 }}>
            <FInput label="Nombre del paciente" value={pac.nombre} onChange={v=>setPac({...pac,nombre:v})} placeholder="Nombre completo" required />
            <FInput label="Teléfono del paciente" value={pac.tel} onChange={v=>setPac({...pac,tel:v})} placeholder="787-555-0000" required type="tel" />
            <FInput label="Fecha de nacimiento" value={pac.dob} onChange={v=>setPac({...pac,dob:v})} type="date" />
            <div>
              <Label>Seguro médico</Label>
              <select value={pac.seguro} onChange={e=>setPac({...pac,seguro:e.target.value})} style={{ width:"100%", padding:"11px 14px", background:"rgba(255,255,255,0.04)", border:`1px solid ${T.border}`, borderRadius:8, color:T.text, fontSize:14, outline:"none", fontFamily:"sans-serif", marginBottom:16 }}>
                {["","Triple S","Plan Gobierno","Humana","Molina","MMM","MCS","Medicare","Ninguno"].map(s=><option key={s} value={s} style={{background:T.card}}>{s||"Seleccionar..."}</option>)}
              </select>
            </div>
            <div style={{ gridColumn:"1/-1" }}>
              <FInput label="Alergias conocidas" value={pac.alergias} onChange={v=>setPac({...pac,alergias:v})} placeholder="Penicilina, látex... o 'Ninguna conocida'" />
            </div>
          </div>
        </Card>
      )}

      {step===2 && (
        <div>
          <Card style={{ marginBottom:16 }}>
            <div style={{ fontSize:16, fontWeight:700, color:T.text, marginBottom:4, fontFamily:"sans-serif" }}>📷 Foto de Receta <span style={{ fontSize:12, color:T.muted, fontWeight:400 }}>(opcional)</span></div>
            <div style={{ fontSize:12, color:T.muted, marginBottom:16, fontFamily:"sans-serif" }}>Si la tienes disponible, súbela aquí. Si no, puedes enviarla directo por WhatsApp después.</div>
            <PhotoUpload photo={foto} setPhoto={setFoto} hint="Toma foto o selecciona desde galería · JPG, PNG, HEIC" />
          </Card>
          <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", marginBottom:12 }}>
            <div style={{ fontSize:16, fontWeight:700, color:T.text, fontFamily:"sans-serif" }}>💊 Preparaciones</div>
            <label style={{ display:"flex", alignItems:"center", gap:8, cursor:"pointer" }}>
              <input type="checkbox" checked={urgente} onChange={e=>setUrgente(e.target.checked)} />
              <span style={{ fontSize:12, color:T.red, fontFamily:"sans-serif", fontWeight:600 }}>🚨 Orden urgente</span>
            </label>
          </div>
          {items.map((item,i) => {
            const sel=MEDS.find(m=>m.nombre===item.med);
            return (
              <Card key={i} style={{ marginBottom:12, border:`1px solid ${item.urgente?T.redBorder:T.border}` }}>
                <div style={{ display:"flex", justifyContent:"space-between", marginBottom:12 }}>
                  <div style={{ fontSize:13, fontWeight:700, color:T.teal, fontFamily:"sans-serif" }}>#{i+1}</div>
                  <div style={{ display:"flex", gap:10, alignItems:"center" }}>
                    <label style={{ display:"flex", alignItems:"center", gap:6, cursor:"pointer" }}>
                      <input type="checkbox" checked={item.urgente} onChange={e=>updItem(i,"urgente",e.target.checked)} />
                      <span style={{ fontSize:11, color:T.red, fontFamily:"sans-serif" }}>Urgente</span>
                    </label>
                    {items.length>1 && <button onClick={()=>remItem(i)} style={{ background:T.redDim, border:`1px solid ${T.redBorder}`, borderRadius:6, color:T.red, padding:"3px 10px", cursor:"pointer", fontSize:12, fontFamily:"sans-serif" }}>✕</button>}
                  </div>
                </div>
                <div style={{ display:"grid", gridTemplateColumns:"2fr 1fr", gap:10 }}>
                  <div>
                    <Label required>Preparación</Label>
                    <select value={item.med} onChange={e=>updItem(i,"med",e.target.value)} style={{ width:"100%", padding:"11px 14px", background:"rgba(255,255,255,0.04)", border:`1px solid ${T.border}`, borderRadius:8, color:item.med?T.text:T.muted, fontSize:14, outline:"none", fontFamily:"sans-serif" }}>
                      <option value="" style={{background:T.card}}>Seleccionar...</option>
                      {[...new Set(MEDS.map(m=>m.categoria))].map(cat=>(
                        <optgroup key={cat} label={cat} style={{background:T.card}}>
                          {MEDS.filter(m=>m.categoria===cat).map(m=><option key={m.nombre} value={m.nombre} style={{background:T.card}}>{m.nombre}{m.precio?` — $${m.precio}`:""}</option>)}
                        </optgroup>
                      ))}
                    </select>
                  </div>
                  <div>
                    <Label>Cantidad</Label>
                    <input type="number" min="1" value={item.cantidad} onChange={e=>updItem(i,"cantidad",parseInt(e.target.value)||1)} style={{ width:"100%", padding:"11px 14px", background:"rgba(255,255,255,0.04)", border:`1px solid ${T.border}`, borderRadius:8, color:T.text, fontSize:14, outline:"none", boxSizing:"border-box", fontFamily:"sans-serif" }} />
                  </div>
                </div>
                {item.med==="Otra / Fórmula especial" && <div style={{marginTop:10}}><FInput label="Describe la fórmula" value={item.especial} onChange={v=>updItem(i,"especial",v)} placeholder="Ej: Crema 50g con Hidrocortisona 0.5% + Ketoconazol 2%" /></div>}
                <div style={{marginTop:10}}>
                  <Label>Instrucciones para el paciente</Label>
                  <textarea value={item.instrucciones} onChange={e=>updItem(i,"instrucciones",e.target.value)} rows={2} placeholder="Aplicar 2 veces al día, evitar ojos..." style={{ width:"100%", padding:"10px 14px", background:"rgba(255,255,255,0.04)", border:`1px solid ${T.border}`, borderRadius:8, color:T.text, fontSize:13, resize:"none", outline:"none", boxSizing:"border-box", fontFamily:"sans-serif" }} />
                </div>
                {sel?.precio>0 && <div style={{ fontSize:13, color:T.green, fontWeight:600, marginTop:8, fontFamily:"sans-serif" }}>Estimado: ${(sel.precio*item.cantidad).toFixed(2)}</div>}
              </Card>
            );
          })}
          <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginTop:8 }}>
            <Btn onClick={addItem} variant="outline" color={T.teal} size="sm">+ Agregar preparación</Btn>
            {total>0 && <div style={{ fontSize:16, fontWeight:700, color:T.gold, fontFamily:"sans-serif" }}>Total: ${total.toFixed(2)}</div>}
          </div>
          <div style={{marginTop:16}}>
            <Label>Notas generales</Label>
            <textarea value={notas} onChange={e=>setNotas(e.target.value)} rows={2} placeholder="Instrucciones especiales, entrega a domicilio, etc." style={{ width:"100%", padding:"11px 14px", background:"rgba(255,255,255,0.04)", border:`1px solid ${T.border}`, borderRadius:8, color:T.text, fontSize:14, resize:"vertical", outline:"none", boxSizing:"border-box", fontFamily:"sans-serif" }} />
          </div>
        </div>
      )}

      {step===3 && (
        <div>
          <Card style={{ marginBottom:14, border:`1px solid ${T.greenBorder}` }}>
            <div style={{ display:"flex", justifyContent:"space-between", marginBottom:16 }}>
              <div style={{ fontSize:16, fontWeight:700, color:T.text, fontFamily:"sans-serif" }}>📋 Resumen</div>
              <div style={{ display:"flex", gap:8 }}>{urgente&&<Badge color={T.red}>🚨 Urgente</Badge>}<Badge color={T.teal}>{orderId}</Badge></div>
            </div>
            <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:12, marginBottom:14 }}>
              <div style={{ padding:14, background:T.tealDim, borderRadius:10 }}>
                <div style={{ fontSize:10, color:T.teal, letterSpacing:"1px", marginBottom:8, fontFamily:"sans-serif" }}>MÉDICO</div>
                <div style={{ fontSize:14, fontWeight:700, color:T.text, fontFamily:"sans-serif" }}>Dr(a). {med.nombre}</div>
                <div style={{ fontSize:12, color:T.muted, fontFamily:"sans-serif" }}>Lic: {med.licencia} · {med.tel}</div>
              </div>
              <div style={{ padding:14, background:T.goldDim, borderRadius:10 }}>
                <div style={{ fontSize:10, color:T.gold, letterSpacing:"1px", marginBottom:8, fontFamily:"sans-serif" }}>PACIENTE</div>
                <div style={{ fontSize:14, fontWeight:700, color:T.text, fontFamily:"sans-serif" }}>{pac.nombre}</div>
                <div style={{ fontSize:12, color:T.muted, fontFamily:"sans-serif" }}>{pac.tel}</div>
                {pac.alergias&&<div style={{ fontSize:12, color:T.red, fontFamily:"sans-serif" }}>⚠️ {pac.alergias}</div>}
              </div>
            </div>
            {foto&&<div style={{ display:"flex", alignItems:"center", gap:10, padding:"10px 14px", background:T.greenDim, borderRadius:8, marginBottom:12 }}><img src={foto.url} alt="receta" style={{ width:48, height:48, objectFit:"cover", borderRadius:6 }} /><div style={{ fontSize:13, color:T.green, fontFamily:"sans-serif" }}>📷 Foto de receta incluida</div></div>}
            {items.map((item,i)=>{
              const m=MEDS.find(m=>m.nombre===item.med);
              return <div key={i} style={{ padding:"10px 14px", background:"rgba(255,255,255,0.03)", borderRadius:8, marginBottom:8, display:"flex", justifyContent:"space-between" }}>
                <div><div style={{ fontSize:13, fontWeight:600, color:T.text, fontFamily:"sans-serif" }}>{item.med}</div>{item.instrucciones&&<div style={{ fontSize:11, color:T.muted, fontFamily:"sans-serif", fontStyle:"italic" }}>{item.instrucciones}</div>}</div>
                <div style={{ textAlign:"right" }}><div style={{ fontSize:12, color:T.muted, fontFamily:"sans-serif" }}>x{item.cantidad}</div>{m?.precio>0&&<div style={{ fontSize:13, color:T.green, fontFamily:"sans-serif", fontWeight:600 }}>${(m.precio*item.cantidad).toFixed(2)}</div>}</div>
              </div>;
            })}
            {total>0&&<div style={{ textAlign:"right", fontSize:18, fontWeight:700, color:T.gold, fontFamily:"sans-serif", marginTop:10 }}>Total estimado: ${total.toFixed(2)}</div>}
          </Card>
          <Card style={{ border:`1px solid ${T.waBorder}` }}>
            <div style={{ display:"flex", alignItems:"center", gap:8, marginBottom:6 }}><WAIcon /><div style={{ fontSize:14, fontWeight:700, color:T.wa, fontFamily:"sans-serif" }}>Enviar por WhatsApp</div></div>
            <div style={{ fontSize:13, color:T.muted, fontFamily:"sans-serif", marginBottom:16, lineHeight:1.6 }}>WhatsApp se abre con toda la orden lista.{foto?" Después adjunta la foto en el mismo chat.":""}</div>
            <a href={makeWALink(WA_NUMBER, buildMsg())} target="_blank" rel="noreferrer" onClick={()=>setDone(true)}
              style={{ display:"inline-flex", alignItems:"center", gap:8, padding:"13px 28px", background:T.wa, borderRadius:10, color:"#fff", fontWeight:700, fontSize:14, textDecoration:"none", fontFamily:"sans-serif", boxShadow:"0 4px 20px rgba(37,211,102,0.3)" }}>
              <WAIcon size={18} /> Enviar Orden a Farmacia Mia
            </a>
            {foto&&<div style={{ marginTop:14, padding:"10px 14px", background:T.goldDim, border:`1px solid ${T.goldBorder}`, borderRadius:8, fontSize:12, color:T.gold, fontFamily:"sans-serif" }}>📎 Paso 2: En WhatsApp, adjunta la foto de la receta tocando el clip 📎</div>}
          </Card>
        </div>
      )}

      {step<3 && (
        <div style={{ display:"flex", justifyContent:"space-between", marginTop:24 }}>
          <Btn onClick={()=>step===0?onBack():setStep(s=>s-1)} variant="outline" color={T.muted}>← Atrás</Btn>
          <Btn onClick={()=>setStep(s=>s+1)} disabled={!canNext}>{step===2?"Revisar →":"Siguiente →"}</Btn>
        </div>
      )}
    </div>
  );
};

// ═══════════ PORTAL PACIENTE ═══════════
const PortalPaciente = ({ onBack }) => {
  const [step, setStep] = useState(0);
  const [done, setDone] = useState(false);
  const [orderId] = useState(`FM-P-${Date.now().toString().slice(-6)}`);
  const [datos, setDatos] = useState({ nombre:"", tel:"", seguro:"", dob:"", alergias:"", entrega:"recoger" });
  const [foto, setFoto] = useState(null);
  const [tieneFoto, setTieneFoto] = useState(null);
  const [descripcion, setDescripcion] = useState("");
  const [notas, setNotas] = useState("");

  const canNext = [datos.nombre&&datos.tel, tieneFoto!==null&&(tieneFoto?foto!==null:descripcion.trim().length>3), true][step];

  const buildMsg = () =>
    `💊 *SOLICITUD PACIENTE — FARMACIA MIA*\nID: ${orderId}

🙋 *PACIENTE*
Nombre: ${datos.nombre} | Tel: ${datos.tel}
Nacimiento: ${datos.dob||"—"} | Seguro: ${datos.seguro||"Ninguno"}
Alergias: ${datos.alergias||"Ninguna conocida"}
Entrega: ${datos.entrega==="recoger"?"🏪 Recoger en farmacia":"🏠 Entrega a domicilio"}

📋 *RECETA*
${tieneFoto&&foto?"📎 Foto adjunta en este chat":`Descripción: ${descripcion}`}

📝 Notas: ${notas||"Ninguna"}`;

  if (done) return <Done orderId={orderId} tipo="paciente" tel={datos.tel} onNueva={()=>{setDone(false);setStep(0);setDatos({nombre:"",tel:"",seguro:"",dob:"",alergias:"",entrega:"recoger"});setFoto(null);setTieneFoto(null);setDescripcion("");}} />;

  return (
    <div style={{ maxWidth:620, margin:"0 auto" }}>
      <button onClick={onBack} style={{ background:"none", border:"none", color:T.muted, fontSize:13, cursor:"pointer", fontFamily:"sans-serif", marginBottom:24, display:"flex", alignItems:"center", gap:6 }}>← Volver al inicio</button>
      <div style={{ display:"flex", alignItems:"center", gap:12, marginBottom:28 }}>
        <div style={{ width:44, height:44, borderRadius:10, background:T.purpleDim, border:`1px solid ${T.purpleBorder}`, display:"flex", alignItems:"center", justifyContent:"center", fontSize:22 }}>🙋</div>
        <div>
          <div style={{ fontSize:22, fontWeight:700, color:T.text, fontFamily:"sans-serif" }}>Portal de Pacientes</div>
          <div style={{ fontSize:12, color:T.purple, fontFamily:"sans-serif" }}>Envía tu receta fácil y rápido</div>
        </div>
      </div>
      <Progress steps={["Tus Datos","Tu Receta","Confirmar"]} current={step} color={T.purple} />

      {step===0 && (
        <Card>
          <div style={{ fontSize:16, fontWeight:700, color:T.text, marginBottom:20, fontFamily:"sans-serif" }}>🙋 Tus Datos</div>
          <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:12 }}>
            <FInput label="Tu nombre completo" value={datos.nombre} onChange={v=>setDatos({...datos,nombre:v})} placeholder="Nombre y apellido" required />
            <FInput label="Tu teléfono / WhatsApp" value={datos.tel} onChange={v=>setDatos({...datos,tel:v})} placeholder="787-555-0000" required type="tel" />
            <FInput label="Fecha de nacimiento" value={datos.dob} onChange={v=>setDatos({...datos,dob:v})} type="date" />
            <div>
              <Label>Plan médico / Seguro</Label>
              <select value={datos.seguro} onChange={e=>setDatos({...datos,seguro:e.target.value})} style={{ width:"100%", padding:"11px 14px", background:"rgba(255,255,255,0.04)", border:`1px solid ${T.border}`, borderRadius:8, color:T.text, fontSize:14, outline:"none", fontFamily:"sans-serif", marginBottom:16 }}>
                {["","Triple S","Plan Gobierno","Humana","Molina","MMM","MCS","Medicare","Ninguno / Particular"].map(s=><option key={s} value={s} style={{background:T.card}}>{s||"Seleccionar seguro..."}</option>)}
              </select>
            </div>
            <div style={{ gridColumn:"1/-1" }}>
              <FInput label="Alergias conocidas" value={datos.alergias} onChange={v=>setDatos({...datos,alergias:v})} placeholder="Penicilina, látex... o 'Ninguna conocida'" />
            </div>
          </div>
          <div>
            <Label>¿Cómo quieres recibir tu preparación?</Label>
            <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:10 }}>
              {[["recoger","🏪","Recoger en farmacia","Voy a buscarla yo"],["domicilio","🏠","Entrega a domicilio","Me la envían a casa"]].map(([val,icon,label,sub])=>(
                <div key={val} onClick={()=>setDatos({...datos,entrega:val})}
                  style={{ padding:16, borderRadius:10, border:`2px solid ${datos.entrega===val?T.purple:T.border}`, background:datos.entrega===val?T.purpleDim:"transparent", cursor:"pointer", textAlign:"center", transition:"all 0.15s" }}>
                  <div style={{ fontSize:28, marginBottom:6 }}>{icon}</div>
                  <div style={{ fontSize:13, fontWeight:700, color:datos.entrega===val?T.purple:T.text, fontFamily:"sans-serif" }}>{label}</div>
                  <div style={{ fontSize:11, color:T.muted, fontFamily:"sans-serif" }}>{sub}</div>
                </div>
              ))}
            </div>
          </div>
        </Card>
      )}

      {step===1 && (
        <div>
          <Card style={{ marginBottom:16 }}>
            <div style={{ fontSize:16, fontWeight:700, color:T.text, marginBottom:6, fontFamily:"sans-serif" }}>📋 Tu Receta</div>
            <div style={{ fontSize:13, color:T.muted, marginBottom:20, fontFamily:"sans-serif" }}>¿Tienes una foto de la receta que te dio el médico?</div>
            <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:10, marginBottom:20 }}>
              {[[true,"📷","Sí, tengo foto","Voy a subir la foto"],[false,"✍️","No, la describo","Cuento lo que necesito"]].map(([val,icon,label,sub])=>(
                <div key={String(val)} onClick={()=>{setTieneFoto(val);setFoto(null);setDescripcion("");}}
                  style={{ padding:16, borderRadius:10, border:`2px solid ${tieneFoto===val?T.purple:T.border}`, background:tieneFoto===val?T.purpleDim:"transparent", cursor:"pointer", textAlign:"center", transition:"all 0.15s" }}>
                  <div style={{ fontSize:32, marginBottom:6 }}>{icon}</div>
                  <div style={{ fontSize:13, fontWeight:700, color:tieneFoto===val?T.purple:T.text, fontFamily:"sans-serif" }}>{label}</div>
                  <div style={{ fontSize:11, color:T.muted, fontFamily:"sans-serif" }}>{sub}</div>
                </div>
              ))}
            </div>
            {tieneFoto===true && <PhotoUpload label="Sube la foto de tu receta" photo={foto} setPhoto={setFoto} hint="Asegúrate que se vea el medicamento y la dosis claramente" />}
            {tieneFoto===false && (
              <div>
                <Label required>Describe lo que necesitas</Label>
                <textarea value={descripcion} onChange={e=>setDescripcion(e.target.value)} rows={4}
                  placeholder="Ej: Mi médico me recetó una crema de hidrocortisona al 1%, 2 frascos de 30g. Es para la dermatitis en el brazo."
                  style={{ width:"100%", padding:"12px 14px", background:"rgba(255,255,255,0.04)", border:`1px solid ${T.border}`, borderRadius:8, color:T.text, fontSize:14, resize:"vertical", outline:"none", boxSizing:"border-box", fontFamily:"sans-serif", lineHeight:1.6 }}
                  onFocus={e=>e.target.style.borderColor=T.tealBorder} onBlur={e=>e.target.style.borderColor=T.border} />
              </div>
            )}
          </Card>
          {tieneFoto!==null && (
            <Card>
              <FInput label="Notas adicionales (opcional)" value={notas} onChange={setNotas} placeholder="¿Cuánto tarda? ¿Lo tienen disponible? Entrega urgente..." />
            </Card>
          )}
        </div>
      )}

      {step===2 && (
        <div>
          <Card style={{ marginBottom:14, border:`1px solid ${T.purpleBorder}` }}>
            <div style={{ fontSize:16, fontWeight:700, color:T.text, marginBottom:16, fontFamily:"sans-serif" }}>📋 Tu resumen</div>
            <div style={{ padding:14, background:T.purpleDim, borderRadius:10, marginBottom:14 }}>
              <div style={{ fontSize:10, color:T.purple, letterSpacing:"1px", marginBottom:8, fontFamily:"sans-serif" }}>TUS DATOS</div>
              <div style={{ fontSize:14, fontWeight:700, color:T.text, fontFamily:"sans-serif" }}>{datos.nombre}</div>
              <div style={{ fontSize:12, color:T.muted, fontFamily:"sans-serif" }}>{datos.tel}</div>
              {datos.seguro&&<div style={{ fontSize:12, color:T.muted, fontFamily:"sans-serif" }}>{datos.seguro}</div>}
              <div style={{ fontSize:12, color:T.purple, fontFamily:"sans-serif", marginTop:4 }}>{datos.entrega==="recoger"?"🏪 Recoger en farmacia":"🏠 Entrega a domicilio"}</div>
            </div>
            <div style={{ padding:14, background:"rgba(255,255,255,0.03)", borderRadius:10, marginBottom:notas?14:0 }}>
              <div style={{ fontSize:10, color:T.muted, letterSpacing:"1px", marginBottom:8, fontFamily:"sans-serif" }}>RECETA</div>
              {tieneFoto&&foto
                ? <div style={{ display:"flex", alignItems:"center", gap:10 }}><img src={foto.url} alt="receta" style={{ width:60, height:60, objectFit:"cover", borderRadius:8 }} /><div style={{ fontSize:13, color:T.green, fontFamily:"sans-serif" }}>✅ Foto lista para enviar</div></div>
                : <div style={{ fontSize:13, color:T.text, fontFamily:"sans-serif", lineHeight:1.6 }}>{descripcion}</div>
              }
            </div>
            {notas&&<div style={{ padding:"10px 14px", background:T.tealDim, borderRadius:8, fontSize:13, color:T.muted, fontFamily:"sans-serif" }}>📝 {notas}</div>}
          </Card>
          <Card style={{ border:`1px solid ${T.waBorder}` }}>
            <div style={{ display:"flex", alignItems:"center", gap:8, marginBottom:6 }}><WAIcon /><div style={{ fontSize:14, fontWeight:700, color:T.wa, fontFamily:"sans-serif" }}>Enviar a Farmacia Mia</div></div>
            <div style={{ fontSize:13, color:T.muted, fontFamily:"sans-serif", marginBottom:16, lineHeight:1.6 }}>WhatsApp se abre con todo listo.{tieneFoto&&foto?" Recuerda adjuntar la foto en el mismo chat.":""}</div>
            <a href={makeWALink(WA_NUMBER, buildMsg())} target="_blank" rel="noreferrer" onClick={()=>setDone(true)}
              style={{ display:"inline-flex", alignItems:"center", gap:8, padding:"13px 28px", background:T.wa, borderRadius:10, color:"#fff", fontWeight:700, fontSize:14, textDecoration:"none", fontFamily:"sans-serif", boxShadow:"0 4px 20px rgba(37,211,102,0.3)" }}>
              <WAIcon size={18} /> Enviar mi Receta
            </a>
            {tieneFoto&&foto&&<div style={{ marginTop:14, padding:"10px 14px", background:T.goldDim, border:`1px solid ${T.goldBorder}`, borderRadius:8, fontSize:12, color:T.gold, fontFamily:"sans-serif" }}>📎 Paso 2: En WhatsApp, toca el clip 📎 y adjunta la foto de la receta</div>}
          </Card>
        </div>
      )}

      {step<2 && (
        <div style={{ display:"flex", justifyContent:"space-between", marginTop:24 }}>
          <Btn onClick={()=>step===0?onBack():setStep(s=>s-1)} variant="outline" color={T.muted}>← Atrás</Btn>
          <Btn onClick={()=>setStep(s=>s+1)} disabled={!canNext} color={T.purple}>{step===1?"Revisar →":"Siguiente →"}</Btn>
        </div>
      )}
    </div>
  );
};

// ═══════════ LANDING ═══════════
const Landing = ({ onSelect }) => (
  <div style={{ minHeight:"100vh", display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center", padding:"40px 20px" }}>
    <div style={{ position:"fixed", top:-150, left:-150, width:500, height:500, borderRadius:"50%", background:"radial-gradient(circle, rgba(0,194,212,0.06) 0%, transparent 70%)", pointerEvents:"none" }} />
    <div style={{ position:"fixed", bottom:-100, right:-100, width:400, height:400, borderRadius:"50%", background:"radial-gradient(circle, rgba(167,139,250,0.06) 0%, transparent 70%)", pointerEvents:"none" }} />
    <div style={{ textAlign:"center", marginBottom:48 }}>
      <div style={{ display:"inline-flex", alignItems:"center", justifyContent:"center", width:72, height:72, borderRadius:18, background:"linear-gradient(135deg, #00C2D4, #0077B6)", marginBottom:20, boxShadow:"0 8px 32px rgba(0,194,212,0.4)" }}>
        <span style={{ fontSize:32, fontWeight:900, color:"#fff", fontFamily:"Georgia, serif" }}>Rx</span>
      </div>
      <div style={{ fontSize:30, fontWeight:700, color:T.text, letterSpacing:1, fontFamily:"sans-serif" }}>Farmacia Mia</div>
      <div style={{ fontSize:13, color:T.muted, letterSpacing:3, textTransform:"uppercase", marginTop:6, fontFamily:"sans-serif" }}>Portal de Servicios · Puerto Rico 🇵🇷</div>
    </div>
    <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:20, width:"100%", maxWidth:680, marginBottom:40 }}>
      {[
        { key:"medico", icon:"👨‍⚕️", title:"Soy Médico", desc:"Envía órdenes de preparaciones magistrales para tus pacientes", cta:"Enviar Orden →", color:T.teal, dimColor:T.tealDim, border:T.tealBorder },
        { key:"paciente", icon:"🙋", title:"Soy Paciente", desc:"Envía tu receta y coordina la preparación de tu medicamento", cta:"Enviar Receta →", color:T.purple, dimColor:T.purpleDim, border:T.purpleBorder },
      ].map(item => (
        <div key={item.key} onClick={()=>onSelect(item.key)}
          style={{ padding:36, background:T.card, border:`1px solid ${item.border}`, borderRadius:20, textAlign:"center", cursor:"pointer", transition:"all 0.2s", position:"relative", overflow:"hidden" }}
          onMouseEnter={e=>{e.currentTarget.style.transform="translateY(-4px)";e.currentTarget.style.boxShadow=`0 20px 60px ${item.color}33`;e.currentTarget.style.borderColor=item.color;}}
          onMouseLeave={e=>{e.currentTarget.style.transform="translateY(0)";e.currentTarget.style.boxShadow="none";e.currentTarget.style.borderColor=item.border;}}>
          <div style={{ position:"absolute", top:0, left:0, right:0, height:3, background:`linear-gradient(90deg, ${item.color}, transparent)` }} />
          <div style={{ fontSize:56, marginBottom:16 }}>{item.icon}</div>
          <div style={{ fontSize:20, fontWeight:700, color:T.text, fontFamily:"sans-serif", marginBottom:8 }}>{item.title}</div>
          <div style={{ fontSize:13, color:T.muted, fontFamily:"sans-serif", lineHeight:1.6, marginBottom:20 }}>{item.desc}</div>
          <div style={{ display:"inline-flex", alignItems:"center", gap:6, padding:"10px 22px", background:item.dimColor, border:`1px solid ${item.border}`, borderRadius:8, color:item.color, fontSize:13, fontWeight:700, fontFamily:"sans-serif" }}>{item.cta}</div>
        </div>
      ))}
    </div>
    <div style={{ display:"flex", gap:12, flexWrap:"wrap", justifyContent:"center", marginBottom:28 }}>
      {["📱 Funciona en celular","💬 Llega por WhatsApp","⚡ Menos de 3 minutos","🔒 Información privada"].map(f=>(
        <div key={f} style={{ padding:"6px 14px", background:T.greenDim, border:`1px solid ${T.greenBorder}`, borderRadius:20, fontSize:12, color:T.green, fontFamily:"sans-serif" }}>{f}</div>
      ))}
    </div>
    <div style={{ fontSize:11, color:T.dim, fontFamily:"sans-serif", letterSpacing:"1px" }}>Powered by GA RX Consulting · Puerto Rico</div>
  </div>
);

// ═══════════ MAIN ═══════════
export default function App() {
  const [view, setView] = useState("landing");
  return (
    <div style={{ minHeight:"100vh", background:T.bg, fontFamily:"sans-serif" }}>
      {view!=="landing" && (
        <div style={{ background:T.card, borderBottom:`1px solid ${T.border}`, padding:"16px 32px", display:"flex", alignItems:"center", gap:12, position:"sticky", top:0, zIndex:100 }}>
          <div style={{ width:32, height:32, borderRadius:8, background:"linear-gradient(135deg, #00C2D4, #0077B6)", display:"flex", alignItems:"center", justifyContent:"center", fontSize:14, fontWeight:900, color:"#fff", fontFamily:"Georgia, serif" }}>Rx</div>
          <div style={{ fontSize:14, fontWeight:700, color:T.text, fontFamily:"sans-serif" }}>Farmacia Mia</div>
          <Badge color={view==="medico"?T.teal:T.purple}>{view==="medico"?"👨‍⚕️ Portal Médico":"🙋 Portal Paciente"}</Badge>
          <div style={{ marginLeft:"auto", fontSize:10, color:T.dim, fontFamily:"sans-serif", letterSpacing:"1px" }}>by GA RX Consulting</div>
        </div>
      )}
      <div style={{ padding:view==="landing"?0:"36px 32px", maxWidth:view==="landing"?"none":900, margin:"0 auto" }}>
        {view==="landing" && <Landing onSelect={setView} />}
        {view==="medico" && <PortalMedico onBack={()=>setView("landing")} />}
        {view==="paciente" && <PortalPaciente onBack={()=>setView("landing")} />}
      </div>
    </div>
  );
}
