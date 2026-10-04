import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';
import { getMachine, getLatestTelemetry, getMachineAlarms, getMachineTickets } from '../api/machinesApi';

export default function MachinePage() {
  const { machineId } = useParams();
  const { canAccess } = useAuth();
  const operational = canAccess('operations');
  const [machine,setMachine]=useState(null), [telemetry,setTelemetry]=useState(null), [alarms,setAlarms]=useState([]), [tickets,setTickets]=useState([]);
  const [loading,setLoading]=useState(true), [error,setError]=useState('');

  useEffect(() => {
    let active = true;
    async function load() {
      try {
        const machineData = await getMachine(machineId);
        if (!active) return;
        setMachine(machineData);
        if (operational) {
          const [telemetryData, alarmsData, ticketsData] = await Promise.all([getLatestTelemetry(machineId), getMachineAlarms(machineId), getMachineTickets(machineId)]);
          if (!active) return;
          setTelemetry(telemetryData); setAlarms(alarmsData.rows ?? []); setTickets(ticketsData.rows ?? []);
        }
      } catch (e) { if (active) setError(e.message); } finally { if (active) setLoading(false); }
    }
    load(); return () => { active=false; };
  }, [machineId, operational]);

  if (loading) return <div className="page-container state-page">Loading machine…</div>;
  if (error || !machine) return <div className="page-container state-page"><h1>Machine unavailable</h1><p>{error}</p></div>;
  const details=[['Plant location',machine.plant_location],['Delivery date',machine.delivery_date],['PLC family',machine.plc_family],['Software',machine.software_version],['Configuration',machine.configuration_profile],['Industry',machine.model?.industry_segment]];
  return <div><section className="page-header"><div className="page-container"><Link to="/machines" className="text-link">← Machines</Link><p className="page-eyebrow">{machine.model?.model_code}</p><h1>{machine.serial_number}</h1><p>{machine.model?.description}</p><div className="action-row"><Link className="primary-button" to={`/machines/${machineId}/assistant`}>Assist machine</Link><Link className="secondary-button" to={`/machines/${machineId}/manual`}>Manual reader</Link></div></div></section>
  <section className="feature-section"><div className="page-container stack-lg"><div className="detail-grid">{details.map(([l,v])=><div className="detail-card" key={l}><span>{l}</span><strong>{v || '—'}</strong></div>)}</div>
  {operational && <><section><h2>Latest telemetry</h2>{telemetry ? <div className="detail-grid"><div className="detail-card"><span>Status</span><strong>{telemetry.operational_status || '—'}</strong></div><div className="detail-card"><span>Production</span><strong>{telemetry.production_rate_bph ?? '—'} bph</strong></div><div className="detail-card"><span>Uptime</span><strong>{telemetry.uptime_percentage ?? '—'}%</strong></div><div className="detail-card"><span>Temperature</span><strong>{telemetry.temperature_c ?? '—'} °C</strong></div></div>:<div className="empty-inline">No telemetry available.</div>}</section>
  <section><h2>Recent alarms</h2>{alarms.length ? <div className="records-grid">{alarms.slice(0,4).map(a=><article className="record-card" key={a.id}><h3>{a.alarm_code || a.id}</h3><p>{a.severity || '—'} · {a.alarm_status || '—'}</p></article>)}</div>:<div className="empty-inline">No alarms for this machine.</div>}</section>
  <section><h2>Maintenance tickets</h2>{tickets.length ? <div className="records-grid">{tickets.slice(0,4).map(t=><article className="record-card" key={t.id}><h3>{t.id}</h3><p>{t.ticket_type || 'Maintenance'} · {t.ticket_status || '—'}</p></article>)}</div>:<div className="empty-inline">No maintenance tickets for this machine.</div>}</section></>}
  </div></section></div>;
}
