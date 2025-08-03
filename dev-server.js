const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('.'));

console.log('🚀 Starting Te Mata Wānanga Apparel Form Server (Development Mode)...');

// Serve the main HTML file
app.get('/', (req, res) => {
  console.log('📄 Serving index.html');
  res.sendFile(path.join(__dirname, 'index.html'));
});

// Mock form submission endpoint for development
app.post('/.netlify/functions/submit-order', async (req, res) => {
  try {
    console.log('📧 Received form submission (DEV MODE):', req.body);
    
    // Mock successful response
    const mockOrderNumber = `TMW-DEV-${Date.now()}`;
    
    console.log('✅ Order processed successfully (MOCK)');
    
    res.status(200).json({
      success: true,
      message: "Order processed successfully (Development Mode - No emails sent)",
      orderNumber: mockOrderNumber,
      note: "This is development mode. No emails were sent and no data was saved."
    });

  } catch (error) {
    console.error('❌ Error processing submission:', error);
    res.status(500).json({ 
      success: false, 
      error: error.message 
    });
  }
});

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ status: 'OK', mode: 'development', timestamp: new Date().toISOString() });
});

// 404 handler
app.use((req, res) => {
  console.log(`⚠️ 404 - Not found: ${req.url}`);
  res.status(404).json({ error: 'Not found' });
});

// Start server
app.listen(PORT, () => {
  console.log(`🎉 TMW Apparel Form running on port ${PORT} (DEVELOPMENT MODE)`);
  console.log(`🌐 Access your form at: http://localhost:${PORT}`);
  console.log('📝 Note: This is development mode - form submissions will be mocked');
  console.log('💡 No emails will be sent and no data will be saved to Google Sheets');
  console.log('');
});

// Graceful shutdown
process.on('SIGTERM', () => {
  console.log('🛑 Received SIGTERM, shutting down gracefully');
  process.exit(0);
});

process.on('SIGINT', () => {
  console.log('🛑 Received SIGINT, shutting down gracefully');
  process.exit(0);
});