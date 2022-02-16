

Tests unitaires

Lib utilisée: Jest && SuperTest
Jest va parcourir tous les fichiers du programme, et executer tous les fichiers '.test.js' de façon asynchrone. Ca veut dire que les fichiers ne peuvent pas intéragir avec d'autres .test.js

Pour la database, j'utilise une DB sur MongoDB en local. Vous pouvez la télécharger depuis https://docs.mongodb.com/manual/tutorial/install-mongodb-on-ubuntu/

3 fonctions principales:
 - describe: Sert à créer un groupe de plusieurs tests, utile pour les regrouper sous un même nom
 - it: C'est un test, il faut préciser 'async' si le test a un await
 - expect: C'est les checks dans les tests, si un expect échoue, Jest notera le test comme un échec. Ca sert en quelque sort à comparer deux valeurs (voir fichiers d'exemples) (ex: expect("toto).toBe("tata") sera faux) (voir sur internet pour les autres fonctions que 'toBe')

Fonctions secondaires mais utiles:
 - beforeAll: Cette fonction va être la première appelée du fichier. Si le beforeAll est dans un describe, elle sera la première fonction appelée du describe. Elle est utile pour setup la connection avec la DB pour le fichier.
 - beforeEach: Lancée avant chaque test. Vous pouvez mettre la fonction dans un describe, et elle se lancera qu'avant chaque test du describe (Utile dans le cas où vous voulez générer de la data dans la DB avant plusieurs tests)
 - afterEach: Pareil que pour le beforeEach, mais après chaque test. Ca peut être utilisé pour réinitialiser de la data.
 - afterAll: pareil que pour le beforeAll, mais après tous les tests.
 Sert par exemple à couper la connection à la DB

L'ordre de priorité des fonctions est celui-ci:
```
beforeAll(() => console.log('1 - beforeAll'));
afterAll(() => console.log('1 - afterAll'));
beforeEach(() => console.log('1 - beforeEach'));
afterEach(() => console.log('1 - afterEach'));
test('', () => console.log('1 - test'));
describe('Scoped / Nested block', () => {
  beforeAll(() => console.log('2 - beforeAll'));
  afterAll(() => console.log('2 - afterAll'));
  beforeEach(() => console.log('2 - beforeEach'));
  afterEach(() => console.log('2 - afterEach'));
  test('', () => console.log('2 - test'));
});

// 1 - beforeAll
// 1 - beforeEach
// 1 - test
// 1 - afterEach
// 2 - beforeAll
// 1 - beforeEach
// 2 - beforeEach
// 2 - test
// 2 - afterEach
// 1 - afterEach
// 2 - afterAll
// 1 - afterAll
```

Vous pouvez voir des exemples dans /example.

IMPORTANT A NOTER :
Chaque fichier est lancé de façon asynchrone avec les autres, donc il ne faut pas qu'ils soient connectés à la même DB, pour éviter les conflits. Dans chaque fichier, pensez à mettre un nouveau nom de DB pour éviter ça.


/general: 
- server.js: Sert à simuler un nouveau serveur, qui ne se connecte pas à la DB
- dbManager.js: Fournit des fonctions pour manipuler la DB entre les tests
Ne pas oublier de modifier l'URL de votre database dans ce fichier.

/example:
Des fichiers d'exemples qui peuvent être utiles.


CONCERNANT LE DOCKER:
Toutes les databases doivent être générées par le docker.
Lorsque vous créez un nouveau fichier:
 - Ajouter dans l'env le nom de la nouvelle DB
 - Dans le mongo-init-test.js, créez la nouvelle db, et ajoutez les droits à l'utilisateur dessus
 - Dans le fichier de test que vous créez, utiliser la variable d'env que vous avez créé auparavant