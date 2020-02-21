const bcrypt = require('bcrypt');

exports.seed = knex =>
  knex('users')
    .del()
    .then(() =>
      knex('users').insert([
        {
          full_name: 'Maaruf Dauda',
          email: 'maaruf@email.com',
          password: bcrypt.hashSync('maaruf', 10),
          isConfirmed: true,
          image_url: '',
        },
        {
          full_name: 'Anna Winther',
          email: 'anna@email.com',
          password: bcrypt.hashSync('anna', 10),
          isConfirmed: true,
          image_url: '',
        },
        {
          full_name: 'John Mulongo',
          email: 'john@email.com',
          password: bcrypt.hashSync('john', 10),
          isConfirmed: true,
          image_url: '',
        },
        {
          full_name: 'Noble Obioma',
          email: 'noble@email.com',
          password: bcrypt.hashSync('noble', 10),
          isConfirmed: true,
          image_url: '',
        },
        {
          full_name: 'Richany Nguon',
          email: 'richany@email.com',
          password: bcrypt.hashSync('richany', 10),
          isConfirmed: true,
          image_url: '',
        },
        {
          full_name: 'Oluwajoba Bello',
          email: 'joba@email.com',
          password: bcrypt.hashSync('oluwajoba', 10),
          isConfirmed: true,
          image_url: '',
        },
        {
          full_name: 'Test User',
          email: 'testuser@email.com',
          password: bcrypt.hashSync('testpassword', 10),
          isConfirmed: false,
          image_url: '',
        },
      ])
    );
