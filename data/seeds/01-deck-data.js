exports.seed = function(knex) {
  return knex('decks')
    .del()
    .then(function() {
      return knex('decks').insert([
        {
          name: 'Statistical Learning',
          user_id: 1,
          public: true,
        },
        {
          name: 'General Science',
          user_id: 2,
          public: false,
        },
        { name: 'Technology ', user_id: 3, public: true },
        { name: 'Biology ', user_id: 4, public: true },
        {
          name: 'Basic General Knowledge',
          user_id: 5,
          public: true,
        },
        {
          name: 'Famous Personalities',
          user_id: 6,
          public: true,
        },
        {
          name: 'Network Security',
          user_id: 7,
          public: false,
        },
      ]);
    });
};
