import {
  useEffect,
  useMemo,
  useState,
} from 'react';

import {
  getMachines,
  getMachineAlarms,
} from '../api/machinesApi';

const PAGE_SIZE = 8;

const tone = (value = '') => {
  const normalizedValue = String(value).toLowerCase();

  if (/(critical|high|active|error)/.test(normalizedValue)) {
    return 'danger';
  }

  if (/(warning|medium|ack)/.test(normalizedValue)) {
    return 'warning';
  }

  if (/(clear|closed|resolved|low)/.test(normalizedValue)) {
    return 'success';
  }

  return 'neutral';
};

export default function AlarmsPage() {
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [page, setPage] = useState(1);

  useEffect(() => {
    async function loadAlarms() {
      try {
        const machines = await getMachines();

        const alarmPages = await Promise.all(
          machines.map((machine) => getMachineAlarms(machine.id)),
        );

        const alarms = alarmPages
          .flatMap((alarmPage) => alarmPage.rows ?? [])
          .sort(
            (a, b) =>
              new Date(b.timestamp) - new Date(a.timestamp),
          );

        setRows(alarms);
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    }

    loadAlarms();
  }, []);

  const pages = Math.max(
    1,
    Math.ceil(rows.length / PAGE_SIZE),
  );

  const visible = useMemo(
    () =>
      rows.slice(
        (page - 1) * PAGE_SIZE,
        page * PAGE_SIZE,
      ),
    [rows, page],
  );

  return (
    <div>
      <section className="page-header">
        <div className="page-container">
          <p className="page-eyebrow">
            Monitoring
          </p>

          <h1>Alarms</h1>

          <p>
            Alarm history across your company’s machines.
          </p>
        </div>
      </section>

      <section className="feature-section">
        <div className="page-container">
          {loading ? (
            <div className="empty-state">
              <h2>Loading alarms…</h2>
            </div>
          ) : error ? (
            <div className="empty-state">
              <h2>Unable to load alarms</h2>
              <p>{error}</p>
            </div>
          ) : !rows.length ? (
            <div className="empty-state">
              <h2>No alarms</h2>
              <p>
                No alarms are available for your machines.
              </p>
            </div>
          ) : (
            <>
              <div className="records-grid">
                {visible.map((alarm) => (
                  <article
                    className="record-card"
                    key={alarm.id}
                  >
                    <div className="record-card-top">
                      <span
                        className={`status-pill ${tone(alarm.severity)}`}
                      >
                        {alarm.severity || 'Unknown severity'}
                      </span>

                      <span
                        className={`status-pill soft ${tone(
                          alarm.alarm_status,
                        )}`}
                      >
                        {alarm.alarm_status || 'Unknown status'}
                      </span>
                    </div>

                    <h2>
                      {alarm.alarm_code || alarm.id}
                    </h2>

                    <dl className="record-details">
                      <div>
                        <dt>Machine</dt>
                        <dd>{alarm.machine_id || '—'}</dd>
                      </div>

                      <div>
                        <dt>Date</dt>
                        <dd>
                          {alarm.timestamp
                            ? new Date(
                                alarm.timestamp,
                              ).toLocaleString()
                            : '—'}
                        </dd>
                      </div>
                    </dl>
                  </article>
                ))}
              </div>

              <Pagination
                page={page}
                pages={pages}
                setPage={setPage}
              />
            </>
          )}
        </div>
      </section>
    </div>
  );
}

function Pagination({
  page,
  pages,
  setPage,
}) {
  if (pages <= 1) {
    return null;
  }

  return (
    <nav
      className="pagination"
      aria-label="Alarm pages"
    >
      <button
        disabled={page === 1}
        onClick={() => setPage((currentPage) => currentPage - 1)}
      >
        Previous
      </button>

      {Array.from(
        { length: pages },
        (_, index) => index + 1,
      ).map((pageNumber) => (
        <button
          key={pageNumber}
          className={pageNumber === page ? 'active' : ''}
          onClick={() => setPage(pageNumber)}
        >
          {pageNumber}
        </button>
      ))}

      <button
        disabled={page === pages}
        onClick={() => setPage((currentPage) => currentPage + 1)}
      >
        Next
      </button>
    </nav>
  );
}