import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';

const SERVICES = [
  { title:'Machines', path:'/machines', description:'Company fleet and machine overview.', image:'machines.png', service:'machines' },
  { title:'Alarms', path:'/alarms', description:'Review alarms across your fleet.', image:'alarm.png', service:'operations' },
  { title:'Tickets', path:'/tickets', description:'Check maintenance tickets.', image:'ticket.png', service:'operations' },
  { title:'Orders', path:'/orders', description:'Track company orders.', image:'orders.png', service:'commercial' },
  { title:'QR Scanner', path:'/scanner', description:'Open a machine from its QR code.', image:'qr.png', service:'scanner' },
  { title:'AI Assistant', path:'/chat', description:'Ask company-wide questions.', image:'ai-assistant.png', service:'assistant' },
];

export default function HomePage() {
  const { canAccess } = useAuth();
  const services = SERVICES.filter(({service}) => canAccess(service));
  return <div>
    <section className="home-hero"><div className="page-container"><p className="page-eyebrow">AROL Customer Platform</p><h1>Your fleet, service and support in one place.</h1><p className="home-hero-description">Access the services available for your company account and ask the AI assistant for support.</p><div className="action-row"><Link className="primary-button" to="/machines">View machines</Link><Link className="secondary-button" to="/chat">Ask AI</Link></div></div></section>
    <section className="home-services"><div className="page-container"><div className="service-grid">{services.map(({title,path,description,image}) => <Link to={path} className="service-card" key={path} style={{'--card-image':`url(/dashboard/${image})`}}><div className="service-card-content"><h3>{title}</h3><p>{description}</p><span className="text-link">Open</span></div></Link>)}</div></div></section>
  </div>;
}
