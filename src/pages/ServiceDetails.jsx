import { useParams } from 'react-router-dom';

function ServiceDetails() {
  const { id } = useParams();

  return (
    <main>
      <h1>Service Details</h1>
      <p>Service ID: {id}</p>
    </main>
  );
}

export default ServiceDetails;