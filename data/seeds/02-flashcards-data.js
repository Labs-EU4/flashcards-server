/* eslint-disable max-len */
exports.seed = function(knex) {
  return knex('flashcards')
    .del()
    .then(function() {
      return knex('flashcards').insert([
        {
          deck_id: 1,
          user_id: 1,
          question: 'What is data mining?',
          answer:
            'Its when biotech and infotech merge and people become data mines',
          created_at: '2020-01-08T10:44:38.761Z',
          updated_at: '2020-01-08T10:44:38.761Z',
        },
        {
          deck_id: 1,
          user_id: 1,
          question: 'Hey Anna hehe sup',
          answer: 'How you doing?',
          created_at: '2020-01-08T10:45:05.269Z',
          updated_at: '2020-01-08T10:45:05.269Z',
        },
        {
          deck_id: 2,
          user_id: 2,
          question: 'Which of the following is used in pencils?',
          answer: 'Graphite',
        },
        {
          deck_id: 2,
          user_id: 2,
          question:
            'Brass gets discoloured in air because of the presence of which of the following gases in air?',
          answer: 'Hydrogen sulphide',
        },
        {
          deck_id: 3,
          user_id: 3,
          question:
            'In which decade was the American Institute of Electrical Engineers (AIEE) founded?',
          answer: '1880s',
        },
        {
          deck_id: 3,
          user_id: 3,
          question:
            'What is part of a database that holds only one type of information?',
          answer: 'Field',
        },
        {
          deck_id: 4,
          user_id: 4,
          question:
            'Ordinary table salt is sodium chloride. What is baking soda?',
          answer: 'Sodium bicarbonate',
        },
        {
          deck_id: 4,
          user_id: 4,
          question: 'Plants receive their nutrients from the?',
          answer: 'Sun',
        },
        {
          deck_id: 5,
          user_id: 5,
          question:
            'Grand Central Terminal, Park Avenue, New York is the world...?',
          answer: 'largest railway station',
        },
        {
          deck_id: 5,
          user_id: 5,
          question:
            'For which of the following disciplines is Nobel Prize awarded?',
          answer:
            'Physics and Chemistry, Physiology or Medicine, Literature, Peace and Economics',
        },
        {
          deck_id: 6,
          user_id: 6,
          question: 'Who is the father of Geometry?',
          answer: 'Euclid',
        },
        {
          deck_id: 6,
          user_id: 6,
          question:
            'The Indian to beat the computers in mathematical wizardry is',
          answer: 'Shakunthala Devi',
        },
        {
          deck_id: 7,
          user_id: 7,
          question: 'here is my question answer me',
          answer: 'here is my answer question me',
        },
      ]);
    });
};
