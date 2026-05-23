import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import ProtectedRoute from './components/ProtectedRoute';
import RoleRoute from './components/RoleRoute';
import DashboardLayout from './components/DashboardLayout';

import HomePage from './pages/HomePage';
import AboutPage from './pages/AboutPage';
import CoursesPage from './pages/CoursesPage';
import CourseDetailPage from './pages/CourseDetailPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import NotFoundPage from './pages/NotFoundPage';

import MyCoursesPage from './pages/student/MyCoursesPage';
import ProfilePage from './pages/student/ProfilePage';

import CreateCoursePage from './pages/instructor/CreateCoursePage';
import ManageCoursesPage from './pages/instructor/ManageCoursesPage';
import UploadLessonsPage from './pages/instructor/UploadLessonsPage';

import ManageUsersPage from './pages/admin/ManageUsersPage';
import AdminManageCoursesPage from './pages/admin/ManageCoursesPage';
import AnalyticsPage from './pages/admin/AnalyticsPage';

const App = () => {
  return (
    <>
      <Navbar />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/about" element={<AboutPage />} />
        <Route path="/courses" element={<CoursesPage />} />
        <Route path="/courses/:id" element={<CourseDetailPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />

        <Route path="/student" element={<ProtectedRoute><DashboardLayout /></ProtectedRoute>}>
          <Route path="my-courses" element={<MyCoursesPage />} />
          <Route path="profile" element={<ProfilePage />} />
        </Route>

        <Route path="/instructor" element={<RoleRoute allowedRoles={['instructor', 'admin']}><DashboardLayout /></RoleRoute>}>
          <Route path="create-course" element={<CreateCoursePage />} />
          <Route path="manage-courses" element={<ManageCoursesPage />} />
          <Route path="upload-lessons" element={<UploadLessonsPage />} />
        </Route>

        <Route path="/admin" element={<RoleRoute allowedRoles={['admin']}><DashboardLayout /></RoleRoute>}>
          <Route path="users" element={<ManageUsersPage />} />
          <Route path="courses" element={<AdminManageCoursesPage />} />
          <Route path="analytics" element={<AnalyticsPage />} />
        </Route>

        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </>
  );
};

export default App;
