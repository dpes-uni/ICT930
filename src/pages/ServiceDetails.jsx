import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useAppContext } from '../context/AppContext';

function ServiceDetails() {
  const { id } = useParams();
  const { addService, selectedServices } = useAppContext();
  const [service, setService] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetch('/data/services.json')
      .then((response) => {
        if (!response.ok) {
          throw new Error('Failed to load service');
        }
        return response.json();
      })
      .then((data) => {
        const found = data.find((s) => s.id === parseInt(id, 10));
        setService(found || null);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message);
        setLoading(false);
      });
  }, [id]);

  if (loading) {
    return (
      <main>
        <h1>Service Details</h1>
        <p>Loading service...</p>
      </main>
    );
  }

  if (error) {
    return (
      <main>
        <h1>Service Details</h1>
        <p>Unable to load service.</p>
      </main>
    );
  }

  if (!service) {
    return (
      <main>
        <h1>Service Details</h1>
        <p>Service not found.</p>
        <Link to="/services">Back to Services</Link>
      </main>
    );
  }

  const isAdded = selectedServices.some((s) => s.id === service.id);

  return (
    <main>
      <h1>Service Details</h1>
      <div className="service-details">
        <h2>{service.name}</h2>
        <p className="detail-category">{service.category}</p>
        <p className="detail-description">{service.description}</p>
        <p className="detail-price">${service.price}</p>
        <div className="actions">
          {isAdded ? (
            <button type="button" disabled className="btn-disabled">
              Already Added
            </button>
          ) : (
            <button
              type="button"
              className="btn-primary"
              onClick={() => addService(service)}
            >
              Add Service
            </button>
          )}
          <Link to="/services" className="btn-back">
            Back to Services
          </Link>
        </div>
      </div>
    </main>
  );
}

export default ServiceDetails;