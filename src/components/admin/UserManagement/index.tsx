import React from 'react';
import { Routes, Route } from 'react-router-dom';
import UserList from './UserList';
import UserForm from './UserForm';

export default function UserManagement() {
  return (
    <Routes>
      <Route index element={<UserList />} />
      <Route path="new" element={<UserForm />} />
      <Route path=":userId/edit" element={<UserForm />} />
    </Routes>
  );
}