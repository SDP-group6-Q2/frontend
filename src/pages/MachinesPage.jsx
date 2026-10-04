import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

import { getMachines } from '../api/machinesApi';

export default function MachinesPage() {
  const [machines, setMachines] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    getMachines()
      .then(setMachines)
      .catch((error) => {
        setError(error.message);
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  return (
    <div>
      <section className="page-header">
        <div className="page-container">
          <p className="page-eyebrow">
            Fleet
          </p>

          <h1>Machines</h1>

          <p>
            Machines registered to your company.
          </p>
        </div>
      </section>

      <section className="feature-section">
        <div className="page-container">
          {loading ? (
            <div className="empty-state">
              <h2>Loading machines…</h2>
            </div>
          ) : error ? (
            <div className="empty-state">
              <h2>Unable to load machines</h2>
              <p>{error}</p>
            </div>
          ) : machines.length === 0 ? (
            <div className="empty-state">
              <h2>No machines available</h2>
              <p>
                There are no machines associated with your company.
              </p>
            </div>
          ) : (
            <div className="data-grid">
              {machines.map((machine) => (
                <Link
                  className="data-card"
                  to={`/machines/${machine.id}`}
                  key={machine.id}
                >
                  <span className="card-kicker">
                    {machine.model?.model_code ?? 'AROL machine'}
                  </span>

                  <h2>{machine.serial_number}</h2>

                  <p>
                    {machine.model?.description ?? 'Machine overview'}
                  </p>

                  <dl className="mini-details">
                    <div>
                      <dt>Location</dt>
                      <dd>
                        {machine.plant_location || '—'}
                      </dd>
                    </div>

                    <div>
                      <dt>Software</dt>
                      <dd>
                        {machine.software_version || '—'}
                      </dd>
                    </div>
                  </dl>

                  <span className="text-link">
                    View machine →
                  </span>
                </Link>
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  );
}