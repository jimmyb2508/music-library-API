const mongoose = require('mongoose');
const app = require('./src/app');

mongoose.connect(process.env.DATABASE_CONN, { useNewUrlParser: true }, err => {
  console.log(err);
  app.listen(3000, () => {
    // eslint-disable-next-line no-console
    console.log('App listening on port 3000');
  });
});
