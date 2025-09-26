const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const app = express();
const PORT = 3001;

app.use(cors());
app.use(bodyParser.json());

// Simulação de endpoint para Mercado Pago
app.post('/api/pagamento/mercadopago', (req, res) => {
  // Aqui você integraria com o SDK oficial do Mercado Pago
  // Exemplo: criar preferência, retornar link ou QR Code
  res.json({
    status: 'ok',
    message: 'Simulação Mercado Pago',
    payment_url: 'https://www.mercadopago.com.br/checkout/v1/redirect?pref_id=EXEMPLO'
  });
});

// Simulação de endpoint para PagSeguro
app.post('/api/pagamento/pagseguro', (req, res) => {
  // Aqui você integraria com o SDK oficial do PagSeguro
  res.json({
    status: 'ok',
    message: 'Simulação PagSeguro',
    payment_url: 'https://pagseguro.uol.com.br/v2/checkout/payment.html?code=EXEMPLO'
  });
});

// Simulação de endpoint para PayPal
app.post('/api/pagamento/paypal', (req, res) => {
  // Aqui você integraria com o SDK oficial do PayPal
  res.json({
    status: 'ok',
    message: 'Simulação PayPal',
    payment_url: 'https://www.paypal.com/checkoutnow?token=EXEMPLO'
  });
});

app.listen(PORT, () => {
  console.log(`Backend rodando em http://localhost:${PORT}`);
});



