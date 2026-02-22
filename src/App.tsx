import { useState } from "react";

// ─── THEME ───────────────────────────────────────────────────────────────────
const T = {
  bg: "#050D1A", card: "#0A1628", card2: "#0D1E35",
  teal: "#00C2D4", tealDim: "rgba(0,194,212,0.10)", tealBorder: "rgba(0,194,212,0.28)",
  gold: "#C9A84C", goldDim: "rgba(201,168,76,0.10)", goldBorder: "rgba(201,168,76,0.28)",
  green: "#4ecca3", greenDim: "rgba(78,204,163,0.10)", greenBorder: "rgba(78,204,163,0.3)",
  wa: "#25D366", waDim: "rgba(37,211,102,0.10)", waBorder: "rgba(37,211,102,0.3)",
  red: "#ff6b6b", redDim: "rgba(255,107,107,0.10)", redBorder: "rgba(255,107,107,0.28)",
  text: "#E0F4FF", muted: "rgba(224,244,255,0.50)", dim: "rgba(224,244,255,0.22)",
  border: "rgba(255,255,255,0.07)",
};

// ─── MEDICAMENTOS ─────────────────────────────────────────────────────────────
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

const WA_NUMBER = "19392901222"; // PRUEBA — GA RX Consulting

// ─── SHARED COMPONENTS ───────────────────────────────────────────────────────
const Card = ({ children, style }) => (
  <div style={{ background: T.card, border: `1px solid ${T.border}`, borderRadius: 14, padding: 24, ...style }}>{children}</div>
);

const Label = ({ children }) => (
  <div style={{ fontSize: 11, letterSpacing: "1.5px", color: T.muted, marginBottom: 7, textTransform: "uppercase", fontFamily: "sans-serif" }}>{children}</div>
);

const Input = ({ label, value, onChange, placeholder, type = "text", required }) => (
  <div style={{ marginBottom: 16 }}>
    {label && <Label>{label}{required && <span style={{ color: T.red }}> *</span>}</Label>}
    <input type={type} value={value} onChange={e => onChange(e.target.value)} placeholder={placeholder}
      style={{ width: "100%", padding: "11px 14px", background: "rgba(255,255,255,0.04)", border: `1px solid ${T.border}`, borderRadius: 8, color: T.text, fontSize: 14, outline: "none", boxSizing: "border-box", fontFamily: "sans-serif" }}
      onFocus={e => e.target.style.borderColor = T.tealBorder}
      onBlur={e => e.target.style.borderColor = T.border}
    />
  </div>
);

const Btn = ({ children, onClick, color = T.teal, style, disabled, variant = "solid" }) => (
  <button onClick={onClick} disabled={disabled} style={{
    padding: "11px 24px", borderRadius: 9, border: variant === "outline" ? `1px solid ${color}` : "none",
    background: variant === "outline" ? "transparent" : disabled ? "rgba(255,255,255,0.08)" : color,
    color: variant === "outline" ? color : disabled ? T.muted : "#050D1A",
    fontSize: 13, fontWeight: 700, cursor: disabled ? "not-allowed" : "pointer", opacity: disabled ? 0.6 : 1,
    fontFamily: "sans-serif", letterSpacing: "0.5px", transition: "all 0.15s", ...style
  }}>{children}</button>
);

const Badge = ({ children, color = T.teal }) => (
  <span style={{ display: "inline-block", padding: "3px 10px", borderRadius: 20, fontSize: 11, fontWeight: 600, letterSpacing: "0.8px", background: `${color}20`, color, border: `1px solid ${color}44`, fontFamily: "sans-serif" }}>{children}</span>
);

const Tab = ({ active, onClick, children, icon }) => (
  <button onClick={onClick} style={{
    padding: "12px 22px", borderRadius: 9, border: "none", cursor: "pointer", fontFamily: "sans-serif",
    display: "flex", alignItems: "center", gap: 8, fontSize: 13, fontWeight: 600, transition: "all 0.15s",
    background: active ? T.teal : "transparent", color: active ? "#050D1A" : T.muted,
  }}><span style={{ fontSize: 16 }}>{icon}</span>{children}</button>
);

// ─── WHATSAPP LINK GENERATOR ──────────────────────────────────────────────────
const makeWALink = (number, msg) =>
  `https://wa.me/${number}?text=${encodeURIComponent(msg)}`;

