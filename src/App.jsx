import { useState } from 'react'

const DATOS = {
  "9012664906": { nombre: "Proveedor A", estados: [{ numero_factura: "FAC001", fecha_documento: "2026-05-13", valor_pagar: 2000000 }], retenciones: [{ tipo: "Fuente", indicador: "SERVICIOS", valor: 80000, numero_documento: "6200124" }] },
  "9004402539": { nombre: "Proveedor B", estados: [{ numero_factura: "FAC002", fecha_documento: "2026-06-01", valor_pagar: 5000000 }], retenciones: [{ tipo: "ICA", indicador: "ICA", valor: 150000, numero_documento: "6200125" }] },
  "8000183883": { nombre: "Proveedor C", estados: [{ numero_factura: "FAC003", fecha_documento: "2026-06-10", valor_pagar: 3500000 }], retenciones: [{ tipo: "IVA", indicador: "IVA", valor: 525000, numero_documento: "6200126" }] }
}

export default function App() {
  const [messages, setMessages] = useState([{ type: 'bot', text: '¡Hola! ¿Cuál es tu NIT?' }])
  const [userInput, setUserInput] = useState('')
  const [step, setStep] = useState('nit')
  const [userData, setUserData] = useState({})
  const [loading, setLoading] = useState(false)

  const handleSendMessage = () => {
    if (!userInput.trim()) return
    setMessages([...messages, { type: 'user', text: userInput }])
    setUserInput('')
    setLoading(true)
    setTimeout(() => {
      procesarMensaje(userInput)
      setLoading(false)
    }, 500)
  }

  const procesarMensaje = (input) => {
    let response = ''
    if (step === 'nit') {
      const nit = input.trim()
      if (DATOS[nit]) {
        setUserData({ nit, ...DATOS[nit] })
        response = `✓ ${DATOS[nit].nombre}\n\n1️⃣ Estados de Cuentas\n2️⃣ Retenciones Aplicadas\n3️⃣ Envío de Certificados`
        setStep('opcion')
      } else {
        response = '❌ NIT no encontrado'
      }
    } else if (step === 'opcion') {
      if (input === '1') {
        response = `📊 ESTADOS:\n`
        userData.estados.forEach(e => {
          response += `${e.numero_factura} - ${e.fecha_documento} - $${e.valor_pagar}\n`
        })
      } else if (input === '2') {
        response = `💰 RETENCIONES:\n`
        userData.retenciones.forEach(r => {
          response += `${r.tipo}: $${r.valor}\n`
        })
      } else if (input === '3') {
        response = `📄 Certificados: https://oficina.unibol.com.co`
      }
    }
    setMessages(prev => [...prev, { type: 'bot', text: response }])
  }

  return (
    <div style={{ minHeight: '100vh', background: '#f5f5f5', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px' }}>
      <div style={{ display: 'flex', flexDirection: 'column', height: '600px', width: '100%', maxWidth: '500px', background: '#fff', borderRadius: '12px', border: '1px solid #e0e0e0', overflow: 'hidden' }}>
        <div style={{ background: '#d32f2f', color: '#fff', padding: '1rem', textAlign: 'center', fontWeight: 600 }}>UNIBOL - 3 OPCIONES</div>
        <div style={{ flex: 1, overflowY: 'auto', padding: '1rem', display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {messages.map((msg, idx) => (
            <div key={idx} style={{ display: 'flex', justifyContent: msg.type === 'user' ? 'flex-end' : 'flex-start' }}>
              <div style={{ maxWidth: '80%', padding: '10px 14px', borderRadius: '12px', background: msg.type === 'user' ? '#007bff' : '#e9ecef', color: msg.type === 'user' ? '#fff' : '#000', fontSize: '14px', whiteSpace: 'pre-wrap' }}>
                {msg.text}
              </div>
            </div>
          ))}
          {loading && <div style={{ padding: '10px', background: '#e9ecef', borderRadius: '12px' }}>Escribiendo...</div>}
        </div>
        <div style={{ display: 'flex', gap: '8px', padding: '12px', borderTop: '1px solid #e0e0e0' }}>
          <input type="text" placeholder="NIT..." value={userInput} onChange={(e) => setUserInput(e.target.value)} onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()} style={{ flex: 1, border: '1px solid #d0d0d0', borderRadius: '24px', padding: '10px 16px' }} disabled={loading} />
          <button onClick={handleSendMessage} style={{ background: '#d32f2f', color: '#fff', border: 'none', borderRadius: '50%', width: '40px', height: '40px', cursor: 'pointer' }} disabled={loading}>➤</button>
        </div>
      </div>
    </div>
  )
}