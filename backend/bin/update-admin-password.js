const bcrypt = require('bcrypt');
const sequelize = require('../src/config/database.js');

const EMAIL = 'admin@agro.com';
const NEW_PASSWORD = 'LaVieEstvRaimentdiff11';

async function updatePassword() {
  const passwordHash = await bcrypt.hash(NEW_PASSWORD, 10);

  const query =
    `UPDATE users SET password = $1 WHERE email = $2`;

  await sequelize.query(query, {
    bind: [passwordHash, EMAIL],
    type: sequelize.QueryTypes.UPDATE
  });

  console.log('Mot de passe de', EMAIL, 'mis à:', NEW_PASSWORD);
}

updatePassword().catch(console.error);