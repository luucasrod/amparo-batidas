import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useStore } from '../store/useStore';
import * as authService from '../services/authService';
import * as tableService from '../services/tableService';
import * as menuService from '../services/menuService';
import * as ratingService from '../services/ratingService';

const AdminDashboardScreen = () => {
  const [profile, setProfile] = useState(null);
  const [tables, setTables] = useState([]);
  const [menu, setMenu] = useState([]);
  const [ratings, setRatings] = useState(null);
  const [activeTab, setActiveTab] = useState('tables');
  const [loading, setLoading] = useState(true);

  const navigate = useNavigate();
  const isAuthenticated = useStore((state) => state.isAuthenticated);
  const logout = useStore((state) => state.logout);

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/admin/login');
      return;
    }
    loadDashboardData();
  }, [isAuthenticated, navigate]);

  const loadDashboardData = async () => {
    try {
      setLoading(true);
      const [profileData, tablesData, menuData, ratingsData] = await Promise.all([
        authService.getProfile(),
        tableService.getRestaurantTables(),
        menuService.getMenuItems(),
        ratingService.getMyRatings(),
      ]);
      setProfile(profileData);
      setTables(tablesData);
      setMenu(menuData);
      setRatings(ratingsData);
    } catch (err) {
      console.error('Error loading dashboard:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    authService.logout();
    logout();
    navigate('/admin/login');
  };

  const handleCreateTable = async () => {
    const tableNumber = prompt('Número da mesa:');
    if (tableNumber) {
      try {
        await tableService.createTable({ table_number: parseInt(tableNumber) });
        loadDashboardData();
      } catch (err) {
        console.error('Error creating table:', err);
      }
    }
  };

  const handleAddMenuItem = async () => {
    const name = prompt('Nome do prato:');
    if (!name) return;

    const price = prompt('Preço (€):');
    if (!price) return;

    const category = prompt('Categoria (opcional):') || 'Geral';

    try {
      await menuService.createMenuItem({
        name,
        price: parseFloat(price),
        category,
      });
      loadDashboardData();
    } catch (err) {
      console.error('Error creating menu item:', err);
    }
  };

  if (loading) return <div className="loading">Carregando...</div>;

  return (
    <div className="admin-dashboard">
      <header className="dashboard-header">
        <div className="header-content">
          <h1>🍽️ {profile?.name}</h1>
          <div className="header-actions">
            <span>{profile?.email}</span>
            <button onClick={handleLogout}>Sair</button>
          </div>
        </div>
      </header>

      <nav className="dashboard-tabs">
        <button
          className={activeTab === 'tables' ? 'active' : ''}
          onClick={() => setActiveTab('tables')}
        >
          Mesas
        </button>
        <button
          className={activeTab === 'menu' ? 'active' : ''}
          onClick={() => setActiveTab('menu')}
        >
          Cardápio
        </button>
        <button
          className={activeTab === 'ratings' ? 'active' : ''}
          onClick={() => setActiveTab('ratings')}
        >
          Avaliações ⭐
        </button>
      </nav>

      <div className="dashboard-content">
        {activeTab === 'tables' && (
          <div className="section">
            <div className="section-header">
              <h2>Mesas</h2>
              <button onClick={handleCreateTable} className="btn-primary">
                + Nova Mesa
              </button>
            </div>
            <div className="tables-grid">
              {tables.map((table) => (
                <div key={table.id} className="table-card">
                  <h3>Mesa {table.table_number}</h3>
                  <p>Capacidade: {table.capacity} pessoas</p>
                  {table.qr_image && (
                    <img src={table.qr_image} alt={`QR Code - Mesa ${table.table_number}`} />
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'menu' && (
          <div className="section">
            <div className="section-header">
              <h2>Cardápio</h2>
              <button onClick={handleAddMenuItem} className="btn-primary">
                + Adicionar Prato
              </button>
            </div>
            <div className="menu-table">
              <table>
                <thead>
                  <tr>
                    <th>Nome</th>
                    <th>Preço</th>
                    <th>Categoria</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {menu.map((item) => (
                    <tr key={item.id}>
                      <td>{item.name}</td>
                      <td>€{parseFloat(item.price).toFixed(2)}</td>
                      <td>{item.category}</td>
                      <td>{item.is_available ? '✓ Disponível' : '✗ Indisponível'}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {activeTab === 'ratings' && (
          <div className="section">
            <h2>Avaliações</h2>
            {ratings && (
              <>
                <div className="ratings-stats">
                  <div className="stat-card">
                    <h3>⭐ Média</h3>
                    <p className="stat-value">
                      {ratings.statistics?.average_rating?.toFixed(1) || 'N/A'}/5
                    </p>
                  </div>
                  <div className="stat-card">
                    <h3>📊 Total</h3>
                    <p className="stat-value">
                      {ratings.statistics?.total_ratings || 0}
                    </p>
                  </div>
                </div>

                <div className="ratings-list">
                  {ratings.ratings?.length > 0 ? (
                    ratings.ratings.map((rating) => (
                      <div key={rating.id} className="rating-item">
                        <div className="rating-header">
                          <span className="rating-stars">
                            {'⭐'.repeat(rating.rating)}
                          </span>
                          <span className="rating-customer">
                            {rating.customer_name}
                          </span>
                        </div>
                        {rating.comment && (
                          <p className="rating-comment">{rating.comment}</p>
                        )}
                      </div>
                    ))
                  ) : (
                    <p>Nenhuma avaliação ainda</p>
                  )}
                </div>
              </>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminDashboardScreen;
