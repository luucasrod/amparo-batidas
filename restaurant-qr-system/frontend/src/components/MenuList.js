import React, { useState, useEffect } from 'react';
import { useStore } from '../store/useStore';
import * as menuService from '../services/menuService';
import * as orderService from '../services/orderService';

const MenuList = () => {
  const [menu, setMenu] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedItems, setSelectedItems] = useState({});
  const [quantities, setQuantities] = useState({});

  const currentTable = useStore((state) => state.currentTable);
  const currentOrder = useStore((state) => state.currentOrder);
  const customerName = useStore((state) => state.customerName);
  const setSuccess = useStore((state) => state.setSuccess);

  useEffect(() => {
    if (currentTable?.restaurant_id) {
      loadMenu();
    }
  }, [currentTable]);

  const loadMenu = async () => {
    try {
      setLoading(true);
      const data = await menuService.getRestaurantMenu(currentTable.restaurant_id);
      setMenu(data);
      setError(null);
    } catch (err) {
      setError('Erro ao carregar menu');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const toggleItem = (itemId) => {
    setSelectedItems((prev) => ({
      ...prev,
      [itemId]: !prev[itemId],
    }));
  };

  const updateQuantity = (itemId, value) => {
    const qty = Math.max(1, parseInt(value) || 1);
    setQuantities((prev) => ({
      ...prev,
      [itemId]: qty,
    }));
  };

  const addToOrder = async (item) => {
    if (!customerName) {
      setError('Por favor, informe seu nome');
      return;
    }

    if (!selectedItems[item.id]) {
      setError('Por favor, selecione o item');
      return;
    }

    try {
      const qty = quantities[item.id] || 1;
      await orderService.addOrderItem(
        currentOrder.id,
        item.id,
        customerName,
        qty
      );
      setSuccess(`${item.name} adicionado ao pedido!`);
      setSelectedItems((prev) => ({ ...prev, [item.id]: false }));
      setQuantities((prev) => ({ ...prev, [item.id]: 1 }));
    } catch (err) {
      setError('Erro ao adicionar item');
      console.error(err);
    }
  };

  if (loading) return <div>Carregando menu...</div>;
  if (error) return <div className="error-message">{error}</div>;

  return (
    <div className="menu-list">
      <h2>Cardápio</h2>
      {menu.length === 0 ? (
        <p>Nenhum item disponível</p>
      ) : (
        <div className="menu-grid">
          {menu.map((item) => (
            <div key={item.id} className="menu-item">
              {item.image_url && (
                <img src={item.image_url} alt={item.name} />
              )}
              <div className="item-info">
                <h3>{item.name}</h3>
                <p className="description">{item.description}</p>
                <p className="price">€{parseFloat(item.price).toFixed(2)}</p>
              </div>
              <div className="item-actions">
                <input
                  type="checkbox"
                  checked={selectedItems[item.id] || false}
                  onChange={() => toggleItem(item.id)}
                />
                {selectedItems[item.id] && (
                  <div className="quantity-control">
                    <input
                      type="number"
                      min="1"
                      value={quantities[item.id] || 1}
                      onChange={(e) => updateQuantity(item.id, e.target.value)}
                    />
                    <button onClick={() => addToOrder(item)}>
                      Adicionar
                    </button>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MenuList;
