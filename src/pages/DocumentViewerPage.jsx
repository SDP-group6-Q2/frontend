import { Link, useParams } from 'react-router-dom';
import { mockDocuments } from '../mocks/documents';

function DocumentViewerPage() {
  const { documentId } = useParams();

  const document = mockDocuments.find(
    (item) => item.id === documentId,
  );

  if (!document) {
    return (
      <section className="document-viewer-page">
        <div className="page-container">
          <div className="empty-state">
            <div className="empty-state-icon" aria-hidden="true">
              DOC
            </div>

            <h1>Document not found</h1>

            <p>
              The requested document is not available.
            </p>

            <Link to="/documents" className="secondary-button">
              Back to Documents
            </Link>
          </div>
        </div>
      </section>
    );
  }

  return (
    <div className="document-viewer-page">
      <section className="document-viewer-header">
        <div className="page-container document-viewer-header-content">
          <div>
            <p className="page-eyebrow">
              {document.documentType}
            </p>

            <h1>{document.title}</h1>

            <p>
              {document.machineName} · {document.machineCode}
            </p>
          </div>

          <Link to="/documents" className="viewer-back-button">
            Back to Documents
          </Link>
        </div>
      </section>

      <section className="document-viewer-content">
        <div className="page-container document-viewer-container">
          <iframe
            className="pdf-viewer"
            src={document.fileUrl}
            title={document.title}
          />
        </div>
      </section>
    </div>
  );
}

export default DocumentViewerPage;