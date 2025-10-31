import { useMemo, useState } from 'react';
import { gql } from '@apollo/client';
import { useLazyQuery } from '@apollo/client/react';

const STUDENT_FIELDS = ['id', 'nombre', 'edad', 'carrera'];
const BREED_FIELDS = ['id', 'nombre', 'origen', 'descripcion'];

// Documentos GraphQL
const Q_ESTUDIANTES = gql`
  query GetEstudiantes {
    getEstudiantes {
      id
      nombre
      edad
      carrera
    }
  }
`;

const Q_RAZA = gql`
  query GetRazaByID($id: ID!) {
    getRazaByID(id: $id) {
      id
      nombre
      origen
      descripcion
    }
  }
`;

export default function App() {
  const [resource, setResource] = useState('getEstudiantes'); // getEstudiantes | getRazaByID
  const [studentFields, setStudentFields] = useState(['id', 'nombre']);
  const [breedFields, setBreedFields] = useState(['id', 'nombre']);
  const [breedId, setBreedId] = useState('');

  const [fetchEstudiantes, { data: dataEst, loading: loadingEst, error: errorEst }] = useLazyQuery(Q_ESTUDIANTES);
  const [fetchRaza, { data: dataRaza, loading: loadingRaza, error: errorRaza }] = useLazyQuery(Q_RAZA);

  const selected = resource === 'getEstudiantes' ? studentFields : breedFields;
  const FIELDS = resource === 'getEstudiantes' ? STUDENT_FIELDS : BREED_FIELDS;

  const toggle = (f) => {
    if (resource === 'getEstudiantes') {
      setStudentFields((prev) => (prev.includes(f) ? prev.filter((x) => x !== f) : [...prev, f]));
    } else {
      setBreedFields((prev) => (prev.includes(f) ? prev.filter((x) => x !== f) : [...prev, f]));
    }
  };

  const queryString = useMemo(() => {
    const fields = selected.length ? selected.join('\n      ') : '';
    if (resource === 'getEstudiantes') {
      return `query GetEstudiantes {
  getEstudiantes {
      ${fields}
  }
}`;
    }
    return `query GetRazaByID($id: ID!) {
  getRazaByID(id: $id) {
      ${fields}
  }
}`;
  }, [resource, selected]);

  const run = async () => {
    if (resource === 'getEstudiantes') {
      await fetchEstudiantes();
    } else {
      if (!breedId) return;
      await fetchRaza({ variables: { id: breedId } });
    }
  };

  const loading = loadingEst || loadingRaza;
  const error = errorEst || errorRaza;
  const data = resource === 'getEstudiantes' ? dataEst : dataRaza;

  // Proyectar los campos seleccionados en el render
  const projectData = (raw) => {
    if (!raw) return raw;
    if (resource === 'getEstudiantes') {
      const arr = raw.getEstudiantes || [];
      return {
        getEstudiantes: arr.map((item) =>
          Object.fromEntries(Object.entries(item).filter(([k]) => selected.includes(k)))
        ),
      };
    } else {
      const obj = raw.getRazaByID || {};
      return {
        getRazaByID: Object.fromEntries(Object.entries(obj).filter(([k]) => selected.includes(k))),
      };
    }
  };

  const projected = projectData(data);

  return (
    <div style={styles.page}>
      <header style={styles.header}>
        <div style={styles.brand}>
          <span style={styles.dot} />
          <span style={styles.title}>GraphQL Studio</span>
        </div>
        <div style={styles.subtitle}>Genera y prueba consultas de forma visual</div>
      </header>

      <main style={styles.main}>
        <section style={styles.panelLeft}>
          <h2 style={styles.h2}>Configuración</h2>

          <div style={styles.field}>
            <label style={styles.label}>Recurso</label>
            <select value={resource} onChange={(e) => setResource(e.target.value)} style={styles.select}>
              <option value="getEstudiantes">getEstudiantes</option>
              <option value="getRazaByID">getRazaByID</option>
            </select>
          </div>

          {resource === 'getRazaByID' && (
            <div style={styles.field}>
              <label style={styles.label}>ID de raza</label>
              <input
                value={breedId}
                onChange={(e) => setBreedId(e.target.value)}
                placeholder="p.ej. abys"
                style={styles.input}
              />
              <div style={styles.hint}>Este ID será la variable $id en la consulta.</div>
            </div>
          )}

          <div style={styles.field}>
            <label style={styles.label}>Campos</label>
            <div style={styles.checklist}>
              {FIELDS.map((f) => (
                <label key={f} style={styles.checkboxRow}>
                  <input type="checkbox" checked={selected.includes(f)} onChange={() => toggle(f)} />
                  <span>{f}</span>
                </label>
              ))}
            </div>
          </div>

          <div style={styles.actions}>
            <button
              style={styles.buttonPrimary}
              onClick={run}
              disabled={!selected.length || loading || (resource === 'getRazaByID' && !breedId)}
              title={resource === 'getRazaByID' && !breedId ? 'Ingresa un ID de raza' : ''}
            >
              {loading ? 'Ejecutando…' : 'Ejecutar'}
            </button>
          </div>
        </section>

        <section style={styles.panelRight}>
          <div style={styles.card}>
            <div style={styles.cardHeader}>Vista previa de consulta</div>
            <pre style={styles.code}>{queryString || 'Selecciona campos'}</pre>
            {resource === 'getRazaByID' && (
              <div style={styles.varsBox}>
                Variables:
                <pre style={styles.varsCode}>{JSON.stringify({ id: breedId || '' }, null, 2)}</pre>
              </div>
            )}
          </div>

          <div style={styles.card}>
            <div style={styles.cardHeader}>Resultados</div>
            {loading && <div style={styles.muted}>Cargando…</div>}
            {error && <pre style={styles.code}>{error.message}</pre>}
            {!loading && !error && !projected && <div style={styles.muted}>Sin resultados todavía</div>}
            {!loading && !error && projected && (
              <pre style={styles.code}>{JSON.stringify(projected, null, 2)}</pre>
            )}
          </div>
        </section>
      </main>

      <footer style={styles.footer}>
        <span>Hecho con React + Vite • Query con variables y campos seleccionables</span>
      </footer>
    </div>
  );
}

