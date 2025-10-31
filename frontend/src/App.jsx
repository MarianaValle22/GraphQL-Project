import { useState } from 'react';

export default function App() {
  const [status, setStatus] = useState('listo');

  const handleTest = () => {
    console.log('click');
    setStatus('botón presionado');
  };

  return (
    <div style={{ padding: 24, fontFamily: 'sans-serif' }}>
      <h1>Frontend listo</h1>
      <button onClick={handleTest} style={{ padding: 8 }}>Probar API</button>
      <p style={{ marginTop: 12 }}>Estado: {status}</p>
    </div>
  );
}
