import { useState } from 'react';

function Profile() {
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
  });

  const [errors, setErrors] = useState({});
  const [success, setSuccess] = useState('');

  function handleChange(e) {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setSuccess('');
  }

  function validate() {
    const newErrors = {};

    if (!formData.fullName.trim()) {
      newErrors.fullName = 'Full Name is required.';
    }

    if (!formData.email.trim()) {
      newErrors.email = 'Email is required.';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address.';
    }

    if (!formData.phone.trim()) {
      newErrors.phone = 'Phone Number is required.';
    } else if (!/^\+?[\d\s\-()]{7,}$/.test(formData.phone)) {
      newErrors.phone = 'Please enter a valid phone number.';
    }

    return newErrors;
  }

  function handleSubmit(e) {
    e.preventDefault();
    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      setSuccess('');
      return;
    }
    setErrors({});
    setSuccess('Profile saved successfully.');
  }

  return (
    <main>
      <h1>Profile</h1>

      <form onSubmit={handleSubmit} className="profile-form" noValidate>
        <div className="form-field">
          <label htmlFor="fullName">Full Name</label>
          <input
            type="text"
            id="fullName"
            name="fullName"
            value={formData.fullName}
            onChange={handleChange}
            aria-describedby={errors.fullName && 'error-fullName'}
          />
          {errors.fullName && (
            <span className="error-message" id="error-fullName">{errors.fullName}</span>
          )}
        </div>

        <div className="form-field">
          <label htmlFor="email">Email</label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            aria-describedby={errors.email && 'error-email'}
          />
          {errors.email && (
            <span className="error-message" id="error-email">{errors.email}</span>
          )}
        </div>

        <div className="form-field">
          <label htmlFor="phone">Phone Number</label>
          <input
            type="tel"
            id="phone"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            aria-describedby={errors.phone && 'error-phone'}
          />
          {errors.phone && (
            <span className="error-message" id="error-phone">{errors.phone}</span>
          )}
        </div>

        <button type="submit" className="btn-primary">
          Save Profile
        </button>
      </form>

      {success && <p className="success-message">{success}</p>}
    </main>
  );
}

export default Profile;