print('Start #################################################################');

<<<<<<< HEAD
db = db.getSiblingDB('tests_db_user');
db.createUser(
  {
    user: 'beyondvisiontesteur',
    pwd: 'testpassword',
    roles: [{ role: 'readWrite', db: 'tests_db_user' }]
  },
);

=======
>>>>>>> ae7dc7967a634c2986598fe132a8c5a2adaa3d48
db = db.getSiblingDB('tests_db_project');
db.createUser(
  {
    user: 'beyondvisiontesteur',
    pwd: 'testpassword',
    roles: [{ role: 'readWrite', db: 'tests_db_project' }],
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