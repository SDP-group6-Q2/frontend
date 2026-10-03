import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { getManual } from '../api/manualsApi';

export default function ManualPage() {
  const { machineId } = useParams();
  const [manual, setManual] = useState(null);
  const [loading, setLoading] = useState(true);
  const [opening, setOpening] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => { getManual(machineId).then(setManual).catch((e) => setError(e.message)).finally(() => setLoading(false)); }, [machineId]);

  async function openFreshManual() {
    const popup = window.open('', '_blank');
    setOpening(true);
    try {
      const fresh = await getManual(machineId);
      setManual(fresh);
      if (popup) popup.location.href = fresh.url;
      else window.location.assign(fresh.url);
    } catch (e) {
      if (popup) popup.close();
      setError(e.message);
    } finally { setOpening(false); }
  }

  return <div><section className="page-header"><div className="page-container"><Link to={`/machines/${machineId}`} className="text-link">← Machine overview</Link><p className="page-eyebrow">Documentation</p><h1>Manual · {machineId}</h1></div></section><section className="feature-section"><div className="page-container">
    {loading ? <div className="empty-state"><h2>Loading manual…</h2></div> : error && !manual ? <div className="empty-state"><h2>Manual unavailable</h2><p>{error}</p></div> : <div className="manual-shell"><iframe title={`Manual ${machineId}`} src={manual?.url}/><button className="secondary-button" type="button" onClick={openFreshManual} disabled={opening}>{opening ? 'Opening…' : 'Open PDF in new tab'}</button>{error && <p className="form-error">{error}</p>}</div>}
  </div></section></div>;
}
