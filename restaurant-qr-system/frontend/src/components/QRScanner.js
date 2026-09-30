import React, { useEffect, useRef, useState } from 'react';
import { useStore } from '../store/useStore';
import * as tableService from '../services/tableService';
import * as orderService from '../services/orderService';

const QRScanner = ({ onScanSuccess }) => {
  const [scannedData, setScannedData] = useState(null);
  const [error, setError] = useState(null);
  const setCurrentTable = useStore((state) => state.setCurrentTable);
  const setCurrentOrder = useStore((state) => state.setCurrentOrder);
  const setSessionId = useStore((state) => state.setSessionId);
  const videoRef = useRef(null);

  useEffect(() => {
    // For web, we'll use a mock QR scanner
    // In a real app, use expo-camera or react-qr-reader
    console.log('QR Scanner initialized. Ready to scan.');
  }, []);

  const handleQRData = async (qrData) => {
    try {
      setError(null);
      // Parse QR data
      const data = JSON.parse(qrData);

      // Get table info
      const table = await tableService.getTableByQRData(qrData);
      setCurrentTable(table);

      // Create order
      const order = await orderService.createOrder(table.id);
      setCurrentOrder(order);
      setSessionId(data.sessionId);

      setScannedData(data);
      onScanSuccess && onScanSuccess(table, order);
    } catch (err) {
      setError('Invalid QR code or error processing order');
      console.error('QR scan error:', err);
    }
  };

  // Mock QR scanning for demo
  const handleMockScan = (qrData) => {
    handleQRData(qrData);
  };

  return (
    <div className="qr-scanner">
      <h2>Escanear QR Code da Mesa</h2>

      {error && <div className="error-message">{error}</div>}

      {scannedData && (
        <div className="scan-success">
          <p>✓ Mesa {scannedData.tableNumber} escaneada com sucesso!</p>
        </div>
      )}

      <div className="scanner-placeholder">
        <p>Escaneie o código QR da sua mesa para começar</p>
        <input
          type="text"
          placeholder="Ou cole o código QR aqui para teste..."
          onPaste={(e) => {
            const text = e.clipboardData.getData('text');
            handleMockScan(text);
          }}
          style={{ marginTop: '10px', padding: '8px', width: '100%' }}
        />
      </div>
    </div>
  );
};

export default QRScanner;
