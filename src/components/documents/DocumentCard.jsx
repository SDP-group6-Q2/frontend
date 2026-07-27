import { Link } from 'react-router-dom';

function DocumentCard({ document }) {
  return (
    <article className="document-card">
      <div className="document-card-icon" aria-hidden="true">
        PDF
      </div>

      <div className="document-card-content">
        <div className="document-card-header">
          <div>
            <p className="document-type">
              {document.documentType}
            </p>

            <h2>{document.title}</h2>
          </div>

          <span className="document-language">
            {document.language}
          </span>
        </div>

        <dl className="document-details">
          <div>
            <dt>Machine</dt>
            <dd>{document.machineName}</dd>
          </div>

          <div>
            <dt>Machine code</dt>
            <dd>{document.machineCode}</dd>
          </div>

          <div>
            <dt>Version</dt>
            <dd>{document.version}</dd>
          </div>

          <div>
            <dt>Last update</dt>
            <dd>
              {new Intl.DateTimeFormat('en-GB').format(
                new Date(document.updatedAt),
              )}
            </dd>
          </div>
        </dl>

        <Link
          to={`/documents/${document.id}`}
          className="primary-button document-open-button"
        >
          Open manual
        </Link>
      </div>
    </article>
  );
}

export default DocumentCard;