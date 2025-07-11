// Carrega as variáveis de ambiente do arquivo .env
require('dotenv').config();

const express = require('express');
const path = require('path');

const app = express();
const PORT = 1234;

// Endpoint para fornecer as configurações do cliente
app.get('/config', (req, res) => {
    res.json({
        pixelId: process.env.FACEBOOK_PIXEL_ID,
        checkoutUrlPremium: process.env.CHECKOUT_URL_PREMIUM,
        checkoutUrlBoost: process.env.CHECKOUT_URL_BOOST
    });
});

// Servir os arquivos estáticos da pasta atual
app.use(express.static(path.join(__dirname)));

// Rota principal que serve o index.html
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

app.listen(PORT, () => {
    console.log(`🚀 Servidor rodando em http://localhost:${PORT}`);
});