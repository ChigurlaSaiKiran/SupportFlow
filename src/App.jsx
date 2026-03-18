import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";

import Login from "./pages/Logging/Login";

import MiniDrawer from "./components/MiniDrawer";
import ProtectedRoute from "./components/ProtectedRoute";

import Dashboard from "./pages/Dashboard/Dashboard";
import TicketList from "./pages/Tickets/TicketList";
import TicketForm from "./pages/Tickets/ticketForm";
import TicketDetails from "./pages/Tickets/TicketDetails";
import UserList from "./pages/Users/userList";
import UserForm from "./pages/Users/userForm";
import RoleList from "./pages/Roles/RoleList";
import RoleForm from "./pages/Roles/RoleForm";
import Departments from "./pages/Departments/Departments";
import DepartmentForm from "./pages/Departments/DepartmentForm";
import PriorityList from "./pages/Priorities/PriorityList";
import PriorityForm from "./pages/Priorities/PriorityForm";
import CategoryList from "./pages/Categories/categoryList";
import CategoryForm from "./pages/Categories/categoryForm";
import StatusList from "./pages/Statuses/StatusList";
import StatusForm from "./pages/Statuses/StatusForm";
import TicketAttachmentList from "./pages/TicketAttachment/ticketAttachmentList";
import ResetPassword from "./pages/Logging/ResetPassword";
import ForgotPassword from "./pages/Logging/ForgotPassword";
import Profile from "./pages/Profile";
import TicketAttachmentForm from "./pages/TicketAttachment/ticketAttachmentForm";

function App() {
  return (
    <Router>
      <Routes>
        {/* Login Page */}

        <Route path="/login" element={<Login />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password" element={<ResetPassword />} />

        {/* Protected Layout */}

        <Route
          path="/"
          element={
            <ProtectedRoute>
              <MiniDrawer />
            </ProtectedRoute>
          }
        >
          {/* Dashboard */}
          <Route index element={<Dashboard />} />
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="profile" element={<Profile />} />
          {/* Tickets CRUD */}
          <Route path="tickets" element={<TicketList />} />
          <Route path="tickets/create" element={<TicketForm />} />
          <Route path="tickets/edit/:id" element={<TicketForm />} />
          <Route path="tickets/details/:id" element={<TicketDetails />} />
          {/* Users CRUD */}
          <Route path="users" element={<UserList />} />
          <Route path="users/add" element={<UserForm />} />
          <Route path="users/edit/:id" element={<UserForm />} />
          {/* Roles CRUD */}
          <Route path="roles" element={<RoleList />} />
          <Route path="roles/add" element={<RoleForm />} />
          <Route path="roles/edit/:id" element={<RoleForm />} />
          {/* Departments CRUD */}
          <Route path="departments" element={<Departments />} />
          <Route path="departments/add" element={<DepartmentForm />} />
          <Route path="departments/edit/:id" element={<DepartmentForm />} />
          {/* Categories CRUD */}
          <Route path="categories" element={<CategoryList />} />
          <Route path="categories/add" element={<CategoryForm />} />
          <Route path="categories/edit/:id" element={<CategoryForm />} />
          {/* Priorities CRUD */}
          <Route path="priorities" element={<PriorityList />} />
          <Route path="priorities/add" element={<PriorityForm />} />
          <Route path="priorities/edit/:id" element={<PriorityForm />} />
          {/* Status CRUD */}
          <Route path="statuses" element={<StatusList />} />
          <Route path="statuses/add" element={<StatusForm />} />
          <Route path="statuses/edit/:id" element={<StatusForm />} />
          {/* Attachments */}
          <Route path="attachments" element={<TicketAttachmentList />} />
          <Route
            path="attachments/add"
            element={<TicketAttachmentForm />}
          />{" "}
          {/* ✅ ADD */}
        </Route>

        {/* Fallback */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
}
export default App;
