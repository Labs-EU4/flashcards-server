const request = require('supertest');
const nodemailer = require('nodemailer');
const server = require('../../api/server');

const userObject = {
  fullName: 'Awesome User',
  email: 'awesomeuser@xyz.com',
  password: 'ALongSecurePassword',
  imageUrl: 'google.com',
};

const sendMailMock = jest.fn();
jest.mock('nodemailer');

nodemailer.createTransport.mockReturnValue({ sendMail: sendMailMock });

let authToken;

beforeEach(async done => {
  sendMailMock.mockClear();
  nodemailer.createTransport.mockClear();

  const userRes = await request(server)
    .post('/api/auth/register')
    .send(userObject);

  authToken = userRes.body.data.token;
  done();
});

describe('User Feedback Endpoint', () => {
  test('Will return 201 CREATED and make sure email is sent', async done => {
    // 1 - 201 status code; 2 - check email was sent
    expect.assertions(2);

    const response = await request(server)
      .post('/api/feedback')
      .send({ feedback: 'hello' })
      .set('Accept', 'application/json')
      .set('Authorization', authToken)
      .expect('Content-Type', /json/);

    expect(response.status).toBe(201);
    expect(sendMailMock).toHaveBeenCalled();
    done();
  });
});
