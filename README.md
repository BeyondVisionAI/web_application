# Beyond Vision - Plateforme Web

[![forthebadge](http://forthebadge.com/images/badges/built-with-love.svg)](http://forthebadge.com) [![forthebadge](https://forthebadge.com/images/badges/made-with-javascript.svg)](https://forthebadge.com)  [![forthebadge](http://forthebadge.com/images/badges/powered-by-electricity.svg)](http://forthebadge.com)

Le but de notre projet est de créer une plateforme d'automatisation de la création de l'audiodescription fiable et rapide afin que les déficients visuels puissent avoir plus de contenu adapté à leurs besoins.
Cette partie est consacrée à la plateforme web qui permettra aux utilisateurs d'effectuer de l'audiodescription le plus facilement possible.
<!-- TABLE OF CONTENTS -->
<details open="open">
  <summary>Table of Contents</summary>
  <ol>
    <li>
      <a href="#les-technologies-utilisées">Les Technologies utilisées</a>
    <li>
      <a href="#getting-started">Mise en route</a>
      <ul>
        <li><a href="#version-de-développement">Version de Développement</a></li>
        <li><a href="#version-de-production">Version de Production</a></li>
      </ul>
    </li>
    <li><a href="#contribution">Contribution</a></li>
    <li><a href="#auteurs">Auteurs</a></li>
    <li><a href="#license">License</a></li>
  </ol>
</details>

### Les technologies utilisées
Pour ce projet nous avons utilisé les technologies suivantes:

- MongoDb
- ExpressJs
- ReactJs
- NodeJs
- Docker

### Mise en route
##### Version de Développement :
Afin de lancer le projet en mode développement il vous faudra avoir docker ainsi que docker compose sur votre machine.
Vous pouvez suivre ces tutoriels afin de les installer:
 - [Installer Docker](https://docs.docker.com/get-docker/)
 - [Installer Docker Compose](https://docs.docker.com/compose/install/)

Il vous faudra ensuite vous rendre à la racine du repository et lancer la commande suivante :

###### Avec Logs :

```console
foo@bar:~$ docker-compose -f ./docker-compose-dev.yaml up --build
```

###### Sans Logs :

```console
foo@bar:~$ docker-compose -f ./docker-compose-dev.yaml up --build -d
```

Vous aurez ensuite accès aux fonctionnalités aux adresses suivantes:
 - http://localhost → Plateforme Web
 - http://localhost:8080 → Server Web
 - http://localhost:8081 → Inspecteur de bdd

##### Version de Production :
Afin de lancer le projet en mode développement il vous faudra avoir docker ainsi que docker compose sur votre machine.
Vous pouvez suivre ces tutoriels afin de les installer:
 - [Installer Docker](https://docs.docker.com/get-docker/)
 - [Installer Docker Compose](https://docs.docker.com/compose/install/)

Il vous faudra ensuite vous rendre à la racine du repository et lancer la commande suivante :

###### Avec Logs :

```console
foo@bar:~$ docker-compose -f ./docker-compose-prod.yaml up --build
```

###### Sans Logs :

```console
foo@bar:~$ docker-compose -f ./docker-compose-prod.yaml up --build -d
```
Vous aurez ensuite accès aux fonctionnalités aux adresses suivantes:
 - http://localhost → Plateforme Web
 - http://localhost:8080 → Server Web

## Contribution

Si vous souhaitez contribuer, créez votre branche et faites des pull requests sur la branch Dev.


## Auteurs
* **Alex Gaignard** _alias_ [@XelaG](https://github.com/XelaG)
* **Léo Ménard** _alias_ [@softhy85](https://github.com/softhy85)
* **Matthieu Desrues** _alias_ [@MinMatth-Magi](https://github.com/MinMatth-Magi)
* **Marc Olivier Lauret** _alias_ [@Marc-olivierLAURET](https://github.com/Marc-olivierLAURET)
* **Fabien Cheung Lim Yen** _alias_ [@Fistoflex](https://github.com/Fistoflex)
* **Dimitri Clain** _alias_ [@Dimitri-CLAIN](https://github.com/Dimitri-CLAIN)
* **Paul Van Kerckvoorde** _alias_ [@Polipoppy](https://github.com/Polipoppy)
* * **Paul Van Kerckvoorde** _alias_ [@Tim-Snugget](https://github.com/Tim-Snugget)


## License

Ce projet est sous licence ``exemple: WTFTPL`` - voir le fichier [LICENSE.md](LICENSE.md) pour plus d'informations
