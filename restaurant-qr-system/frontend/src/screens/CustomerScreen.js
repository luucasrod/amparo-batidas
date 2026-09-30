import React, { useState, useEffect } from 'react';
import { useStore } from '../store/useStore';
import QRScanner from '../components/QRScanner';
import MenuList from '../components/MenuList';
import OrderSummary from '../components/OrderSummary';
import RatingForm from '../components/RatingForm';

const CustomerScreen = () => {
  const [step, setStep] = useState('qr-scan'); // qr-scan, customer-name, menu, order, rating
  const [customerName, setCustomerName] = useState('');

  const currentOrder = useStore((state) => state.currentOrder);
  const currentTable = useStore((state) => state.currentTable);
  const setCustomerNameStore = useStore((state) => state.setCustomerName);
  const error = useStore((state) => state.error);
  const success = useStore((state) => state.success);
  const clearError = useStore((state) => state.clearError);
  const clearSuccess = useStore((state) => state.clearSuccess);

  useEffect(() => {
    const timer = setTimeout(() => {
      if (error) clearError();
      if (success) clearSuccess();
    }, 3000);
    return () => clearTimeout(timer);
  }, [error, success, clearError, clearSuccess]);

  const handleQRScanned = (table, order) => {
    setStep('customer-name');
  };

  const handleCustomerNameSubmit = () => {
    if (!customerName.trim()) {
      alert('Por favor, informe seu nome');
      return;
    }
    setCustomerNameStore(customerName);
    setStep('menu');
  };

  const handlePaymentComplete = () => {
    setStep('rating');
  };

  const handleRatingSubmitted = () => {
    // Reset for next customer
    setCustomerName('');
    setStep('qr-scan');
  };

  return (
    <div className="customer-screen">
      <div className="alerts">
        {error && <div className="alert error">{error}</div>}
        {success && <div className="alert success">{success}</div>}
      </div>

      <div className="screen-content">
        {step === 'qr-scan' && (
          <QRScanner onScanSuccess={handleQRScanned} />
        )}

        {step === 'customer-name' && currentTable && (
          <div className="customer-name-form">
            <h2>Bem-vindo à Mesa {currentTable.table_number}</h2>
            <div className="form-group">
              <label>Qual é seu nome?</label>
              <input
                type="text"
                value={customerName}
                onChange={(e) => setCustomerName(e.target.value)}
                placeholder="Digite seu nome"
                onKeyPress={(e) => e.key === 'Enter' && handleCustomerNameSubmit()}
              />
              <button onClick={handleCustomerNameSubmit} className="btn-primary">
                Continuar
              </button>
            </div>
          </div>
        )}

        {step === 'menu' && (
          <>
            <MenuList />
            <OrderSummary onPaymentComplete={handlePaymentComplete} />
          </>
        )}

        {step === 'rating' && (
          <div className="rating-container">
            <RatingForm onRatingSubmitted={handleRatingSubmitted} />
            <button
              onClick={() => setStep('qr-scan')}
              className="btn-secondary"
            >
              Voltar ao Início
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default CustomerScreen;
