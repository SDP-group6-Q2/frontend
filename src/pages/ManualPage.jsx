import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';

import { getManual } from '../api/manualsApi';

export default function ManualPage() {
  const { machineId } = useParams();

  const [manual, setManual] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    getManual(machineId)
      .then(setManual)
      .catch((error) => {
        setError(error.message);
      })
      .finally(() => {
        setLoading(false);
      });
  }, [machineId]);

  return (
    <div>
      <section className="page-header">
        <div className="page-container">
          <Link
            to={`/machines/${machineId}`}
            className="text-link"
          >
            ← Machine overview
          </Link>

          <p className="page-eyebrow">
            Documentation
          </p>

          <h1>
            Manual · {machineId}
          </h1>
        </div>
      </section>

      <section className="feature-section">
        <div className="page-container">
          {loading ? (
            <div className="empty-state">
              <h2>Loading manual…</h2>
            </div>
          ) : error ? (
            <div className="empty-state">
              <h2>Manual unavailable</h2>
              <p>{error}</p>
            </div>
          ) : (
            <div className="manual-shell">
              <iframe
                title={`Manual ${machineId}`}
                src={manual.url}
              />

              <a
                className="secondary-button"
                href={manual.url}
                target="_blank"
                rel="noreferrer"
              >
                Open PDF in new tab
              </a>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}