const styles = {
  page: { minHeight: '100vh', background: 'linear-gradient(180deg,#0b0f14,#0e141b)', color: '#e6eef7', display: 'flex', flexDirection: 'column' },
  header: { padding: '20px 28px', borderBottom: '1px solid rgba(255,255,255,0.06)', display: 'flex', alignItems: 'baseline', gap: 16 },
  brand: { display: 'flex', alignItems: 'center', gap: 10 },
  dot: { width: 10, height: 10, borderRadius: 10, background: 'linear-gradient(135deg,#6ee7ff,#8b5cf6)' },
  title: { fontSize: 18, letterSpacing: 0.5, fontWeight: 600 },
  subtitle: { opacity: 0.7, fontSize: 13 },
  main: { display: 'grid', gridTemplateColumns: '360px 1fr', gap: 20, padding: 24, maxWidth: 1200, width: '100%', margin: '0 auto', flex: 1 },
  panelLeft: { background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)', borderRadius: 14, padding: 16 },
  panelRight: { display: 'grid', gap: 16, alignContent: 'start' },
  h2: { margin: '4px 0 12px', fontSize: 16 },
  field: { marginBottom: 14 },
  label: { display: 'block', fontSize: 12, opacity: 0.8, marginBottom: 6 },
  select: { width: '100%', background: '#121a22', border: '1px solid rgba(255,255,255,0.1)', color: '#e6eef7', padding: '10px 12px', borderRadius: 10, outline: 'none' },
  input: { width: '100%', background: '#121a22', border: '1px solid rgba(255,255,255,0.1)', color: '#e6eef7', padding: '10px 12px', borderRadius: 10, outline: 'none' },
  checklist: { display: 'grid', gap: 8, background: '#0f161d', border: '1px solid rgba(255,255,255,0.06)', borderRadius: 10, padding: 10 },
  checkboxRow: { display: 'flex', alignItems: 'center', gap: 8, fontSize: 14 },
  actions: { marginTop: 12, display: 'flex', gap: 10 },
  buttonPrimary: { background: 'linear-gradient(135deg,#6ee7ff,#8b5cf6)', color: '#0b0f14', border: 'none', padding: '10px 14px', borderRadius: 10, cursor: 'pointer', fontWeight: 600 },
  card: { background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)', borderRadius: 14, overflow: 'hidden' },
  cardHeader: { padding: '10px 12px', borderBottom: '1px solid rgba(255,255,255,0.06)', fontSize: 13, opacity: 0.9 },
  code: { margin: 0, padding: 12, whiteSpace: 'pre-wrap', background: '#0f161d', color: '#d6e3f3', fontFamily: 'ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace', fontSize: 13, lineHeight: 1.4 },
  varsBox: { borderTop: '1px solid rgba(255,255,255,0.06)', padding: 12, background: 'rgba(255,255,255,0.02)' },
  varsCode: { margin: 0, padding: 8, background: '#0f161d', color: '#cfe1f6', fontFamily: 'ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace', fontSize: 12 },
  muted: { opacity: 0.75, padding: 12, fontSize: 14 },
  footer: { padding: 16, borderTop: '1px solid rgba(255,255,255,0.06)', textAlign: 'center', opacity: 0.7, fontSize: 12 },
};
