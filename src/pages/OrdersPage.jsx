import { useEffect, useMemo, useState } from 'react';

import { getOrdersOverview } from '../api/ordersApi';

const PAGE_SIZE = 8;

const tone = (value = '') => {
  const normalizedValue = String(value).toLowerCase();

  if (/(deliver|install|closed|complete)/.test(normalizedValue)) {
    return 'success';
  }

  if (/(cancel|reject|fail|late)/.test(normalizedValue)) {
    return 'danger';
  }

  if (/(pending|progress|process|open|ship)/.test(normalizedValue)) {
    return 'warning';
  }

  return 'neutral';
};

export default function OrdersPage() {
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [page, setPage] = useState(1);

  useEffect(() => {
    getOrdersOverview()
      .then(setRows)
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
            Commercial
          </p>

          <h1>Orders</h1>

          <p>
            Orders associated with your company.
          </p>
        </div>
      </section>

      <section className="feature-section">
        <div className="page-container">
          {loading ? (
            <div className="empty-state">
              <h2>Loading orders…</h2>
            </div>
          ) : error ? (
            <div className="empty-state">
              <h2>Unable to load orders</h2>
              <p>{error}</p>
            </div>
          ) : !rows.length ? (
            <div className="empty-state">
              <h2>No orders</h2>
              <p>
                There are currently no orders for your company.
              </p>
            </div>
          ) : (
            <>
              <div className="records-grid">
                {visible.map((order) => (
                  <article
                    className="record-card"
                    key={order.id}
                  >
                    <div className="record-card-top">
                      <span
                        className={`status-pill ${tone(
                          order.order_status,
                        )}`}
                      >
                        {order.order_status || 'Unknown'}
                      </span>

                      <span
                        className={`status-pill soft ${tone(
                          order.shipment_status,
                        )}`}
                      >
                        {order.shipment_status || 'No shipment status'}
                      </span>
                    </div>

                    <h2>{order.id}</h2>

                    <p className="record-description">
                      {order.notes || 'AROL order'}
                    </p>

                    <dl className="record-details">
                      <div>
                        <dt>Order date</dt>
                        <dd>
                          {order.order_date || '—'}
                        </dd>
                      </div>

                      <div>
                        <dt>Lines</dt>
                        <dd>
                          {order.line_count ?? '—'}
                        </dd>
                      </div>

                      <div className="record-total">
                        <dt>Total</dt>
                        <dd>
                          {order.net_total == null
                            ? '—'
                            : `${Number(
                                order.net_total,
                              ).toLocaleString(undefined, {
                                maximumFractionDigits: 2,
                              })} ${order.currency ?? ''}`}
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
      aria-label="Orders pages"
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
          aria-current={
            pageNumber === page ? 'page' : undefined
          }
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