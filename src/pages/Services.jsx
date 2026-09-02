import { useState, useEffect } from 'react';

function Services() {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetch('/data/services.json')
      .then((response) => {
        if (!response.ok) {
          throw new Error('Failed to load services');
        }
        return response.json();
      })
      .then((data) => {
        setServices(data);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message);
        setLoading(false);
      });
  }, []);

  if (loading) {
    return (
      <main>
        <h1>Services</h1>
        <p>Loading services...</p>
      </main>
    );
  }

  if (error) {
    return (
      <main>
        <h1>Services</h1>
        <p>Unable to load services.</p>
      </main>
    );
  }

  return (
    <main>
      <h1>Services</h1>
      <ul>
        {services.map((service) => (
          <li key={service.id}>
            <h3>{service.name}</h3>
            <p>Category: {service.category}</p>
            <p>Price: ${service.price}</p>
          </li>
        ))}
      </ul>
    </main>
  );
}

export default Services;