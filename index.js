require('dotenv').config();

const { port } = require('./config/index');

const app = require('./api/server');

app.listen(port, () => console.log(`Listening on port ${port}`));
