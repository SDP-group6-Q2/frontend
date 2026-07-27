import { Link } from 'react-router-dom';

function HomePage() {
  return (
    <div className="home-page">
      <section className="home-hero">
        <div className="page-container">
          <p className="page-eyebrow">AROL Customer Platform</p>

          <h1>Your machine information, all in one place.</h1>

          <p className="home-hero-description">
            Access technical documentation and use the AI assistant
            to receive support about your AROL machines.
          </p>
        </div>
      </section>

      <section className="home-services">
        <div className="page-container">
          <div className="section-heading">
            <p className="page-eyebrow">Platform services</p>
            <h2>How can we help you?</h2>
          </div>

          <div className="service-grid">
            <article className="service-card">
              <div className="service-icon" aria-hidden="true">
                AI
              </div>

              <div className="service-card-content">
                <h3>AI Assistant</h3>

                <p>
                  Ask questions about your machine, technical
                  documentation and maintenance procedures.
                </p>
              </div>

              <Link to="/chat" className="primary-button">
                Open AI Assistant
              </Link>
            </article>

            <article className="service-card">
              <div className="service-icon" aria-hidden="true">
                DOC
              </div>

              <div className="service-card-content">
                <h3>Machine Documents</h3>

                <p>
                  Access machine manuals and technical documents
                  available for your equipment.
                </p>
              </div>

              <Link to="/documents" className="secondary-button">
                Open Documents
              </Link>
            </article>
          </div>
        </div>
      </section>
    </div>
  );
}

export default HomePage;