const app = require('./app');

const PORT = 3000;
app.listen(PORT, () => {
  console.log('Serveur Agro-Manager sur port', PORT);
});