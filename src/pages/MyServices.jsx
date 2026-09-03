import { useAppContext } from '../context/AppContext';

function MyServices() {
  const { selectedServices, removeService } = useAppContext();

  return (
    <main>
      <h1>My Services</h1>
      {selectedServices.length === 0 ? (
        <p>No services added yet.</p>
      ) : (
        <ul className="my-services-list">
          {selectedServices.map((service) => (
            <li key={service.id} className="my-service-item">
              <h3>{service.name}</h3>
              <p className="service-category">{service.category}</p>
              <p className="service-price">${service.price}</p>
              <button
                type="button"
                className="btn-remove"
                onClick={() => removeService(service.id)}
              >
                Remove
              </button>
            </li>
          ))}
        </ul>
      )}
    </main>
  );
}

export default MyServices;