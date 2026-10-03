import { Link } from 'react-router-dom';

const services = [
  [
    'Machines',
    '/machines',
    'Company fleet and machine overview.',
    'machines.png',
  ],
  [
    'Alarms',
    '/alarms',
    'Review alarms across your fleet.',
    'alarm.png',
  ],
  [
    'Tickets',
    '/tickets',
    'Check maintenance tickets.',
    'ticket.png',
  ],
  [
    'Orders',
    '/orders',
    'Track company orders.',
    'orders.png',
  ],
  [
    'QR Scanner',
    '/scanner',
    'Open a machine from its QR code.',
    'qr.png',
  ],
  [
    'AI Assistant',
    '/chat',
    'Ask company-wide questions.',
    'ai-assistant.png',
  ],
];

export default function HomePage() {
  return (
    <div>
      <section className="home-hero">
        <div className="page-container">
          <p className="page-eyebrow">
            AROL Customer Platform
          </p>

          <h1>
            Your fleet, service and support in one place.
          </h1>

          <p className="home-hero-description">
            Access your machines, orders, alarms and tickets,
            or ask the AI assistant for support.
          </p>

          <div className="action-row">
            <Link
              className="primary-button"
              to="/machines"
            >
              View machines
            </Link>

            <Link
              className="secondary-button"
              to="/chat"
            >
              Ask AI
            </Link>
          </div>
        </div>
      </section>

      <section className="home-services">
        <div className="page-container">
          <div className="service-grid">
            {services.map(
              ([title, path, description, image]) => (
                <Link
                  to={path}
                  className="service-card"
                  key={path}
                  style={{
                    '--card-image': `url(/dashboard/${image})`,
                  }}
                >
                  <div className="service-card-content">
                    <h3>{title}</h3>
                    <p>{description}</p>
                  </div>

                  <span className="text-link">
                    Open
                  </span>
                </Link>
              ),
            )}
          </div>
        </div>
      </section>
    </div>
  );
}