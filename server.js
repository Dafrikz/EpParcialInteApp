const express = require('express');
const path = require('path');
const jwt = require('jsonwebtoken');
//const { verifyToken } = require('./public/js/auth'); 
const config = require('./public/js/config'); 
const app = express();

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));

const users = [];

// Rutas HTML
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.get('/login', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'login.html'));
});

app.get('/registro', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'register.html'));
});

// Rutas API
app.post('/register', (req, res) => {
  const user = { id: users.length + 1, email: req.body.email, password: req.body.password };
  users.push(user);
  const token = jwt.sign({ id: user.id }, config.secret, { expiresIn: 86400 });
  res.status(200).send({ auth: true, token });
});

app.post('/login', (req, res) => {
  const user = users.find(u => u.email === req.body.email);
  if (!user) return res.status(404).send('No user found.');

  if (req.body.password !== user.password) return res.status(401).send({ auth: false, token: null });

  const token = jwt.sign({ id: user.id }, config.secret, { expiresIn: 86400 });
  res.status(200).send({ auth: true, token });
});

// Ruta protegida
app.get('/dashboard', verifyToken, (req, res) => {
  jwt.verify(req.token, config.secret, (err, authData) => {
    if (err) {
      res.sendStatus(403);
    } else {
      res.json({ message: "Access granted", authData });
    }
  });
});

// Middleware de verificación
function verifyToken(req, res, next) {
  const bearerHeader = req.headers['authorization'];
  if (typeof bearerHeader !== 'undefined') {
    const bearerToken = bearerHeader.split(" ")[1];
    req.token = bearerToken;
    next();
  } else {
    res.status(403).json({ message: 'No token provided' });
  }
}

// Iniciar el servidor
app.listen(config.port, () => {
  console.log(`Servidor corriendo en http://localhost:${config.port}`);
});