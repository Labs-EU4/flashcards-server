const request = require('supertest');

const server = require('./server');

describe('Server', () => {
  describe('[GET] /', () => {
    it('should return status code 200', async done => {
      const response = await request(server).get('/');
      expect.assertions(1);
      expect(response.status).toBe(200);
      done();
    });
    it('should return response json', async done => {
      const response = await request(server).get('/');
      expect.assertions(1);
      expect(response.body).toEqual({
        message: `Welcome to the QuickDecks API`,
      });
      done();
    });
  });
});
