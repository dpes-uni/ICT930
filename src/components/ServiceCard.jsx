import { Link } from 'react-router-dom';

function ServiceCard({ service }) {
  return (
    <article className="service-card">
      <h3>{service.name}</h3>
      <p className="category">{service.category}</p>
      <p className="description">{service.description}</p>
      <p className="price">${service.price}</p>
      <Link to={`/services/${service.id}`}>View Details</Link>
    </article>
  );
}

export default ServiceCard;