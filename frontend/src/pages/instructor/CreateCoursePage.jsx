import React, { useState } from 'react';
import api from '../../services/api';

const CreateCoursePage = () => {
  const [form, setForm] = useState({
    title: '',
    description: '',
    category: '',
    price: 0,
    imageUrl: ''
  });
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const { data } = await api.post('/courses', form);
      setMessage(`Course created: ${data.title}`);
      setError('');
      setForm({ title: '', description: '', category: '', price: 0, imageUrl: '' });
    } catch (err) {
      setError(err.response?.data?.message || 'Unable to create course');
    }
  };

  return (
    <div className="card p-4 p-md-5 fade-up">
      <div className="badge-soft text-bg-dark mb-3">Instructor tools</div>
      <h2 className="section-title mb-2">Create Course</h2>
      <p className="section-subtitle mb-4">Add strong course details so the course list looks complete.</p>
      {message && <div className="alert alert-success">{message}</div>}
      {error && <div className="alert alert-danger">{error}</div>}
      <form onSubmit={handleSubmit}>
        <input className="form-control mb-3" placeholder="Title" value={form.title}
          onChange={(e) => setForm({ ...form, title: e.target.value })} />
        <textarea className="form-control mb-3" placeholder="Description" rows="4" value={form.description}
          onChange={(e) => setForm({ ...form, description: e.target.value })} />
        <input className="form-control mb-3" placeholder="Category" value={form.category}
          onChange={(e) => setForm({ ...form, category: e.target.value })} />
        <input className="form-control mb-3" type="number" placeholder="Price" value={form.price}
          onChange={(e) => setForm({ ...form, price: Number(e.target.value) })} />
        <input className="form-control mb-3" placeholder="Image URL" value={form.imageUrl}
          onChange={(e) => setForm({ ...form, imageUrl: e.target.value })} />
        <button className="btn btn-primary px-4">Save Course</button>
      </form>
    </div>
  );
};

export default CreateCoursePage;
