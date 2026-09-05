import { useAuth } from '../context/AuthContext.jsx';

function ProfilePage() {
  const { user } = useAuth();

  if (!user) {
    return null;
  }

  const initials = `${user.firstName?.[0] ?? ''}${user.lastName?.[0] ?? ''}`;

  return (
    <div className="profile-page">
      <section className="page-header">
        <div className="page-container">
          <p className="page-eyebrow">
            Account
          </p>

          <h1>Profile</h1>

          <p>
            View your personal information and account details.
          </p>
        </div>
      </section>

      <section className="profile-content">
        <div className="page-container">
          <div className="profile-layout">

            <aside className="profile-summary-card">
              <div className="profile-avatar">
                {initials}
              </div>

              <h2>
                {user.firstName} {user.lastName}
              </h2>

              <p className="profile-job-title">
                {user.jobTitle || 'No job title available'}
              </p>

              <span className="profile-visibility">
                {user.visibility}
              </span>

              <div className="profile-company-summary">
                <span>Company</span>
                <strong>{user.companyId}</strong>
              </div>
            </aside>

            <section className="profile-details-card">
              <div className="profile-section-heading">
                <p className="page-eyebrow">
                  User information
                </p>

                <h2>Personal details</h2>

                <p>
                  Information associated with your AROL Customer Platform
                  account.
                </p>
              </div>

              <dl className="profile-details-grid">
                <div className="profile-detail-item">
                  <dt>First name</dt>
                  <dd>{user.firstName}</dd>
                </div>

                <div className="profile-detail-item">
                  <dt>Last name</dt>
                  <dd>{user.lastName}</dd>
                </div>

                <div className="profile-detail-item profile-detail-wide">
                  <dt>Email address</dt>
                  <dd>{user.email}</dd>
                </div>

                <div className="profile-detail-item">
                  <dt>Job title</dt>
                  <dd>{user.jobTitle || '—'}</dd>
                </div>

                <div className="profile-detail-item">
                  <dt>Visibility</dt>
                  <dd className="profile-detail-capitalize">
                    {user.visibility}
                  </dd>
                </div>

                <div className="profile-detail-item">
                  <dt>User ID</dt>
                  <dd>{user.userId}</dd>
                </div>

                <div className="profile-detail-item">
                  <dt>Company ID</dt>
                  <dd>{user.companyId}</dd>
                </div>
              </dl>
            </section>

          </div>
        </div>
      </section>
    </div>
  );
}

export default ProfilePage;