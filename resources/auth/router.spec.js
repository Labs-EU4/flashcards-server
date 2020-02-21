const request = require('supertest');
const iwm = require('nodemailer-stub').interactsWithMail;

const crypto = require('crypto');
const generateToken = require('../../utils/generateToken');
const server = require('../../api/server');

const model = require('./model');

const db = require('../../data/dbConfig');
const { EMAIL_SECRET } = require('../../config');

beforeEach(async done => {
  await db.raw('TRUNCATE TABLE users CASCADE');
  done();
});

// Destroy knex instance after all tests are run to fix timeout in Travis build.
afterAll(async done => {
  await db.destroy();
  done();
});

const userObject = {
  email: 'h.kakashi@gmail.com',
  password: 'aVeryLongPassword',
  fullName: 'Hatake Kakashi',
  imageUrl: 'google.com',
  isConfirmed: false,
};

const exampleMail = {
  to: 'john@domain.com',
  from: 'jimmy@domain.com',
  subject: 'testing',
  content: 'foo',
  contents: ['foo'],
  contentType: 'text/plain',
};

describe('Auth Router', () => {
  describe('Register Endpoint', () => {
    test('Returns 201 on success', async done => {
      const res = await request(server)
        .post('/api/auth/register')
        .send(userObject);
      expect(res.status).toBe(201);
      done();
    });

    test('Returns created user without their password', async done => {
      const res = await request(server)
        .post('/api/auth/register')
        .send(userObject);

      expect(res.status).toBe(201);

      expect(res.body.data.user).toMatchObject({
        email: userObject.email,
        image_url: userObject.imageUrl,
        full_name: userObject.fullName,
        isConfirmed: false,
      });
      done();
    });

    test('Token is returned on signup successful', async done => {
      const res = await request(server)
        .post('/api/auth/register')
        .send(userObject);

      expect(res.status).toBe(201);

      expect(res.body.data.token).not.toBe(null || undefined);
      done();
    });

    test('Password is not stored in plain text', async done => {
      await request(server)
        .post('/api/auth/register')
        .send(userObject);

      const userCreated = await model.findBy({ email: userObject.email });

      expect(userCreated.email).toBe(userObject.email);
      expect(userCreated.password).not.toBe(userObject.password);
      done();
    });

    test('Email is required', async done => {
      const userCopy = { ...userObject };

      delete userCopy.email;

      const res = await request(server)
        .post('/api/auth/register')
        .send(userCopy);

      expect(res.status).toBe(400);
      done();
    });

    test('Password is required', async done => {
      const userCopy = { ...userObject };

      delete userCopy.password;

      const res = await request(server)
        .post('/api/auth/register')
        .send(userCopy);

      expect(res.status).toBe(400);
      done();
    });

    test('Full Name is required', async done => {
      const userCopy = { ...userObject };

      delete userCopy.fullName;

      const res = await request(server)
        .post('/api/auth/register')
        .send(userCopy);

      expect(res.status).toBe(400);
      done();
    });

    test('imageUrl and isConfirmed are not required', async done => {
      const userCopy = { ...userObject };

      delete userCopy.imageUrl;
      delete userCopy.isConfirmed;

      const res = await request(server)
        .post('/api/auth/register')
        .send(userCopy);

      expect(res.status).toBe(201);
      done();
    });

    test('Email cannot belong to multiple users', async done => {
      await request(server)
        .post('/api/auth/register')
        .send(userObject);

      const res = await request(server)
        .post('/api/auth/register')
        .send(userObject);

      expect(res.status).toBe(400);

      expect(res.body.message).toBe(`User with this email already exists`);
      done();
    });
  });

  const loginUserObject = {
    email: 'h.kakashi@gmail.com',
    password: 'aVeryLongPassword',
  };

  describe('Login Endpoint', () => {
    test('Returns 200 OK on successful login', async done => {
      await request(server)
        .post('/api/auth/register')
        .send(userObject);

      const res = await request(server)
        .post('/api/auth/login')
        .send(loginUserObject);
      expect(res.status).toBe(200);
      done();
    });

    test('Token is returned on successful login', async done => {
      await request(server)
        .post('/api/auth/register')
        .send(userObject);

      const res = await request(server)
        .post('/api/auth/login')
        .send(loginUserObject);

      expect(res.status).toBe(200);

      expect(res.body.data.token).not.toBe(null || undefined);
      done();
    });

    test('Provided Email does not exist', async done => {
      await request(server)
        .post('/api/auth/register')
        .send(userObject);

      const res = await request(server)
        .post('/api/auth/login')
        .send({ email: 'test@test.com', password: 'aVeryLongPassword' });

      expect(res.status).toBe(404);

      expect(res.body.message).toBe(`User with this email does not exists`);
      done();
    });

    test('Provided password is invalid', async done => {
      await request(server)
        .post('/api/auth/register')
        .send(userObject);

      const res = await request(server)
        .post('/api/auth/login')
        .send({
          email: 'h.kakashi@gmail.com',
          password: 'testPasswordNotCorrect',
        });

      expect(res.status).toBe(401);
      expect(res.body.message).toBe('Invalid credentials');
      done();
    });

    test('Email is required', async done => {
      const userCopy = { ...userObject };

      delete userCopy.email;

      const res = await request(server)
        .post('/api/auth/login')
        .send(userCopy);

      expect(res.status).toBe(400);
      done();
    });

    test('Password is required', async done => {
      const userCopy = { ...loginUserObject };

      delete userCopy.password;

      const res = await request(server)
        .post('/api/auth/login')
        .send(userCopy);

      expect(res.status).toBe(400);
      done();
    });
  });

  describe('Email Confirmation', () => {
    test('Validation works', async done => {
      const userRes = await request(server)
        .post('/api/auth/register')
        .send(userObject);

      const { user } = userRes.body.data;
      const token = generateToken(user, EMAIL_SECRET);
      const res = await request(server)
        .post('/api/auth/confirm_email')
        .send({ token });
      expect(res.status).toBe(200);
      done();
    });
  });

  describe('Forgot Password', () => {
    test('Get email sent to reset password if forgotten', async done => {
      await request(server)
        .post('/api/auth/register')
        .send(userObject);

      const res = await request(server)
        .post('/api/auth/forgot_password')
        .send({ email: 'h.kakashi@gmail.com' });

      expect(res.status).toBe(200);
      expect(res.body.message).toBe('Password reset link sent to your email');
      done();
    });

    test('Email is sent', async done => {
      iwm.newMail(exampleMail);

      const lastMail = iwm.lastMail();

      expect(lastMail).not.toBe(null || undefined);
      done();
    });

    test('Will not get an email sent if wrong email', async done => {
      await request(server)
        .post('/api/auth/register')
        .send(userObject);

      const res = await request(server)
        .post('/api/auth/forgot_password')
        .send({ email: 't.test@gmail.com' });

      expect(res.status).toBe(500);
      done();
    });
  });

  describe('Reset password', () => {
    test('Cannot reset password if not valid token', async done => {
      const res = await request(server)
        .post('/api/auth/reset_password/aaeu@ygdifgiert')
        .send({ password: 'test', confirmPassword: 'test' });

      expect(res.status).toBe(400);
      expect(res.body.message).toBe(`Invalid token or previously used token`);
      done();
    });
    test('User can reset password, testing if token is valid', async done => {
      const newUser = await request(server)
        .post('/api/auth/register')
        .send(userObject);

      const userResetToken = crypto.randomBytes(20).toString('hex');

      await model.insertResetToken({
        user_id: newUser.body.data.user.id,
        token: userResetToken,
        active: 1,
      });

      // Resetting the password here
      const res = await request(server)
        .post(`/api/auth/reset_password/${userResetToken}`)
        .send({ password: 'test', confirmPassword: 'test' });

      expect(res.status).toBe(200);
      expect(res.body.message).toBe('Password has been reset');

      // testing if the user can login with the new password
      const resLogin = await request(server)
        .post('/api/auth/login')
        .send({ email: 'h.kakashi@gmail.com', password: 'test' });

      expect(resLogin.status).toBe(200);
      expect(resLogin.body.message).toBe(`Welcome. You're logged in!`);
      done();
    });
  });

  describe('[GET] /google/', () => {
    test('Unable to redirect google accout unconfirmed', async done => {
      const res = await request(server).get('/api/auth/google/');
      expect(res.status).toBe(302);
      done();
    });
  });

  describe('[POST] /google/:token', () => {
    test('Returns 200 on success', async done => {
      await request(server)
        .post('/api/auth/register')
        .send(userObject);

      const res = await request(server)
        .post('/api/auth/login')
        .send(loginUserObject);

      const { token } = res.body.data;

      const response = await request(server).post(`/api/auth/google/${token}`);

      expect(response.status).toBe(200);
      done();
    });
    test('return 401 user not authorized', async done => {
      const response = await request(server).post(`/api/auth/google/1`);

      expect(response.status).toBe(401);
      done();
    });
  });

  describe('viewProfile Endpoint', () => {
    test('Returns 200 on success', async done => {
      // register the user
      await request(server)
        .post('/api/auth/register')
        .send(userObject);

      // log the user in
      const res = await request(server)
        .post('/api/auth/login')
        .send(loginUserObject);

      const { token } = res.body.data;
      expect(res.status).toBe(200);
      expect(token).not.toBe(null || undefined);

      // authorize token and get user profile
      const response = await request(server)
        .get('/api/auth/view_profile')
        .set('Authorization', `${token}`);
      expect(response.status).toBe(200);
      done();
    });
  });

  describe('Upload Profile Image Endpoint', () => {
    test('Returns 200 on success', async done => {
      // register the user
      await request(server)
        .post('/api/auth/register')
        .send(userObject);

      // log the user in
      const res = await request(server)
        .post('/api/auth/login')
        .send(loginUserObject);

      const { token } = res.body.data;
      expect(res.status).toBe(200);
      expect(token).not.toBe(null || undefined);

      // authorize token, send image url and store user image url
      const response = await request(server)
        .post('/api/auth/uploadProfile_img')
        .set('Authorization', `${token}`)
        .send({ imageUrl: 'this-is-a-test' });
      expect(response.status).toBe(200);
      done();
    });
  });

  describe('Update password endpoint', () => {
    test('Returns 200 on successful update', async done => {
      const res = await request(server)
        .post('/api/auth/register')
        .send(userObject);

      const { token } = res.body.data;
      expect(res.status).toBe(201);
      expect(token).not.toBe(null || undefined);

      const response = await request(server)
        .post('/api/auth/update_password')
        .set('Authorization', `${token}`)
        .send({
          oldPassword: userObject.password,
          newPassword: 'newpassword',
          confirmPassword: 'newpassword',
        });

      expect(response.status).toBe(200);

      done();
    });

    test('Fails if old password is invalid', async done => {
      const res = await request(server)
        .post('/api/auth/register')
        .send(userObject);

      const { token } = res.body.data;
      expect(res.status).toBe(201);
      expect(token).not.toBe(null || undefined);

      const response = await request(server)
        .post('/api/auth/update_password')
        .set('Authorization', `${token}`)
        .send({
          oldPassword: 'badpassword',
          newPassword: 'newpassword',
          confirmPassword: 'newpassword',
        });

      expect(response.status).toBe(400);

      done();
    });
  });
});
