import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAppContext } from '../context/AppContext';

function AddService() {
  const navigate = useNavigate();
  const { addService } = useAppContext();

  const [formData, setFormData] = useState({
    name: '',
    category: '',
    description: '',
    price: '',
  });

  const [errors, setErrors] = useState({});
  const [submitted, setSubmitted] = useState(false);

  function handleChange(e) {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: '' }));
    }
  }

  function validate() {
    const newErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Service Name is required.';
    }

    if (!formData.category) {
      newErrors.category = 'Please select a category.';
    }

    if (!formData.description.trim()) {
      newErrors.description = 'Description is required.';
    }

    if (!formData.price) {
      newErrors.price = 'Price is required.';
    } else if (isNaN(Number(formData.price)) || Number(formData.price) <= 0) {
      newErrors.price = 'Please enter a valid price greater than 0.';
    }

    return newErrors;
  }

  function handleSubmit(e) {
    e.preventDefault();
    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    const service = {
      id: Date.now(),
      name: formData.name.trim(),
      category: formData.category,
      description: formData.description.trim(),
      price: Number(formData.price),
    };

    addService(service);
    setSubmitted(true);

    setTimeout(() => {
      navigate('/my-services');
    }, 1500);
  }

  if (submitted) {
    return (
      <main>
        <h1>Add Your Own Service</h1>
        <p className="success-message">Service added successfully! Redirecting to My Services...</p>
        <Link to="/my-services" className="btn-back">Go to My Services</Link>
      </main>
    );
  }

  return (
    <main>
      <h1>Add Your Own Service</h1>

      <form onSubmit={handleSubmit} className="profile-form" noValidate>
        <div className="form-field">
          <label htmlFor="name">Service Name</label>
          <input
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            aria-describedby={errors.name && 'error-name'}
          />
          {errors.name && (
            <span className="error-message" id="error-name">{errors.name}</span>
          )}
        </div>

        <div className="form-field">
          <label htmlFor="category">Category</label>
          <select
            id="category"
            name="category"
            value={formData.category}
            onChange={handleChange}
            aria-describedby={errors.category && 'error-category'}
          >
            <option value="">Select a category</option>
            <option value="Internet">Internet</option>
            <option value="Utilities">Utilities</option>
            <option value="Entertainment">Entertainment</option>
            <option value="Other">Other</option>
          </select>
          {errors.category && (
            <span className="error-message" id="error-category">{errors.category}</span>
          )}
        </div>

        <div className="form-field">
          <label htmlFor="description">Description</label>
          <input
            type="text"
            id="description"
            name="description"
            value={formData.description}
            onChange={handleChange}
            aria-describedby={errors.description && 'error-description'}
          />
          {errors.description && (
            <span className="error-message" id="error-description">{errors.description}</span>
          )}
        </div>

        <div className="form-field">
          <label htmlFor="price">Price ($)</label>
          <input
            type="number"
            id="price"
            name="price"
            value={formData.price}
            onChange={handleChange}
            min="0.01"
            step="0.01"
            aria-describedby={errors.price && 'error-price'}
          />
          {errors.price && (
            <span className="error-message" id="error-price">{errors.price}</span>
          )}
        </div>

        <div className="form-actions">
          <button type="submit" className="btn-primary">
            Add Service
          </button>
          <Link to="/services" className="btn-back">
            Cancel
          </Link>
        </div>
      </form>
    </main>
  );
}

export default AddService;
