import React, { useState, useEffect } from 'react';
import { useStore } from '../store/useStore';
import * as orderService from '../services/orderService';
import * as paymentService from '../services/paymentService';

const OrderSummary = ({ onPaymentComplete }) => {
  const [customerItems, setCustomerItems] = useState([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);

  const currentOrder = useStore((state) => state.currentOrder);
  const customerName = useStore((state) => state.customerName);
  const setError = useStore((state) => state.setError);
  const setSuccess = useStore((state) => state.setSuccess);

  useEffect(() => {
    if (currentOrder && customerName) {
      loadCustomerItems();
    }
  }, [currentOrder, customerName]);

  const loadCustomerItems = async () => {
    try {
      setLoading(true);
      const data = await orderService.getOrderItemsByCustomer(
        currentOrder.id,
        customerName
      );
      setCustomerItems(data.items);
      setTotal(data.total);
    } catch (err) {
      setError('Erro ao carregar resumo do pedido');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handlePayment = async () => {
    try {
      await paymentService.createPayment(
        currentOrder.id,
        customerName,
        total,
        'cash'
      );
      setSuccess('Pagamento realizado com sucesso!');
      onPaymentComplete && onPaymentComplete();
    } catch (err) {
      setError('Erro ao processar pagamento');
      console.error(err);
    }
  };

  if (loading) return <div>Carregando...</div>;

  return (
    <div className="order-summary">
      <h2>Seu Pedido - {customerName}</h2>

      {customerItems.length === 0 ? (
        <p>Nenhum item no seu pedido</p>
      ) : (
        <>
          <div className="items-list">
            {customerItems.map((item) => (
              <div key={item.id} className="summary-item">
                <span>{item.item_name}</span>
                <span>x{item.quantity}</span>
                <span>€{(item.price * item.quantity).toFixed(2)}</span>
              </div>
            ))}
          </div>

          <div className="summary-total">
            <strong>Total: €{total.toFixed(2)}</strong>
          </div>

          <button
            className="pay-button"
            onClick={handlePayment}
          >
            Pagar Minha Parte
          </button>
        </>
      )}
    </div>
  );
};

export default OrderSummary;
