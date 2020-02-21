const request = require('supertest');
const server = require('../../api/server');
const db = require('../../data/dbConfig');

const userObject = {
  fullName: 'Test User',
  email: 'testuser@xyz.com',
  password: 'ALongSecurePassword',
  imageUrl: 'google.com',
};

let authToken;
let deckId;
let deckId2;
let cardId;
let session;

beforeEach(async done => {
  await db.raw('TRUNCATE TABLE users, decks, flashcards, sessions CASCADE');
  await db.seed.run({
    specific: '03-tags-data.js',
  });
  const userRes = await request(server)
    .post('/api/auth/register')
    .send(userObject);

  authToken = userRes.body.data.token;

  const deckRes = await request(server)
    .post('/api/decks')
    .send({ name: 'Example Deck', tags: [1, 2, 3] })
    .set('Authorization', userRes.body.data.token);

  const deckRes2 = await request(server)
    .post('/api/decks')
    .send({ name: 'Example Deck2', tags: [1, 2, 3] })
    .set('Authorization', userRes.body.data.token);

  const flashcard = {
    deckId: null,
    questionText: 'When will AI takeover',
    answerText: 'What idk',
    imageUrlQuestion:
      'https://robots.ieee.org/robots/cb2/Photos/SD/cb2-photo1-full.jpg',
    imageUrlAnswer:
      'https://robots.ieee.org/robots/cb2/Photos/SD/cb2-photo1-full.jpg',
  };

  flashcard.deckId = deckRes.body.deck.id;

  const cardRes = await request(server)
    .post('/api/cards')
    .send(flashcard)
    .set('Authorization', authToken);

  deckId = deckRes.body.deck.id;
  deckId2 = deckRes2.body.deck.id;
  cardId = cardRes.body.card.id;

  session = await request(server)
    .post('/api/sessions')
    .send({ deckId })
    .set('Authorization', authToken);

  done();
});

afterAll(async done => {
  await db.destroy();
  done();
});

describe('Sessions Router', () => {
  describe('[GET] /api/sessions', () => {
    test('When sending good request recieve 200', async done => {
      const res = await request(server)
        .get('/api/sessions')
        .set('Authorization', authToken);
      expect(res.status).toBe(200);
      expect(res.body.data[0].id).not.toBe(null || undefined);
      return done();
    });
    test('No auth recieve 401', async done => {
      const res = await request(server).get('/api/sessions');
      expect(res.status).toBe(401);
      return done();
    });
  });
  describe('[POST] /api/sessions', () => {
    test('send post with deckId gives 201', async done => {
      const res = await request(server)
        .post('/api/sessions')
        .send({ deckId: deckId2 })
        .set('Authorization', authToken);
      expect(res.status).toBe(201);
      return done();
    });
    test('returns 404 when deck doesnt exists', async done => {
      const res = await request(server)
        .post('/api/sessions')
        .send({ deckId: 100 })
        .set('Authorization', authToken);
      expect(res.status).toBe(404);
      return done();
    });
  });
  describe('[GET] /api/sessions/:sessionId', () => {
    test('Get session object when good request', async done => {
      const res = await request(server)
        .post('/api/sessions')
        .send({ deckId: deckId2 })
        .set('Authorization', authToken);
      const results = await request(server)
        .get(`/api/sessions/${res.body.session.id}`)
        .set('Authorization', authToken);
      expect(results.body.session.id).toBe(res.body.session.id);
      expect(results.status).toBe(200);
      return done();
    });
    test('get 401 when unauthorized request made', async done => {
      const res = await request(server)
        .post('/api/sessions')
        .send({ deckId: deckId2 });
      expect(res.status).toBe(401);
      return done();
    });
  });
  describe('[PUT] /api/sessions/:sessionId', () => {
    test('get 200 when good request made', async done => {
      const res = await request(server)
        .post('/api/sessions')
        .send({ deckId: deckId2 })
        .set('Authorization', authToken);
      const results = await request(server)
        .put(`/api/sessions/${res.body.session.id}`)
        .send({ isComplete: true })
        .set('Authorization', authToken);
      expect(results.status).toBe(200);
      return done();
    });
    test('get 404 when card doesnt exsist', async done => {
      const res = await request(server)
        .post('/api/sessions')
        .send({ deckId: deckId2 })
        .set('Authorization', authToken);
      const results = await request(server)
        .put(`/api/sessions/${res.body.session.id}`)
        .send({ cardIds: [400, 2, 1] })
        .set('Authorization', authToken);
      expect(results.status).toBe(404);

      return done();
    });
    test('get 404 when session doesnt exsists', async done => {
      const results = await request(server)
        .put(`/api/sessions/800`)
        .send({ cardIds: [400] })
        .set('Authorization', authToken);
      expect(results.status).toBe(404);
      return done();
    });
    test('get 404 when card already marked', async done => {
      await request(server)
        .put(`/api/sessions/${session.body.session.id}`)
        .send({ cardIds: [cardId] })
        .set('Authorization', authToken);
      const results = await request(server)
        .put(`/api/sessions/${session.body.session.id}`)
        .send({ cardIds: [cardId] })
        .set('Authorization', authToken);
      expect(results.status).toBe(404);
      return done();
    });
    test('get 404 when card doesnt belong to deck', async done => {
      const res = await request(server)
        .post('/api/sessions')
        .send({ deckId: deckId2 })
        .set('Authorization', authToken);
      const results = await request(server)
        .put(`/api/sessions/${res.body.session.id}`)
        .send({ cardIds: [cardId] })
        .set('Authorization', authToken);
      expect(results.status).toBe(404);
      return done();
    });
  });
  describe('[DELETE] /api/sessions/:sessionId', () => {
    test('', async done => {
      const res = await request(server)
        .post('/api/sessions')
        .send({ deckId: deckId2 })
        .set('Authorization', authToken);
      const results = await request(server)
        .delete(`/api/sessions/${res.body.session.id}`)
        .set('Authorization', authToken);
      expect(results.status).toBe(204);
      return done();
    });
    test('401 delete without token', async done => {
      const res = await request(server)
        .post('/api/sessions')
        .send({ deckId: deckId2 })
        .set('Authorization', authToken);

      const results = await request(server).delete(
        `/api/sessions/${res.body.session.id}`
      );

      expect(results.status).toBe(401);
      return done();
    });
  });
});
