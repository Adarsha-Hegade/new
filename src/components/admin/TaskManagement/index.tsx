import React from 'react';
import { Routes, Route } from 'react-router-dom';
import TaskList from './TaskList';
import TaskForm from './TaskForm';
import TaskReview from './TaskReview';

export default function TaskManagement() {
  return (
    <Routes>
      <Route index element={<TaskList />} />
      <Route path="new" element={<TaskForm />} />
      <Route path=":taskId/review" element={<TaskReview />} />
    </Routes>
  );
}