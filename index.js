import express from 'express';
import fs from 'fs';

const app = express();
const PORT = 3000;

app.get('/', (req, res) => {
    res.send('Servidor corriendo.');
});

const readDb = () => {
    const data = fs.readFileSync('./db.json', 'utf-8');
    return data;
}

/*
    Tabla de rutas:
    GET /random/quotes
    GET /random/quotes/random
    POST /random/quotes
*/

// Ruta #1 GET /random/quotes - Devuelve todas las frases.

app.get('/random/quotes', (req, res) => {
    const data = readDb();
    const quotes = JSON.parse(data).quotes;
    res.json(quotes);
});

// Ruta #2 GET /random/quotes/random - Devuelve una frase aleatoria.
app.get('/random/quotes/random', (req, res) => {
    const data = readDb();
    const quotes = JSON.parse(data).quotes;
    const randomPos = Math.floor(Math.random() * quotes.length); // Número entre 0 y 1 multiplicado por la longitud del array y redondeado hacia abajo. 
    const randomQuote = quotes[randomPos];
    res.json(randomQuote);
});

// Ruta #3 POST /random/quotes - Añade una nueva frase.
app.post('/random/quotes', express.json(), (req, res) => {
    const { text, author } = req.body;
    if (!text || !author) {
        return res.status(400).json({ error: 'Complete los campos obligatorios: text y author' });
    }

    const data = readDb();
    const quotes = JSON.parse(data).quotes;

    // Crear frase nueva
    const newId = quotes.length > 0 ? quotes[quotes.length - 1].id + 1 : 1; // Si el array tiene elementos, el id será id + 1, si no, será 1.
    const newQuote = { id: newId, text, author };
    quotes.push(newQuote); // Añadir la nueva frase al array ya existente.

    fs.writeFileSync('./db.json', JSON.stringify({ quotes }, null, 2)); // Sobreescribe el db.json con el nuevo array.

    res.status(201).json(newQuote); // Retorna automáticamente la frase agregada.
});

app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});