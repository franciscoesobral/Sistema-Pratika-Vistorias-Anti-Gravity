import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { Login } from './pages/Login';
import { Dashboard } from './pages/Dashboard';
import { Lojas } from './pages/Lojas';
import { Peritos } from './pages/Peritos';
import { Servicos } from './pages/Servicos';
import { Financeiro } from './pages/Financeiro';

function PrivateRoute({ children }: { children: React.ReactElement }) {
  const { isAuthenticated, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" />;
  }

  return children;
}

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          <Route path="/login" element={<Login />} />
          
          <Route path="/" element={
            <PrivateRoute>
              <Dashboard />
            </PrivateRoute>
          } />

          <Route path="/lojas" element={
            <PrivateRoute>
              <Lojas /> 
            </PrivateRoute>
          } />
          <Route path="/peritos" element={
            <PrivateRoute>
              <Peritos />
            </PrivateRoute>
          } />
          <Route path="/servicos" element={
            <PrivateRoute>
              <Servicos />
            </PrivateRoute>
          } />
          <Route path="/financeiro" element={
            <PrivateRoute>
              <Financeiro />
            </PrivateRoute>
          } />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
