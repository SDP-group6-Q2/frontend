import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';

import {
  getMachine,
  getLatestTelemetry,
  getMachineAlarms,
  getMachineTickets,
} from '../api/machinesApi';

export default function MachinePage() {
  const { machineId } = useParams();

  const [machine, setMachine] = useState(null);
  const [telemetry, setTelemetry] = useState(null);
  const [alarms, setAlarms] = useState([]);
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    Promise.all([
      getMachine(machineId),
      getLatestTelemetry(machineId),
      getMachineAlarms(machineId),
      getMachineTickets(machineId),
    ])
      .then(([machineData, telemetryData, alarmsData, ticketsData]) => {
        setMachine(machineData);
        setTelemetry(telemetryData);
        setAlarms(alarmsData.rows ?? []);
        setTickets(ticketsData.rows ?? []);
      })
      .catch((error) => {
        setError(error.message);
      })
      .finally(() => {
        setLoading(false);
      });
  }, [machineId]);

  if (loading) {
    return (
      <div className="page-container state-page">
        Loading machine…
      </div>
    );
  }

  if (error || !machine) {
    return (
      <div className="page-container state-page">
        <h1>Machine unavailable</h1>
        <p>{error}</p>
      </div>
    );
  }

  const machineDetails = [
    ['Plant location', machine.plant_location],
    ['Delivery date', machine.delivery_date],
    ['PLC family', machine.plc_family],
    ['Software', machine.software_version],
    ['Configuration', machine.configuration_profile],
    ['Industry', machine.model?.industry_segment],
  ];

  return (
    <div>
      <section className="page-header">
        <div className="page-container">
          <Link
            to="/machines"
            className="text-link"
          >
            ← Machines
          </Link>

          <p className="page-eyebrow">
            {machine.model?.model_code}
          </p>

          <h1>{machine.serial_number}</h1>

          <p>{machine.model?.description}</p>

          <div className="action-row">
            <Link
              className="primary-button"
              to={`/machines/${machineId}/assistant`}
            >
              Assist machine
            </Link>

            <Link
              className="secondary-button"
              to={`/machines/${machineId}/manual`}
            >
              Manual reader
            </Link>
          </div>
        </div>
      </section>

      <section className="feature-section">
        <div className="page-container stack-lg">
          <div className="detail-grid">
            {machineDetails.map(([label, value]) => (
              <div
                className="detail-card"
                key={label}
              >
                <span>{label}</span>
                <strong>{value || '—'}</strong>
              </div>
            ))}
          </div>

          <section>
            <h2>Latest telemetry</h2>

            {telemetry ? (
              <div className="detail-grid">
                <div className="detail-card">
                  <span>Status</span>
                  <strong>
                    {telemetry.operational_status}
                  </strong>
                </div>

                <div className="detail-card">
                  <span>Production</span>
                  <strong>
                    {telemetry.production_rate_bph ?? '—'} bph
                  </strong>
                </div>

                <div className="detail-card">
                  <span>Uptime</span>
                  <strong>
                    {telemetry.uptime_percentage ?? '—'}%
                  </strong>
                </div>

                <div className="detail-card">
                  <span>Temperature</span>
                  <strong>
                    {telemetry.temperature_c ?? '—'} °C
                  </strong>
                </div>
              </div>
            ) : (
              <div className="empty-inline">
                No telemetry available.
              </div>
            )}
          </section>

          <section>
            <h2>Recent alarms</h2>

            {alarms.length ? (
              <div className="table-wrap">
                <table>
                  <thead>
                    <tr>
                      <th>Code</th>
                      <th>Severity</th>
                      <th>Status</th>
                      <th>Date</th>
                    </tr>
                  </thead>

                  <tbody>
                    {alarms.slice(0, 5).map((alarm) => (
                      <tr key={alarm.id}>
                        <td>{alarm.alarm_code}</td>
                        <td>{alarm.severity}</td>
                        <td>{alarm.alarm_status}</td>
                        <td>
                          {new Date(
                            alarm.timestamp,
                          ).toLocaleString()}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="empty-inline">
                No alarms for this machine.
              </div>
            )}
          </section>

          <section>
            <h2>Maintenance tickets</h2>

            {tickets.length ? (
              <div className="table-wrap">
                <table>
                  <thead>
                    <tr>
                      <th>Ticket</th>
                      <th>Type</th>
                      <th>Status</th>
                      <th>Priority</th>
                    </tr>
                  </thead>

                  <tbody>
                    {tickets.slice(0, 5).map((ticket) => (
                      <tr key={ticket.id}>
                        <td>{ticket.id}</td>
                        <td>{ticket.ticket_type}</td>
                        <td>{ticket.ticket_status}</td>
                        <td>{ticket.priority}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="empty-inline">
                No maintenance tickets for this machine.
              </div>
            )}
          </section>
        </div>
      </section>
    </div>
  );
}