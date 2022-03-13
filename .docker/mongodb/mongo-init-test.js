print('Start #################################################################');

db = db.getSiblingDB('tests_db_user');
db.createUser(
  {
    user: 'beyondvisiontesteur',
    pwd: 'testpassword',
    roles: [{ role: 'readWrite', db: 'tests_db_user' }]
  },
);

db = db.getSiblingDB('tests_db_project');
db.createUser(
  {
    user: 'beyondvisiontesteur',
    pwd: 'testpassword',
    roles: [{ role: 'readWrite', db: 'tests_db_project' }],
  },
);

db = db.getSiblingDB('tests_db_list');
db.createUser(
  {
    user: 'beyondvisiontesteur',
    pwd: 'testpassword',
    roles: [{ role: 'readWrite', db: 'tests_db_list' }]
  },
);

db = db.getSiblingDB('tests_db_example');
db.createUser(
  {
    user: 'beyondvisiontesteur',
    pwd: 'testpassword',
    roles: [{ role: 'readWrite', db: 'tests_db_example' }]
  },
);

print('END #################################################################');