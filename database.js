const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('estoque.db');

db.serialize(() => {
    db.run(`CREATE TABLE IF NOT EXISTS material (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        nome TEXT NOT NULL UNIQUE
    )`);
    db.run(`CREATE TABLE IF NOT EXISTS estoque (
        material_id INTEGER,
        quantidade INTEGER,
        FOREIGN KEY(material_id) REFERENCES material(id)
    )`);
});

module.exports = {
    addMaterial: (nome) => new Promise((resolve, reject) => {
        db.run('INSERT INTO material (nome) VALUES (?)', [nome], (err) => {
            if (err) return reject(err);
            db.run('INSERT INTO estoque (material_id, quantidade) VALUES ((SELECT id FROM material WHERE nome = ?), 0)', [nome], resolve);
        });
    }),
    addToStock: (material_id, quantidade) => new Promise((resolve, reject) => {
        db.run('UPDATE estoque SET quantidade = quantidade + ? WHERE material_id = ?', [quantidade, material_id], function(err) {
            if (err) return reject(err);
            resolve();
        });
    }),
    removeFromStock: (material_id, quantidade) => new Promise((resolve, reject) => {

        const sql = `
            UPDATE estoque
            SET quantidade = CASE
                WHEN quantidade - ? < 0 THEN 0
                ELSE quantidade - ?
            END
            WHERE material_id = ?
        `;
        db.run(sql, [quantidade, quantidade, material_id], function(err) {
            if (err) return reject(err);
            resolve();
        });
    }),
    getStock: () => new Promise((resolve, reject) => {
        db.all(`SELECT m.nome, e.quantidade FROM material m JOIN estoque e ON m.id = e.material_id`, [], (err, rows) => {
            if (err) return reject(err);
            resolve(rows);
        });
    }),
    getMaterials: () => new Promise((resolve, reject) => {
        db.all('SELECT id, nome FROM material', [], (err, rows) => {
            if (err) return reject(err);
            resolve(rows);
        });
    })
};
