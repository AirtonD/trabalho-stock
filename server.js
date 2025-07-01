const express = require('express');
const path = require('path');
const db = require('./database');
const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));

app.get('/', (req, res) => res.sendFile(path.join(__dirname, 'public', 'index.html')));
app.get('/add', (req, res) => res.sendFile(path.join(__dirname, 'public', 'add.html')));
app.get('/stock', (req, res) => res.sendFile(path.join(__dirname, 'public', 'stock.html')));
app.get('/remove', (req, res) => res.sendFile(path.join(__dirname, 'public', 'remove.html')));

app.post('/api/material', async (req, res) => {
    const { nome } = req.body;
    await db.addMaterial(nome);
    res.redirect('/');
});

app.post('/api/add', async (req, res) => {
    const { material_id, quantidade } = req.body;
    await db.addToStock(material_id, quantidade);
    res.redirect('/add');
});

app.post('/api/remove', async (req, res) => {
    const { material_id, quantidade } = req.body;
    await db.removeFromStock(material_id, quantidade);
    res.redirect('/remove');
});

app.get('/api/stock', async (req, res) => {
    const stock = await db.getStock();
    res.json(stock);
});

app.get('/api/materials', async (req, res) => {
    const materials = await db.getMaterials();
    res.json(materials);
});

app.listen(3000, () => console.log('Servidor rodando em http://localhost:3000'));
