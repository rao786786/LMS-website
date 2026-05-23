import React, { useEffect, useState } from 'react';
import api from '../../services/api';

const ManageUsersPage = () => {
  const [users, setUsers] = useState([]);
  const [error, setError] = useState('');

  const loadUsers = async () => {
    try {
      const { data } = await api.get('/users');
      setUsers(data);
      setError('');
    } catch (err) {
      setError(err.response?.data?.message || 'Unable to load users');
    }
  };

  useEffect(() => {
    loadUsers();
  }, []);

  const handleDelete = async (id) => {
    await api.delete(`/users/${id}`);
    loadUsers();
  };

  return (
    <div className="fade-up">
      <div className="d-flex flex-wrap justify-content-between align-items-end gap-3 mb-4">
        <div>
          <div className="badge-soft text-bg-dark mb-2">Admin dashboard</div>
          <h2 className="section-title mb-1">Manage Users</h2>
          <p className="section-subtitle mb-0">View and remove users from the system.</p>
        </div>
      </div>

      {error && <div className="alert alert-danger">{error}</div>}

      <div className="card p-3">
        <div className="table-responsive">
          <table className="table align-middle mb-0">
            <thead>
              <tr>
                <th>Name</th>
                <th>Email</th>
                <th>Role</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {users.map((user) => (
                <tr key={user._id}>
                  <td className="fw-semibold">{user.name}</td>
                  <td>{user.email}</td>
                  <td><span className="badge text-bg-primary">{user.role}</span></td>
                  <td className="text-end">
                    <button className="btn btn-sm btn-danger" onClick={() => handleDelete(user._id)}>Delete</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default ManageUsersPage;
