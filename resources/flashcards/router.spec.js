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
// eslint-disable-next-line no-unused-vars
let user;
const flashcard = {
  deckId: null,
  questionText: 'When will AI takeover',
  answerText: 'What idk',
};

beforeEach(async done => {
  await db.raw('TRUNCATE TABLE users, decks, flashcards CASCADE');
  await db.seed.run({
    specific: '03-tags-data.js',
  });
  const userRes = await request(server)
    .post('/api/auth/register')
    .send(userObject);

  const deckRes = await request(server)
    .post('/api/decks')
    .send({ name: 'Example Deck', tags: [1, 2, 3] })
    .set('Authorization', userRes.body.data.token);

  authToken = userRes.body.data.token;
  flashcard.deckId = deckRes.body.deck.id;

  user = userRes.body.data.user;
  done();
});

afterAll(async done => {
  await db.destroy();
  done();
});

describe('Flashcards Router', () => {
  describe('[POST] /api/cards/', () => {
    test('validation for card body', async done => {
      const res = await request(server)
        .post('/api/cards')
        .send({})
        .set('Authorization', authToken);

      expect(res.status).toBe(400);
      expect(res.body).toEqual({ error: '"Question Text" is required' });
      done();
    });

    test('Create a new Flashcard', async done => {
      const res = await request(server)
        .post('/api/cards')
        .send(flashcard)
        .set('Authorization', authToken);

      expect(res.status).toBe(201);
      expect(res.body.card.question).toBe(flashcard.questionText);
      expect(res.body.card.answer).toBe(flashcard.answerText);
      done();
    });
  });

  describe('[GET] /api/cards', () => {
    test('Should get all cards created by user', async done => {
      await request(server)
        .post('/api/cards')
        .send(flashcard)
        .set('Authorization', authToken);
      await request(server)
        .post('/api/cards')
        .send({
          ...flashcard,
          questionText: 'Plants receive their nutrients from the?',
          answerText: 'sun',
        })
        .set('Authorization', authToken);

      const res = await request(server)
        .get(`/api/cards/`)
        .set('Authorization', authToken);

      expect(res.status).toBe(200);
      expect(res.body.cards).toHaveLength(2);
      done();
    });
  });

  describe('[GET] /api/cards/:id', () => {
    test('Get Card by ID', async done => {
      const { body } = await request(server)
        .post('/api/cards')
        .send(flashcard)
        .set('Authorization', authToken);

      const res = await request(server)
        .get(`/api/cards/${body.card.id}`)
        .set('Authorization', authToken);

      expect(res.status).toBe(200);
      expect(res.body.card.question).toBe(flashcard.questionText);
      done();
    });

    test('Check if flash card exists', async done => {
      const res = await request(server)
        .get(`/api/cards/100`)
        .set('Authorization', authToken);

      expect(res.status).toBe(404);
      expect(res.body).toEqual({
        message: 'Flashcard does not exist',
      });
      done();
    });
  });

  describe('[PUT] /api/cards/:id', () => {
    test('Update Card details', async done => {
      const { body } = await request(server)
        .post('/api/cards')
        .send(flashcard)
        .set('Authorization', authToken);

      const res = await request(server)
        .put(`/api/cards/${body.card.id}`)
        .send({
          ...flashcard,
          questionText: 'Updated question text',
          answerText: 'Updated answer text',
        })
        .set('Authorization', authToken);

      expect(res.status).toBe(200);
      expect(res.body.card.question).toBe('Updated question text');
      expect(res.body.card.answer).toBe('Updated answer text');
      done();
    });
  });

  describe('[DELETE] /api/cards/:id', () => {
    test('Delete Card by Id', async done => {
      await request(server)
        .post('/api/cards')
        .send({
          ...flashcard,
          questionText: 'Plants receive their nutrients from the?',
          answerText: 'sun',
        })
        .set('Authorization', authToken);

      await request(server)
        .post('/api/cards')
        .send({
          ...flashcard,
          questionText: 'Some question text',
          answerText: 'Some answer text',
        })
        .set('Authorization', authToken);

      const { body } = await request(server)
        .post('/api/cards')
        .send(flashcard)
        .set('Authorization', authToken);

      const res = await request(server)
        .delete(`/api/cards/${body.card.id}`)
        .set('Authorization', authToken);

      expect(res.status).toBe(204);

      const cardsRes = await request(server)
        .get(`/api/cards/`)
        .set('Authorization', authToken);

      expect(cardsRes.body.cards).toHaveLength(2);
      done();
    });
  });
});