// ════════════════════════════════════════════════════════════════════
// MODULE 1 — PORTAL DE ÓRDENES PARA MÉDICOS
// ════════════════════════════════════════════════════════════════════
const PortalOrdenes = () => {
  const STEPS = ["Médico", "Paciente", "Preparaciones", "Confirmar"];
  const [step, setStep] = useState(0);
  const [submitted, setSubmitted] = useState(false);
  const [orderId] = useState(`FM-${Date.now().toString().slice(-6)}`);

  const [medico, setMedico] = useState({ nombre: "", especialidad: "", licencia: "", tel: "", email: "", clinica: "" });
  const [paciente, setPaciente] = useState({ nombre: "", dob: "", seguro: "", seguroNum: "", alergias: "", tel: "" });
  const [items, setItems] = useState([{ med: "", cantidad: 1, instrucciones: "", urgente: false, especial: "" }]);
  const [notasGral, setNotasGral] = useState("");
  const [urgGral, setUrgGral] = useState(false);

  const addItem = () => setItems([...items, { med: "", cantidad: 1, instrucciones: "", urgente: false, especial: "" }]);
  const updateItem = (i, field, val) => { const n = [...items]; n[i][field] = val; setItems(n); };
  const removeItem = (i) => items.length > 1 && setItems(items.filter((_, idx) => idx !== i));

  const total = items.reduce((acc, it) => {
    const m = MEDS.find(m => m.nombre === it.med);
    return acc + (m ? m.precio * it.cantidad : 0);
  }, 0);

  const canNext = [
    medico.nombre && medico.licencia && medico.tel,
    paciente.nombre && paciente.tel,
    items.every(i => i.med),
    true,
  ][step];

  const buildWAMessage = () => {
    const itemLines = items.map((it, i) => {
      const m = MEDS.find(m => m.nombre === it.med);
      return `  ${i + 1}. ${it.med}${it.especial ? ` — ${it.especial}` : ""}\n     Cantidad: ${it.cantidad}${m ? ` · $${(m.precio * it.cantidad).toFixed(2)}` : ""}\n     Instrucciones: ${it.instrucciones || "Ninguna"}${it.urgente ? "\n     ⚠️ URGENTE" : ""}`;
    }).join("\n\n");

    return `🏥 *NUEVA ORDEN FARMACIA MIA*
ID: ${orderId}${urgGral ? "\n🚨 *ORDEN URGENTE*" : ""}

👨‍⚕️ *MÉDICO*
Nombre: ${medico.nombre}
Especialidad: ${medico.especialidad}
Licencia: ${medico.licencia}
Teléfono: ${medico.tel}
Clínica: ${medico.clinica || "No indicada"}

🤒 *PACIENTE*
Nombre: ${paciente.nombre}
Fecha nac: ${paciente.dob || "No indicada"}
Seguro: ${paciente.seguro || "Ninguno"} ${paciente.seguroNum ? `#${paciente.seguroNum}` : ""}
Teléfono: ${paciente.tel}
Alergias: ${paciente.alergias || "Ninguna conocida"}

💊 *PREPARACIONES*
${itemLines}

💰 *ESTIMADO TOTAL: $${total.toFixed(2)}*

📝 Notas: ${notasGral || "Ninguna"}`;
  };

  if (submitted) return (
    <div style={{ maxWidth: 560, margin: "0 auto", textAlign: "center", padding: "60px 20px" }}>
      <div style={{ fontSize: 72, marginBottom: 24 }}>✅</div>
      <div style={{ fontSize: 28, fontWeight: 700, color: T.green, fontFamily: "sans-serif", marginBottom: 12 }}>¡Orden Enviada!</div>
      <div style={{ fontSize: 14, color: T.muted, fontFamily: "sans-serif", marginBottom: 8 }}>ID de Orden: <span style={{ color: T.teal, fontWeight: 700 }}>{orderId}</span></div>
      <div style={{ fontSize: 13, color: T.muted, fontFamily: "sans-serif", marginBottom: 32, lineHeight: 1.6 }}>
        Farmacia Mia ha recibido tu orden. Te contactaremos al <span style={{ color: T.text }}>{medico.tel}</span> para confirmar y coordinar la entrega.
      </div>
      <Card style={{ textAlign: "left", marginBottom: 24, border: `1px solid ${T.waBorder}` }}>
        <div style={{ fontSize: 13, color: T.wa, fontWeight: 700, marginBottom: 8, fontFamily: "sans-serif" }}>💬 También puedes enviarnos la orden por WhatsApp</div>
        <div style={{ fontSize: 12, color: T.muted, fontFamily: "sans-serif", marginBottom: 14 }}>Toca el botón para abrir WhatsApp con todos los detalles de tu orden ya escritos.</div>
        <a href={makeWALink(WA_NUMBER, buildWAMessage())} target="_blank" rel="noreferrer" style={{
          display: "inline-flex", alignItems: "center", gap: 8, padding: "12px 22px", background: T.wa, borderRadius: 9, color: "#fff", fontWeight: 700, fontSize: 13, textDecoration: "none", fontFamily: "sans-serif"
        }}>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
          Enviar por WhatsApp
        </a>
      </Card>
      <Btn onClick={() => { setSubmitted(false); setStep(0); setMedico({ nombre:"",especialidad:"",licencia:"",tel:"",email:"",clinica:"" }); setPaciente({ nombre:"",dob:"",seguro:"",seguroNum:"",alergias:"",tel:"" }); setItems([{ med:"",cantidad:1,instrucciones:"",urgente:false,especial:"" }]); setNotasGral(""); }} variant="outline" color={T.teal}>+ Nueva Orden</Btn>
    </div>
  );

  return (
    <div style={{ maxWidth: 760, margin: "0 auto" }}>
      {/* Progress */}
      <div style={{ display: "flex", gap: 0, marginBottom: 32, background: T.card, borderRadius: 12, padding: 6, border: `1px solid ${T.border}` }}>
        {STEPS.map((s, i) => (
          <div key={s} style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", gap: 6 }}>
            <div style={{ width: "100%", height: 4, background: i <= step ? T.teal : T.border, borderRadius: 2, transition: "background 0.3s" }} />
            <div style={{ fontSize: 11, fontWeight: i === step ? 700 : 400, color: i === step ? T.teal : i < step ? T.green : T.muted, fontFamily: "sans-serif", letterSpacing: "0.5px" }}>
              {i < step ? "✓ " : ""}{s}
            </div>
          </div>
        ))}
      </div>

      {/* STEP 0 — Médico */}
      {step === 0 && (
        <Card>
          <div style={{ fontSize: 18, fontWeight: 700, color: T.text, marginBottom: 4, fontFamily: "sans-serif" }}>👨‍⚕️ Información del Médico</div>
          <div style={{ fontSize: 13, color: T.muted, fontFamily: "sans-serif", marginBottom: 24 }}>Esta información solo se usa para procesar tu orden</div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
            <Input label="Nombre completo" value={medico.nombre} onChange={v => setMedico({...medico, nombre:v})} placeholder="Dr. / Dra." required />
            <Input label="Especialidad" value={medico.especialidad} onChange={v => setMedico({...medico, especialidad:v})} placeholder="Dermatología..." />
            <Input label="Licencia médica" value={medico.licencia} onChange={v => setMedico({...medico, licencia:v})} placeholder="PR-12345" required />
            <Input label="Teléfono directo" value={medico.tel} onChange={v => setMedico({...medico, tel:v})} placeholder="787-555-0000" required type="tel" />
            <Input label="Email" value={medico.email} onChange={v => setMedico({...medico, email:v})} placeholder="dr@clinica.pr" type="email" />
            <Input label="Clínica / Institución" value={medico.clinica} onChange={v => setMedico({...medico, clinica:v})} placeholder="Clínica San Juan" />
          </div>
        </Card>
      )}

      {/* STEP 1 — Paciente */}
      {step === 1 && (
        <Card>
          <div style={{ fontSize: 18, fontWeight: 700, color: T.text, marginBottom: 4, fontFamily: "sans-serif" }}>🤒 Información del Paciente</div>
          <div style={{ fontSize: 13, color: T.muted, fontFamily: "sans-serif", marginBottom: 24 }}>Solo usamos esta información para preparar y coordinar la entrega</div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
            <Input label="Nombre del paciente" value={paciente.nombre} onChange={v => setPaciente({...paciente, nombre:v})} placeholder="Nombre completo" required />
            <Input label="Teléfono" value={paciente.tel} onChange={v => setPaciente({...paciente, tel:v})} placeholder="787-555-0000" required type="tel" />
            <Input label="Fecha de nacimiento" value={paciente.dob} onChange={v => setPaciente({...paciente, dob:v})} type="date" />
            <div>
              <Label>Plan médico / Seguro</Label>
              <select value={paciente.seguro} onChange={e => setPaciente({...paciente, seguro:e.target.value})} style={{ width:"100%", padding:"11px 14px", background:"rgba(255,255,255,0.04)", border:`1px solid ${T.border}`, borderRadius:8, color:T.text, fontSize:14, outline:"none", fontFamily:"sans-serif", marginBottom:16 }}>
                {["","Triple S","Plan de Salud del Gobierno","Humana","Molina Healthcare","MMM","MCS","Medicare","Ninguno / Particular"].map(s => <option key={s} value={s} style={{background:T.card}}>{s || "Seleccionar seguro..."}</option>)}
              </select>
            </div>
            {paciente.seguro && paciente.seguro !== "Ninguno / Particular" && (
              <Input label="Número de seguro" value={paciente.seguroNum} onChange={v => setPaciente({...paciente, seguroNum:v})} placeholder="ID del plan" />
            )}
            <div style={{ gridColumn: "1 / -1" }}>
              <Input label="Alergias conocidas" value={paciente.alergias} onChange={v => setPaciente({...paciente, alergias:v})} placeholder="Ej: Penicilina, latex... o 'Ninguna conocida'" />
            </div>
          </div>
        </Card>
      )}

      {/* STEP 2 — Preparaciones */}
      {step === 2 && (
        <div>
          <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 6 }}>
            <div style={{ fontSize: 18, fontWeight: 700, color: T.text, fontFamily: "sans-serif" }}>💊 Preparaciones</div>
            <label style={{ display: "flex", alignItems: "center", gap: 8, marginLeft: "auto", cursor: "pointer" }}>
              <input type="checkbox" checked={urgGral} onChange={e => setUrgGral(e.target.checked)} style={{ width:16, height:16 }} />
              <span style={{ fontSize: 13, color: T.red, fontFamily: "sans-serif", fontWeight: 600 }}>🚨 Toda la orden es URGENTE</span>
            </label>
          </div>
          <div style={{ fontSize: 13, color: T.muted, fontFamily: "sans-serif", marginBottom: 20 }}>Agrega todas las preparaciones que necesitas en esta orden</div>

          {items.map((item, i) => {
            const selMed = MEDS.find(m => m.nombre === item.med);
            return (
              <Card key={i} style={{ marginBottom: 14, border: `1px solid ${item.urgente ? T.redBorder : T.border}` }}>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 14 }}>
                  <div style={{ fontSize: 13, fontWeight: 700, color: T.teal, fontFamily: "sans-serif" }}>Preparación #{i + 1}</div>
                  <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
                    <label style={{ display: "flex", alignItems: "center", gap: 6, cursor: "pointer" }}>
                      <input type="checkbox" checked={item.urgente} onChange={e => updateItem(i, "urgente", e.target.checked)} />
                      <span style={{ fontSize: 11, color: T.red, fontFamily: "sans-serif" }}>Urgente</span>
                    </label>
                    {items.length > 1 && <button onClick={() => removeItem(i)} style={{ background: T.redDim, border: `1px solid ${T.redBorder}`, borderRadius: 6, color: T.red, padding: "4px 10px", cursor: "pointer", fontSize: 12, fontFamily: "sans-serif" }}>✕</button>}
                  </div>
                </div>

                <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr", gap: 12 }}>
                  <div>
                    <Label>Preparación<span style={{ color: T.red }}> *</span></Label>
                    <select value={item.med} onChange={e => updateItem(i, "med", e.target.value)} style={{ width:"100%", padding:"11px 14px", background:"rgba(255,255,255,0.04)", border:`1px solid ${T.border}`, borderRadius:8, color:item.med?T.text:T.muted, fontSize:14, outline:"none", fontFamily:"sans-serif", marginBottom:0 }}>
                      <option value="" style={{background:T.card}}>Seleccionar preparación...</option>
                      {[...new Set(MEDS.map(m => m.categoria))].map(cat => (
                        <optgroup key={cat} label={cat} style={{background:T.card}}>
                          {MEDS.filter(m => m.categoria === cat).map(m => (
                            <option key={m.nombre} value={m.nombre} style={{background:T.card}}>{m.nombre} {m.precio ? `— $${m.precio}` : ""}</option>
                          ))}
                        </optgroup>
                      ))}
                    </select>
                  </div>
                  <div>
                    <Label>Cantidad</Label>
                    <input type="number" min="1" max="99" value={item.cantidad} onChange={e => updateItem(i, "cantidad", parseInt(e.target.value) || 1)} style={{ width:"100%", padding:"11px 14px", background:"rgba(255,255,255,0.04)", border:`1px solid ${T.border}`, borderRadius:8, color:T.text, fontSize:14, outline:"none", boxSizing:"border-box", fontFamily:"sans-serif" }} />
                  </div>
                </div>

                {item.med === "Otra / Fórmula especial" && (
                  <div style={{ marginTop: 12 }}>
                    <Input label="Describe la fórmula especial" value={item.especial} onChange={v => updateItem(i, "especial", v)} placeholder="Ej: Crema de Hidrocortisona 0.5% + Ketoconazol 2%, 50g" />
                  </div>
                )}

                <div style={{ marginTop: 12 }}>
                  <Label>Instrucciones de uso para el paciente</Label>
                  <textarea value={item.instrucciones} onChange={e => updateItem(i, "instrucciones", e.target.value)} rows={2} placeholder="Ej: Aplicar en área afectada 2 veces al día por 2 semanas, evitar contacto con ojos"
                    style={{ width:"100%", padding:"10px 14px", background:"rgba(255,255,255,0.04)", border:`1px solid ${T.border}`, borderRadius:8, color:T.text, fontSize:13, resize:"none", outline:"none", boxSizing:"border-box", fontFamily:"sans-serif" }} />
                </div>

                {selMed && selMed.precio > 0 && (
                  <div style={{ marginTop: 10, fontSize: 13, color: T.green, fontFamily: "sans-serif", fontWeight: 600 }}>
                    Estimado: ${(selMed.precio * item.cantidad).toFixed(2)}
                  </div>
                )}
              </Card>
            );
          })}

          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: 8 }}>
            <Btn onClick={addItem} variant="outline" color={T.teal}>+ Agregar preparación</Btn>
            {total > 0 && <div style={{ fontSize: 16, fontWeight: 700, color: T.gold, fontFamily: "sans-serif" }}>Total estimado: ${total.toFixed(2)}</div>}
          </div>

          <div style={{ marginTop: 20 }}>
            <Label>Notas generales para la farmacia</Label>
            <textarea value={notasGral} onChange={e => setNotasGral(e.target.value)} rows={3} placeholder="Instrucciones especiales, modo de entrega, horario disponible del paciente..."
              style={{ width:"100%", padding:"11px 14px", background:"rgba(255,255,255,0.04)", border:`1px solid ${T.border}`, borderRadius:8, color:T.text, fontSize:14, resize:"vertical", outline:"none", boxSizing:"border-box", fontFamily:"sans-serif" }} />
          </div>
        </div>
      )}

      {/* STEP 3 — Confirmación */}
      {step === 3 && (
        <div>
          <Card style={{ marginBottom: 16, border: urgGral ? `1px solid ${T.redBorder}` : `1px solid ${T.greenBorder}` }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
              <div style={{ fontSize: 18, fontWeight: 700, color: T.text, fontFamily: "sans-serif" }}>📋 Resumen de la Orden</div>
              <div style={{ display: "flex", gap: 8 }}>
                {urgGral && <Badge color={T.red}>🚨 URGENTE</Badge>}
                <Badge color={T.teal}>{orderId}</Badge>
              </div>
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginBottom: 20 }}>
              <div style={{ padding: 16, background: T.tealDim, borderRadius: 10 }}>
                <div style={{ fontSize: 11, color: T.teal, letterSpacing: "1px", marginBottom: 8, fontFamily: "sans-serif" }}>MÉDICO</div>
                <div style={{ fontSize: 14, fontWeight: 700, color: T.text, fontFamily: "sans-serif" }}>{medico.nombre}</div>
                <div style={{ fontSize: 12, color: T.muted, fontFamily: "sans-serif" }}>{medico.especialidad}</div>
                <div style={{ fontSize: 12, color: T.muted, fontFamily: "sans-serif" }}>Lic: {medico.licencia}</div>
                <div style={{ fontSize: 12, color: T.muted, fontFamily: "sans-serif" }}>{medico.tel}</div>
              </div>
              <div style={{ padding: 16, background: T.goldDim, borderRadius: 10 }}>
                <div style={{ fontSize: 11, color: T.gold, letterSpacing: "1px", marginBottom: 8, fontFamily: "sans-serif" }}>PACIENTE</div>
                <div style={{ fontSize: 14, fontWeight: 700, color: T.text, fontFamily: "sans-serif" }}>{paciente.nombre}</div>
                <div style={{ fontSize: 12, color: T.muted, fontFamily: "sans-serif" }}>{paciente.tel}</div>
                {paciente.seguro && <div style={{ fontSize: 12, color: T.muted, fontFamily: "sans-serif" }}>Seguro: {paciente.seguro}</div>}
                {paciente.alergias && <div style={{ fontSize: 12, color: T.red, fontFamily: "sans-serif" }}>⚠️ {paciente.alergias}</div>}
              </div>
            </div>
            {items.map((item, i) => {
              const m = MEDS.find(m => m.nombre === item.med);
              return (
                <div key={i} style={{ padding: "12px 16px", background: "rgba(255,255,255,0.03)", borderRadius: 8, marginBottom: 8 }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <div>
                      <div style={{ fontSize: 13, fontWeight: 700, color: T.text, fontFamily: "sans-serif" }}>{item.med}</div>
                      {item.especial && <div style={{ fontSize: 12, color: T.muted, fontFamily: "sans-serif" }}>{item.especial}</div>}
                      {item.instrucciones && <div style={{ fontSize: 11, color: T.muted, fontFamily: "sans-serif", marginTop: 4, fontStyle: "italic" }}>{item.instrucciones}</div>}
                    </div>
                    <div style={{ textAlign: "right", flexShrink: 0, marginLeft: 12 }}>
                      <div style={{ fontSize: 13, color: T.text, fontFamily: "sans-serif" }}>x{item.cantidad}</div>
                      {m && m.precio > 0 && <div style={{ fontSize: 13, color: T.green, fontFamily: "sans-serif", fontWeight: 600 }}>${(m.precio * item.cantidad).toFixed(2)}</div>}
                      {item.urgente && <Badge color={T.red} style={{ marginTop: 4 }}>Urgente</Badge>}
                    </div>
                  </div>
                </div>
              );
            })}
            {total > 0 && <div style={{ textAlign: "right", marginTop: 12, fontSize: 18, fontWeight: 700, color: T.gold, fontFamily: "sans-serif" }}>Total estimado: ${total.toFixed(2)}</div>}
            {notasGral && <div style={{ marginTop: 12, padding: "10px 14px", background: T.tealDim, borderRadius: 8, fontSize: 13, color: T.muted, fontFamily: "sans-serif" }}>📝 {notasGral}</div>}
          </Card>

          <Card style={{ border: `1px solid ${T.waBorder}` }}>
            <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 8 }}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill={T.wa}><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
              <div style={{ fontSize: 14, fontWeight: 700, color: T.wa, fontFamily: "sans-serif" }}>Confirmar y enviar por WhatsApp</div>
            </div>
            <div style={{ fontSize: 13, color: T.muted, fontFamily: "sans-serif", marginBottom: 16 }}>Al tocar "Enviar Orden", se abrirá WhatsApp con todos los detalles de tu orden listos para enviar a Farmacia Mia. Solo presiona enviar en WhatsApp.</div>
            <a href={makeWALink(WA_NUMBER, buildWAMessage())} target="_blank" rel="noreferrer" onClick={() => setSubmitted(true)} style={{
              display: "inline-flex", alignItems: "center", gap: 8, padding: "13px 28px", background: T.wa, borderRadius: 10, color: "#fff", fontWeight: 700, fontSize: 14, textDecoration: "none", fontFamily: "sans-serif", boxShadow: "0 4px 20px rgba(37,211,102,0.35)"
            }}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
              ✅ Enviar Orden a Farmacia Mia
            </a>
          </Card>
        </div>
      )}

      {/* Nav buttons */}
      {step < 3 && (
        <div style={{ display: "flex", justifyContent: "space-between", marginTop: 24 }}>
          <Btn onClick={() => setStep(s => Math.max(0, s - 1))} disabled={step === 0} variant="outline" color={T.muted}>← Anterior</Btn>
          <Btn onClick={() => setStep(s => s + 1)} disabled={!canNext}>{step === 2 ? "Revisar Orden →" : "Siguiente →"}</Btn>
        </div>
      )}
    </div>
  );
};

// ════════════════════════════════════════════════════════════════════
// MODULE 2 — WHATSAPP HUB (Para empleados de Farmacia Mia)
// ════════════════════════════════════════════════════════════════════
const WhatsAppHub = () => {
  const [tipo, setTipo] = useState("paciente");
  const [nombre, setNombre] = useState("");
  const [telefono, setTelefono] = useState("");
  const [orderId, setOrderId] = useState("");
  const [preparacion, setPreparacion] = useState("");
  const [dias, setDias] = useState("3");
  const [hora, setHora] = useState("2:00 PM");
  const [monto, setMonto] = useState("");
  const [motivo, setMotivo] = useState("");
  const [preview, setPreview] = useState("");
  const [copied, setCopied] = useState(false);

  const TEMPLATES = {
    paciente: [
      { id: "listo", label: "✅ Preparación lista", icon: "✅",
        msg: (n, o, p) => `¡Hola ${n}! 👋\n\nTe informamos que tu preparación de *${p}* (Orden: ${o}) ya está lista para ser recogida en Farmacia Mia.\n\n🕐 Horario: Lunes a Viernes 8am–5pm · Sábados 9am–1pm\n📍 Farmacia Mia, Puerto Rico\n\n¿Tienes alguna pregunta? Con gusto te ayudamos. 😊` },
      { id: "demora", label: "⏳ Aviso de demora", icon: "⏳",
        msg: (n, o, p) => `Hola ${n},\n\nTe escribimos sobre tu orden ${o} de *${p}*. Por favor toma en cuenta que estamos experimentando un pequeño retraso y tu preparación estará lista mañana.\n\nLamentamos el inconveniente y apreciamos tu paciencia. Te avisaremos en cuanto esté lista. 🙏` },
      { id: "pago", label: "💰 Recordatorio de pago", icon: "💰",
        msg: (n, o, _, m) => `Hola ${n} 😊\n\nTu preparación (Orden ${o}) está lista. El total a pagar es *$${m}*.\n\nPuedes recoger y pagar en Farmacia Mia. Aceptamos: efectivo, ATH Móvil, tarjetas.\n\n¿Tienes alguna pregunta? Escríbenos aquí. ✅` },
      { id: "recordatorio", label: "🔔 Recordatorio de recogida", icon: "🔔",
        msg: (n, o, p) => `Hola ${n},\n\nTe recordamos que tu preparación de *${p}* (Orden ${o}) lleva varios días lista y está esperando por ti en Farmacia Mia.\n\nRecuerda que los medicamentos preparados tienen fecha de vencimiento. 📅\n\n¿Necesitas coordinar entrega a domicilio? Escríbenos. 😊` },
      { id: "instrucciones", label: "📋 Instrucciones de uso", icon: "📋",
        msg: (n, _, p) => `Hola ${n} 😊\n\nAquí te dejamos las instrucciones de uso para tu *${p}*:\n\n⚠️ *Importante:*\n• Aplicar según indicación médica\n• Mantener refrigerado si el médico lo indica\n• No compartir con otras personas\n• Suspender si nota reacciones adversas y contacte su médico\n\n¿Tienes dudas? Estamos aquí para ayudarte. 💊` },
    ],
    medico: [
      { id: "confirmar", label: "✅ Confirmar orden recibida", icon: "✅",
        msg: (n, o, p) => `Buenos días Dr(a). ${n},\n\nConfirmamos la recepción de su orden *${o}*.\n\n💊 Preparación: ${p}\n⏱️ Tiempo estimado: ${dias} días hábiles\n\nLe avisaremos cuando esté lista. Cualquier pregunta, con gusto le atendemos.\n\n*Farmacia Mia* 🏥` },
      { id: "lista_med", label: "✅ Orden lista para paciente", icon: "📦",
        msg: (n, o, p) => `Buenos días Dr(a). ${n},\n\nLe informamos que la orden *${o}* de *${p}* está lista.\n\nHemos notificado al paciente para coordinar la recogida.\n\n*Farmacia Mia* — Siempre a su servicio 🏥` },
      { id: "consulta", label: "❓ Consulta sobre fórmula", icon: "❓",
        msg: (n, o, p) => `Buenos días Dr(a). ${n},\n\nEn referencia a su orden *${o}* de *${p}*, necesitamos una aclaración antes de proceder con la preparación.\n\n¿Podría confirmarnos [especificar detalle]?\n\nGracias por su atención.\n\n*Farmacia Mia* 🏥` },
      { id: "cita", label: "📅 Recordatorio de recogida", icon: "📅",
        msg: (n, o) => `Buenos días Dr(a). ${n},\n\nLe recordamos que la orden *${o}* de su paciente ya está lista en Farmacia Mia desde hace ${dias} días.\n\nPor favor coordinar recogida o avísenos si necesita entrega a domicilio.\n\n*Farmacia Mia* 🏥` },
    ],
  };

  const buildMsg = (template) => {
    return template.msg(nombre || "[Nombre]", orderId || "[# Orden]", preparacion || "[Preparación]", monto || "[Monto]");
  };

  const templates = TEMPLATES[tipo];

  return (
    <div style={{ display: "grid", gridTemplateColumns: "280px 1fr", gap: 20, alignItems: "flex-start" }}>
      {/* Left: config */}
      <div style={{ position: "sticky", top: 20 }}>
        <Card style={{ marginBottom: 14 }}>
          <div style={{ fontSize: 14, fontWeight: 700, color: T.text, marginBottom: 14, fontFamily: "sans-serif" }}>⚙️ Configurar Mensaje</div>
          <div style={{ display: "flex", gap: 8, marginBottom: 16 }}>
            {[["paciente","🤒 Paciente"],["medico","🩺 Médico"]].map(([v,l]) => (
              <button key={v} onClick={() => { setTipo(v); setPreview(""); }} style={{ flex:1, padding:"8px 6px", borderRadius:8, border:"none", background:tipo===v?T.teal:"rgba(255,255,255,0.05)", color:tipo===v?"#050D1A":T.muted, fontSize:12, fontWeight:700, cursor:"pointer", fontFamily:"sans-serif" }}>{l}</button>
            ))}
          </div>
          <Input label="Nombre" value={nombre} onChange={setNombre} placeholder={tipo === "paciente" ? "Nombre del paciente" : "Apellido del médico"} />
          <Input label="Teléfono (WhatsApp)" value={telefono} onChange={setTelefono} placeholder="787-555-0000" type="tel" />
          <Input label="# Orden" value={orderId} onChange={setOrderId} placeholder="FM-001" />
          <Input label="Preparación" value={preparacion} onChange={setPreparacion} placeholder="Crema Tretinoína..." />
          {tipo === "paciente" && <Input label="Monto ($) — para cobro" value={monto} onChange={setMonto} placeholder="00.00" />}
          <Input label="Días / Tiempo estimado" value={dias} onChange={setDias} placeholder="3" />
        </Card>
      </div>

      {/* Right: templates */}
      <div>
        <div style={{ fontSize: 15, fontWeight: 700, color: T.text, marginBottom: 14, fontFamily: "sans-serif" }}>
          📨 Plantillas para {tipo === "paciente" ? "Pacientes" : "Médicos"}
        </div>
        <div style={{ display: "grid", gap: 12 }}>
          {templates.map(tmpl => {
            const msg = buildMsg(tmpl);
            const isSelected = preview === tmpl.id;
            return (
              <Card key={tmpl.id} style={{ border: `1px solid ${isSelected ? T.waBorder : T.border}`, cursor: "pointer", transition: "all 0.15s" }}
                onClick={() => setPreview(isSelected ? "" : tmpl.id)}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: isSelected ? 14 : 0 }}>
                  <div style={{ fontSize: 14, fontWeight: 700, color: isSelected ? T.wa : T.text, fontFamily: "sans-serif" }}>{tmpl.label}</div>
                  <div style={{ fontSize: 12, color: T.muted, fontFamily: "sans-serif" }}>{isSelected ? "▲ cerrar" : "▼ ver"}</div>
                </div>

                {isSelected && (
                  <>
                    {/* WhatsApp bubble preview */}
                    <div style={{ background: "#1A2E1A", borderRadius: 12, padding: 16, marginBottom: 14 }}>
                      <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 10, borderBottom: "1px solid rgba(255,255,255,0.08)", paddingBottom: 10 }}>
                        <div style={{ width: 32, height: 32, borderRadius: "50%", background: T.wa, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 14 }}>💊</div>
                        <div>
                          <div style={{ fontSize: 13, fontWeight: 700, color: "#fff", fontFamily: "sans-serif" }}>Farmacia Mia</div>
                          <div style={{ fontSize: 10, color: "rgba(255,255,255,0.4)", fontFamily: "sans-serif" }}>WhatsApp</div>
                        </div>
                      </div>
                      <div style={{ background: "#1F4E27", borderRadius: "12px 12px 12px 3px", padding: "10px 14px", maxWidth: "90%", display: "inline-block" }}>
                        <pre style={{ margin: 0, fontSize: 12, color: "#E2F5E3", fontFamily: "sans-serif", whiteSpace: "pre-wrap", lineHeight: 1.6 }}>{msg}</pre>
                        <div style={{ fontSize: 10, color: "rgba(255,255,255,0.3)", textAlign: "right", marginTop: 6 }}>
                          {new Date().toLocaleTimeString("es-PR", { hour: "2-digit", minute: "2-digit" })} ✓✓
                        </div>
                      </div>
                    </div>

                    <div style={{ display: "flex", gap: 10 }}>
                      {telefono ? (
                        <a href={makeWALink(telefono.replace(/\D/g, "").startsWith("1") ? telefono.replace(/\D/g, "") : "1" + telefono.replace(/\D/g, ""), msg)} target="_blank" rel="noreferrer" style={{
                          display: "inline-flex", alignItems: "center", gap: 8, padding: "11px 22px", background: T.wa, borderRadius: 9, color: "#fff", fontWeight: 700, fontSize: 13, textDecoration: "none", fontFamily: "sans-serif"
                        }}>
                          <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
                          Abrir en WhatsApp
                        </a>
                      ) : (
                        <Btn onClick={() => { navigator.clipboard?.writeText(msg); setCopied(tmpl.id); setTimeout(() => setCopied(""), 2000); }} color={T.teal} variant="outline">
                          {copied === tmpl.id ? "✅ Copiado" : "📋 Copiar mensaje"}
                        </Btn>
                      )}
                      {!telefono && <div style={{ fontSize: 12, color: T.muted, fontFamily: "sans-serif", alignSelf: "center" }}>← Agrega el teléfono para abrir WhatsApp directo</div>}
                    </div>
                  </>
                )}
              </Card>
            );
          })}
        </div>
      </div>
    </div>
  );
};

// ════════════════════════════════════════════════════════════════════
// MAIN APP
// ════════════════════════════════════════════════════════════════════
export default function App() {
  const [tab, setTab] = useState("ordenes");

  return (
    <div style={{ minHeight: "100vh", background: T.bg, fontFamily: "sans-serif" }}>
      {/* Header */}
      <div style={{ background: T.card, borderBottom: `1px solid ${T.border}`, padding: "0 32px", position: "sticky", top: 0, zIndex: 100 }}>
        <div style={{ maxWidth: 1100, margin: "0 auto", display: "flex", alignItems: "center", gap: 24 }}>
          {/* Logo */}
          <div style={{ display: "flex", alignItems: "center", gap: 10, padding: "18px 0", marginRight: 12 }}>
            <div style={{ width: 38, height: 38, borderRadius: 9, background: "linear-gradient(135deg, #00C2D4, #0077B6)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 16, fontWeight: 900, color: "#fff", fontFamily: "Georgia, serif", flexShrink: 0 }}>Rx</div>
            <div>
              <div style={{ fontSize: 14, fontWeight: 700, color: T.text, letterSpacing: 1 }}>Farmacia Mia</div>
              <div style={{ fontSize: 9, color: T.muted, letterSpacing: 2 }}>PORTAL DE SERVICIOS</div>
            </div>
          </div>
          <div style={{ width: 1, height: 40, background: T.border }} />
          <div style={{ display: "flex", gap: 4, padding: "10px 0" }}>
            <Tab active={tab === "ordenes"} onClick={() => setTab("ordenes")} icon="📋">Portal de Órdenes</Tab>
            <Tab active={tab === "whatsapp"} onClick={() => setTab("whatsapp")} icon="💬">Comunicación WhatsApp</Tab>
          </div>
          <div style={{ marginLeft: "auto", fontSize: 11, color: T.muted, letterSpacing: "0.5px" }}>by GA RX Consulting</div>
        </div>
      </div>

      {/* Content */}
      <div style={{ maxWidth: 1100, margin: "0 auto", padding: "36px 32px" }}>
        {/* Page headers */}
        {tab === "ordenes" && (
          <div style={{ marginBottom: 32 }}>
            <div style={{ fontSize: 26, fontWeight: 700, color: T.text, marginBottom: 6 }}>📋 Portal de Órdenes para Médicos</div>
            <div style={{ fontSize: 14, color: T.muted, lineHeight: 1.6 }}>
              Formulario profesional para enviar órdenes de preparaciones magistrales. Reemplaza el fillout — más rápido, más claro, y la orden llega directo al WhatsApp de la farmacia con todos los detalles organizados.
            </div>
            <div style={{ display: "flex", gap: 10, marginTop: 16, flexWrap: "wrap" }}>
              {["✅ Sin registrarse", "📱 Funciona en celular", "💬 Llega por WhatsApp", "⚡ Menos de 3 minutos"].map(f => (
                <div key={f} style={{ padding: "6px 14px", background: T.greenDim, border: `1px solid ${T.greenBorder}`, borderRadius: 20, fontSize: 12, color: T.green, fontFamily: "sans-serif" }}>{f}</div>
              ))}
            </div>
          </div>
        )}
        {tab === "whatsapp" && (
          <div style={{ marginBottom: 32 }}>
            <div style={{ fontSize: 26, fontWeight: 700, color: T.text, marginBottom: 6 }}>💬 Centro de Comunicación WhatsApp</div>
            <div style={{ fontSize: 14, color: T.muted, lineHeight: 1.6 }}>
              Plantillas profesionales para comunicarte con pacientes y médicos. Llena los datos, toca la plantilla que necesitas, y WhatsApp se abre con el mensaje ya escrito. Un click y listo.
            </div>
            <div style={{ display: "flex", gap: 10, marginTop: 16, flexWrap: "wrap" }}>
              {["✅ 5 plantillas para pacientes", "🩺 4 plantillas para médicos", "📱 Abre WhatsApp con 1 click", "✏️ Personalizable"].map(f => (
                <div key={f} style={{ padding: "6px 14px", background: T.waDim, border: `1px solid ${T.waBorder}`, borderRadius: 20, fontSize: 12, color: T.wa, fontFamily: "sans-serif" }}>{f}</div>
              ))}
            </div>
          </div>
        )}

        {tab === "ordenes" && <PortalOrdenes />}
        {tab === "whatsapp" && <WhatsAppHub />}
      </div>
    </div>
  );
}
