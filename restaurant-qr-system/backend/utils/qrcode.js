const QRCode = require('qrcode');
const { v4: uuidv4 } = require('uuid');

const generateQRCodeData = (restaurantId, tableId, tableNumber) => {
  const qrData = {
    restaurantId,
    tableId,
    tableNumber,
    sessionId: uuidv4(),
    timestamp: new Date().toISOString(),
  };
  return JSON.stringify(qrData);
};

const generateQRCodeImage = async (data) => {
  try {
    const qrImage = await QRCode.toDataURL(data);
    return qrImage;
  } catch (error) {
    console.error('Error generating QR code:', error);
    throw error;
  }
};

module.exports = { generateQRCodeData, generateQRCodeImage };
