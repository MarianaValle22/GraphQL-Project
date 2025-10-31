import { useMemo, useState, useEffect, useRef } from 'react';
import { gql } from '@apollo/client';
import { useLazyQuery } from '@apollo/client/react';

// Cat breeds (id -> nombre) para autocompletado estático
const TOP_BREEDS = [
  { id: 'abys', nombre: 'Abyssinian' },
  { id: 'aege', nombre: 'Aegean' },
  { id: 'abob', nombre: 'American Bobtail' },
  { id: 'acur', nombre: 'American Curl' },
  { id: 'asho', nombre: 'American Shorthair' },
  { id: 'awir', nombre: 'American Wirehair' },
  { id: 'amau', nombre: 'Arabian Mau' },
  { id: 'abas', nombre: 'Australian Mist' },
  { id: 'bali', nombre: 'Balinese' },
  { id: 'bamb', nombre: 'Bambino' },
  { id: 'beng', nombre: 'Bengal' },
  { id: 'birm', nombre: 'Birman' },
  { id: 'bomb', nombre: 'Bombay' },
  { id: 'bslo', nombre: 'British Longhair' },
  { id: 'bsho', nombre: 'British Shorthair' },
  { id: 'buri', nombre: 'Burmese' },
  { id: 'bure', nombre: 'Burmilla' },
  { id: 'cspa', nombre: 'California Spangled' },
  { id: 'ctif', nombre: 'Chantilly-Tiffany' },
  { id: 'char', nombre: 'Chartreux' },
  { id: 'chau', nombre: 'Chausie' },
  { id: 'chee', nombre: 'Cheetoh' },
  { id: 'csho', nombre: 'Colorpoint Shorthair' },
  { id: 'crex', nombre: 'Cornish Rex' },
  { id: 'cymr', nombre: 'Cymric' },
  { id: 'cypr', nombre: 'Cyprus' },
  { id: 'drex', nombre: 'Devon Rex' },
  { id: 'dshi', nombre: 'Domestic Short Hair' },
  { id: 'dupa', nombre: 'Donskoy' },
  { id: 'lihu', nombre: 'Dragon Li' },
  { id: 'emau', nombre: 'Egyptian Mau' },
  { id: 'ebur', nombre: 'European Burmese' },
  { id: 'esho', nombre: 'Exotic Shorthair' },
  { id: 'hbro', nombre: 'Havana Brown' },
  { id: 'hima', nombre: 'Himalayan' },
  { id: 'japa', nombre: 'Japanese Bobtail' },
  { id: 'java', nombre: 'Javanese' },
  { id: 'khao', nombre: 'Khao Manee' },
  { id: 'kora', nombre: 'Korat' },
  { id: 'kuri', nombre: 'Kurilian' },
  { id: 'lape', nombre: 'LaPerm' },
  { id: 'mcoo', nombre: 'Maine Coon' },
  { id: 'mala', nombre: 'Malayan' },
  { id: 'manc', nombre: 'Munchkin' },
  { id: 'muns', nombre: 'Munchkin Longhair' },
  { id: 'nebe', nombre: 'Nebelung' },
  { id: 'norw', nombre: 'Norwegian Forest Cat' },
  { id: 'ocic', nombre: 'Ocicat' },
  { id: 'orie', nombre: 'Oriental' },
  { id: 'pers', nombre: 'Persian' },
  { id: 'pixi', nombre: 'Pixie-bob' },
  { id: 'raga', nombre: 'Ragamuffin' },
  { id: 'ragd', nombre: 'Ragdoll' },
  { id: 'rblu', nombre: 'Russian Blue' },
  { id: 'sava', nombre: 'Savannah' },
  { id: 'sfol', nombre: 'Scottish Fold' },
  { id: 'sfra', nombre: 'Scottish Straight' },
  { id: 'sphy', nombre: 'Sphynx' },
  { id: 'siam', nombre: 'Siamese' },
  { id: 'sibe', nombre: 'Siberian' },
  { id: 'sing', nombre: 'Singapura' },
  { id: 'snow', nombre: 'Snowshoe' },
  { id: 'soma', nombre: 'Somali' },
  { id: 'tonk', nombre: 'Tonkinese' },
  { id: 'toyg', nombre: 'Toyger' },
  { id: 'tman', nombre: 'Turkish Angora' },
  { id: 'tbal', nombre: 'Turkish Van' },
  { id: 'ycho', nombre: 'York Chocolate' },
];


