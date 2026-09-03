import { Link } from 'react-router-dom';
import { useAppContext } from '../context/AppContext';

function Dashboard() {
  const { selectedServices } = useAppContext();
  const myServicesCount = selectedServices.length;

  return (
    <main>
      <h1>Welcome to ServiceHub</h1>
      <p>
        Manage and explore your available services in one place. Browse the
        services catalogue, view details, and keep track of the services you
        have selected.
      </p>

      <section className="dashboard-summary">
        <h2>My Services: {myServicesCount}</h2>
        <p>
          {myServicesCount === 0
            ? 'You have not added any services yet.'
            : `You currently have ${myServicesCount} service${
                myServicesCount === 1 ? '' : 's'
              } selected.`}
        </p>
      </section>

      <section className="dashboard-actions">
        <Link to="/services" className="btn-primary">
          Browse Services
        </Link>
        <Link to="/my-services" className="btn-back">
          View My Services
        </Link>
      </section>
    </main>
  );
}

export default Dashboard;