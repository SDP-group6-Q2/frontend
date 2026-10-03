import { useEffect, useMemo, useState } from 'react';

import { getTickets } from '../api/ticketsApi';

const PAGE_SIZE = 8;

const tone = (value = '') => {
  const normalizedValue = String(value).toLowerCase();

  if (/(closed|resolved|complete|low)/.test(normalizedValue)) {
    return 'success';
  }

  if (/(critical|urgent|high|fail)/.test(normalizedValue)) {
    return 'danger';
  }

  if (/(open|progress|medium|pending)/.test(normalizedValue)) {
    return 'warning';
  }

  return 'neutral';
};

export default function TicketsPage() {
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [page, setPage] = useState(1);

  useEffect(() => {
    getTickets()
      .then((data) => {
        setRows(data.rows ?? []);
      })
      .catch((error) => {
        setError(error.message);
      })
      .finally(() => {
        setLoading(false);
      });
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
            Service
          </p>

          <h1>Tickets</h1>

          <p>
            Maintenance tickets for your company’s machines.
          </p>
        </div>
      </section>

      <section className="feature-section">
        <div className="page-container">
          {loading ? (
            <div className="empty-state">
              <h2>Loading tickets…</h2>
            </div>
          ) : error ? (
            <div className="empty-state">
              <h2>Unable to load tickets</h2>
              <p>{error}</p>
            </div>
          ) : !rows.length ? (
            <div className="empty-state">
              <h2>No tickets</h2>
              <p>
                There are currently no maintenance tickets.
              </p>
            </div>
          ) : (
            <>
              <div className="records-grid">
                {visible.map((ticket) => (
                  <article
                    className="record-card"
                    key={ticket.id}
                  >
                    <div className="record-card-top">
                      <span
                        className={`status-pill ${tone(
                          ticket.ticket_status,
                        )}`}
                      >
                        {ticket.ticket_status || 'Unknown'}
                      </span>

                      <span
                        className={`status-pill soft ${tone(
                          ticket.priority,
                        )}`}
                      >
                        {ticket.priority || 'No priority'}
                      </span>
                    </div>

                    <h2>{ticket.id}</h2>

                    <p className="record-description">
                      {ticket.ticket_type || 'Maintenance ticket'}
                    </p>

                    <dl className="record-details">
                      <div>
                        <dt>Machine</dt>
                        <dd>
                          {ticket.machine_id || '—'}
                        </dd>
                      </div>

                      <div>
                        <dt>Created</dt>
                        <dd>
                          {ticket.created_date || '—'}
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
      aria-label="Ticket pages"
    >
      <button
        disabled={page === 1}
        onClick={() =>
          setPage((currentPage) => currentPage - 1)
        }
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
        onClick={() =>
          setPage((currentPage) => currentPage + 1)
        }
      >
        Next
      </button>
    </nav>
  );
}