const STUDENT_FIELDS = ['id', 'nombre', 'edad', 'carrera'];
const BREED_FIELDS = ['id', 'nombre', 'origen', 'descripcion'];

// GraphQL
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

  // Autocompletado
  const [search, setSearch] = useState('');
  const [breedId, setBreedId] = useState('');
  const [openMenu, setOpenMenu] = useState(false);
  const menuRef = useRef(null);

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

  // Opciones de autocompletado (filtra sobre las 15)
  const breedOptions = useMemo(() => {
    if (!search.trim()) return TOP_BREEDS;
    const s = search.toLowerCase();
    return TOP_BREEDS.filter(b => b.nombre.toLowerCase().includes(s));
  }, [search]);

  const onPickBreed = (opt) => {
    setSearch(opt.nombre);
    setBreedId(opt.id);
    setOpenMenu(false);
  };

  useEffect(() => {
    const onClick = (e) => {
      if (!menuRef.current) return;
      if (!menuRef.current.contains(e.target)) setOpenMenu(false);
    };
    window.addEventListener('click', onClick);
    return () => window.removeEventListener('click', onClick);
  }, []);

  // Datos y proyección
  const loading = loadingEst || loadingRaza;
  const error = errorEst || errorRaza;
  const data = resource === 'getEstudiantes' ? dataEst : dataRaza;

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
              <label style={styles.label}>Buscar raza</label>
              <div style={styles.comboWrap} ref={menuRef}>
                <input
                  value={search}
                  onChange={(e) => { setSearch(e.target.value); setOpenMenu(true); }}
                  onFocus={() => setOpenMenu(true)}
                  placeholder="Escribe el nombre (p. ej. Bengal)"
                  style={styles.input}
                />
                {openMenu && breedOptions.length > 0 && (
                  <div style={styles.menu}>
                    {breedOptions.map(opt => (
                      <div key={opt.id} style={styles.menuItem} onClick={() => onPickBreed(opt)}>
                        <span style={styles.menuName}>{opt.nombre}</span>
                        <span style={styles.menuId}>{opt.id}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <label style={{ ...styles.label, marginTop: 10 }}>ID seleccionado</label>
              <input
                value={breedId}
                onChange={(e) => setBreedId(e.target.value)}
                placeholder="ID (p. ej. abys)"
                style={styles.input}
              />
              <div style={styles.hint}>
                Si no aparece en el Top 15, escribe el ID manualmente y ejecuta la consulta.
              </div>
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
              title={resource === 'getRazaByID' && !breedId ? 'Ingresa o elige una raza' : ''}
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
        <span>Hecho con React + Vite • Autocompletado Top‑15 y estilo mejorado</span>
      </footer>
    </div>
  );
}

const styles = {
  page: { minHeight: '100vh', background: 'linear-gradient(180deg,#0a0f1a,#0c1220)', color: '#eef3fb', display: 'flex', flexDirection: 'column', fontFamily: 'Inter, ui-sans-serif, system-ui, -apple-system, Segoe UI, Roboto, Ubuntu, Cantarell, Noto Sans, Helvetica Neue, Arial, sans-serif' },
  header: { padding: '22px 28px', borderBottom: '1px solid rgba(255,255,255,0.08)', display: 'flex', alignItems: 'baseline', gap: 16 },
  brand: { display: 'flex', alignItems: 'center', gap: 10 },
  dot: { width: 12, height: 12, borderRadius: 12, background: 'linear-gradient(135deg,#60a5fa,#a78bfa)' },
  title: { fontSize: 22, letterSpacing: 0.2, fontWeight: 700 },
  subtitle: { opacity: 0.75, fontSize: 13 },
  main: { display: 'grid', gridTemplateColumns: '380px 1fr', gap: 20, padding: 24, maxWidth: 1200, width: '100%', margin: '0 auto', flex: 1 },

  // Panel izquierdo con recorte para que el dropdown no se “salga”
  panelLeft: { background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 16, padding: 16, overflow: 'hidden' },
  panelRight: { display: 'grid', gap: 16, alignContent: 'start' },

  h2: { margin: '4px 0 12px', fontSize: 16, fontWeight: 700 },
  // position: relative para posicionar el menú respecto al campo
  field: { marginBottom: 14, position: 'relative' },
  label: { display: 'block', fontSize: 12, opacity: 0.85, marginBottom: 6 },

  // Inputs coherentes
  select: { width: '100%', background: '#0f1725', border: '1px solid rgba(255,255,255,0.16)', color: '#eef3fb', padding: '12px 14px', borderRadius: 12, outline: 'none', fontFamily: 'inherit' },
  input: { width: '100%', background: '#0f1725', border: '1px solid rgba(255,255,255,0.16)', color: '#eef3fb', padding: '12px 14px', borderRadius: 12, outline: 'none', fontFamily: 'inherit' },

  checklist: { display: 'grid', gap: 8, background: '#0b1320', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 12, padding: 10 },
  checkboxRow: { display: 'flex', alignItems: 'center', gap: 8, fontSize: 14 },

  actions: { marginTop: 12, display: 'flex', gap: 10 },

  // Botón rosado con gradiente
  buttonPrimary: { background: 'linear-gradient(135deg,#f472b6,#f0abfc)', color: '#100a13', border: 'none', padding: '12px 16px', borderRadius: 12, cursor: 'pointer', fontWeight: 700, boxShadow: '0 8px 20px rgba(240,171,252,0.25)' },

  card: { background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 16, overflow: 'hidden' },
  cardHeader: { padding: '10px 12px', borderBottom: '1px solid rgba(255,255,255,0.08)', fontSize: 13, opacity: 0.9, fontWeight: 600 },
  code: { margin: 0, padding: 12, whiteSpace: 'pre-wrap', background: '#0b1320', color: '#dbe8ff', fontFamily: 'ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace', fontSize: 13, lineHeight: 1.4 },
  varsBox: { borderTop: '1px solid rgba(255,255,255,0.08)', padding: 12, background: 'rgba(255,255,255,0.03)' },
  varsCode: { margin: 0, padding: 8, background: '#0b1320', color: '#cfe1ff', fontFamily: 'ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace', fontSize: 12 },
  muted: { opacity: 0.78, padding: 12, fontSize: 14 },
  footer: { padding: 16, borderTop: '1px solid rgba(255,255,255,0.08)', textAlign: 'center', opacity: 0.75, fontSize: 12 },

  comboWrap: { position: 'relative' },
  // Menú recortado dentro del panel
  menu: { position: 'absolute', top: '100%', left: 0, right: 0, background: '#0b1320', border: '1px solid rgba(255,255,255,0.12)', borderRadius: 12, marginTop: 6, maxHeight: 220, overflowY: 'auto', zIndex: 1, boxShadow: '0 12px 28px rgba(0,0,0,0.45)' },
  menuItem: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px 12px', cursor: 'pointer', borderBottom: '1px solid rgba(255,255,255,0.06)' },
  menuName: { fontSize: 14 },
  menuId: { opacity: 0.65, fontSize: 12 },
  hint: { opacity: 0.7, fontSize: 12, marginTop: 8 },
};
