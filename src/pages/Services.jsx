import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import ServiceCard from '../components/ServiceCard';

function Services() {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');

  useEffect(() => {
    fetch(`${import.meta.env.BASE_URL}data/services.json`)
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

  const filteredServices = services.filter((service) => {
    const matchesCategory =
      selectedCategory === 'All' || service.category === selectedCategory;
    const matchesSearch = service.name
      .toLowerCase()
      .includes(searchTerm.toLowerCase());
    return matchesCategory && matchesSearch;
  });

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
      <div className="services-header">
        <h1>Services</h1>
        <Link to="/add-service" className="btn-primary">Add Your Own Service</Link>
      </div>

      <div className="services-controls">
        <label htmlFor="search-services">
          Search services
          <input
            id="search-services"
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search by name"
          />
        </label>

        <label htmlFor="category-filter">
          Category
          <select
            id="category-filter"
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
          >
            <option value="All">All</option>
            <option value="Internet">Internet</option>
            <option value="Utilities">Utilities</option>
            <option value="Entertainment">Entertainment</option>
          </select>
        </label>
      </div>

      {filteredServices.length === 0 ? (
        <p>No services found.</p>
      ) : (
        <div className="services-grid">
          {filteredServices.map((service) => (
            <ServiceCard key={service.id} service={service} />
          ))}
        </div>
      )}
    </main>
  );
}

export default Services;