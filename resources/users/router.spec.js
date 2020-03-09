const request = require('supertest');
const server = require('../../api/server');
const db = require('../../data/dbConfig');

const userObject = {
  email: 'h.kakashi@gmail.com',
  password: 'aVeryLongPassword',
  fullName: 'Hatake Kakashi',
  imageUrl: 'google.com',
  isConfirmed: false,
};

let user;
let authToken;

beforeEach(async done => {
  await db.raw('TRUNCATE TABLE users CASCADE');
  const userRes = await request(server)
    .post('/api/auth/register')
    .send(userObject);

  authToken = userRes.body.data.token;
  user = userRes.body.data.user;
  done();
});

// Destroy knex instance after all tests are run to fix timeout in Travis build.
afterAll(async done => {
  await db.destroy();
  done();
});

describe('Users route', () => {
  describe('Delete user endpoint', () => {
    test('Validate password input', async done => {
      const res = await request(server)
        .delete(`/api/users/`)
        .set('Authorization', authToken);

      expect(res.status).toBe(400);
      expect(res.body.error).toBe('"Password" is required');

      done();
    });

    test('Incorrect Password deleting Account', async done => {
      const res = await request(server)
        .delete(`/api/users`)
        .send({ password: 'veryWrongSomething' })
        .set('Authorization', authToken);

      expect(res.status).toBe(400);
      expect(res.body.message).toBe('Invalid User Credential');

      done();
    });

    test('Returns 200 on success', async done => {
      let res;

      res = await request(server)
        .delete(`/api/users`)
        .send({ password: userObject.password })
        .set('Authorization', authToken);

      expect(res.status).toBe(200);
      expect(res.body.message).toBe('User successfully deleted');

      res = await request(server)
        .post('/api/auth/login')
        .send({
          email: userObject.email,
          password: userObject.password,
        });

      // deleted user no longer exists
      expect(res.status).toBe(404);
      done();
    });
  });

  describe('Update User Profile Endpoint', () => {
    test('Returns 200 on success', async done => {
      // authorize token, update user profile
      const response = await request(server)
        .put('/api/users/updateprofile')
        .set('Authorization', authToken)
        .send({ fullName: 'updated fullName' });

      expect(response.status).toBe(200);

      // log the user in
      const login = await request(server)
        .post('/api/auth/login')
        .send({
          email: userObject.email,
          password: userObject.password,
        });

      expect(login.status).toBe(200);
      expect(login.body.data.user.full_name).toEqual('updated fullName');
      done();
    });
  });
});
