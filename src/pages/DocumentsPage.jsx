import DocumentCard from '../components/documents/DocumentCard';
import { mockDocuments } from '../mocks/documents';

function DocumentsPage() {
  const documents = mockDocuments;

  return (
    <div className="documents-page">
      <section className="page-header">
        <div className="page-container">
          <p className="page-eyebrow">Technical documentation</p>

          <h1>Machine Documents</h1>

          <p>
            Browse the manuals and technical documentation associated
            with your machines.
          </p>
        </div>
      </section>

      <section className="documents-content">
        <div className="page-container">
          {documents.length > 0 ? (
            <div className="documents-grid">
              {documents.map((document) => (
                <DocumentCard
                  key={document.id}
                  document={document}
                />
              ))}
            </div>
          ) : (
            <div className="empty-state">
              <div className="empty-state-icon" aria-hidden="true">
                DOC
              </div>

              <h2>No documents available</h2>

              <p>
                There are currently no machine manuals or technical
                documents available for this account.
              </p>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}

export default DocumentsPage;