import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useStore } from '../store/useStore';
import * as authService from '../services/authService';

const AdminLoginScreen = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({});
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();
  const setAuthenticated = useStore((state) => state.setAuthenticated);
  const setError = useStore((state) => state.setError);
  const setSuccess = useStore((state) => state.setSuccess);

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      const result = await authService.loginRestaurant(email, password);
      setAuthenticated(true, result.restaurant, result.token);
      setSuccess('Login realizado com sucesso!');
      navigate('/admin/dashboard');
    } catch (err) {
      setError(err.response?.data?.error || 'Erro ao fazer login');
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      const result = await authService.registerRestaurant(formData);
      setAuthenticated(true, result.restaurant, result.token);
      setSuccess('Restaurante registrado com sucesso!');
      navigate('/admin/dashboard');
    } catch (err) {
      setError(err.response?.data?.error || 'Erro ao registrar');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="admin-login-screen">
      <div className="login-container">
        <h1>🍽️ Restaurant QR System</h1>

        {isLogin ? (
          <form onSubmit={handleLogin}>
            <h2>Login de Restaurante</h2>
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <input
              type="password"
              placeholder="Senha"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            <button type="submit" disabled={loading}>
              {loading ? 'Conectando...' : 'Entrar'}
            </button>
            <p>
              Não tem conta?{' '}
              <button
                type="button"
                onClick={() => setIsLogin(false)}
                className="link-button"
              >
                Registre-se
              </button>
            </p>
          </form>
        ) : (
          <form onSubmit={handleRegister}>
            <h2>Registrar Restaurante</h2>
            <input
              type="text"
              placeholder="Nome do Restaurante"
              value={formData.name || ''}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              required
            />
            <input
              type="email"
              placeholder="Email"
              value={formData.email || ''}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              required
            />
            <input
              type="password"
              placeholder="Senha"
              value={formData.password || ''}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              required
            />
            <input
              type="text"
              placeholder="Telefone"
              value={formData.phone || ''}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
            />
            <input
              type="text"
              placeholder="Endereço"
              value={formData.address || ''}
              onChange={(e) => setFormData({ ...formData, address: e.target.value })}
            />
            <input
              type="text"
              placeholder="Cidade"
              value={formData.city || ''}
              onChange={(e) => setFormData({ ...formData, city: e.target.value })}
            />
            <button type="submit" disabled={loading}>
              {loading ? 'Registrando...' : 'Registrar'}
            </button>
            <p>
              Já tem conta?{' '}
              <button
                type="button"
                onClick={() => setIsLogin(true)}
                className="link-button"
              >
                Entre
              </button>
            </p>
          </form>
        )}
      </div>
    </div>
  );
};

export default AdminLoginScreen;
