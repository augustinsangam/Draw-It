###########
Page d'aide
###########

******
Client
******

``npm i``
  Cette commande installe toutes les dépendances nécessaires aux développement
  et à l'exécution du code.

``npm start``
  Cette commande démarre l'application, écoute tout changement dans le code et
  ouvre la page automatiquement dans le fureteur.

``npx ng serve``
  Cette commande démarre l'application et écoute tout changement dans le code.
  Il faut manuellement visiter le lien http://localhost:4200.

``npm run lint``
  Cette commande exécute TSLint.

*******
Serveur
*******

Le serveur requière une version de Node **>=13.2.0**.

``npm i``
  Cette commande installe toutes les dépendances nécessaires aux développement
  et à l'exécution du code.

Configuration
=============

Aussi, le serveur requière des données sensibles qui ne sont pas présents dans
ce répertoire, sans lesquelles il ne peut démarrer. Il est donc impératif de
créer le fichier ``secrets.json`` dans le dossier ``src/`` (ignoré par GIT) et
de le remplir en suivant le modèle fourni ci-suit:

.. code-block:: json

  {
    "email": {
      "key": "CLEF DE L'API MAIL"
    },
    "mongodb": {
      "auth": {
        "password": "MOT DE PASSE DE MONGODB",
        "user": "UTILISATEUR DE MONGODB"
      },
      "url": "LIEN DE MONGODB"
    }
  }

Exécution
=========

``npm run build``
  Cette commande transpile le TypeScript en JavaScript.

``npm start``
  Cette commande exécute le code transpilé par la commande précédente et démarre
  le serveur.

Développement
=============

``npm run build:watch``
  Cette commande transpile à chaque changement dans les fichiers TypeScript
  présents dans le dossier ``src/`` en JavaScript dans le dossier ``lib/``.
  La commande doit être exécutée dans un terminal *à part*.

``npm start``
  Cette commande lance le code présent dans le dossier ``lib/`` qui a été
  transpilé à partir du dossier ``src/`` par la commande précédente.

``npm t``
  Cette comamde lance les tests présents dans le dossier ``lib/__tests__/`` qui
  ont été transpilé à partir du dossier ``src/__tests__/`` par l'avant dernière
  commande.

``npm run coverage``
  Cette commande lance les tests et affiche la couverture du code.

``npm run lint``
  Cette commande exécute TSLint (_obsolète: https://medium.com/palantir/tslint-in-2019-1a144c2317a9).

``npm run eslint``
  Cette commande exécute ESLint.

Base de données locale
======================

Il faut installer la dernière version de mongodb.

``mkdir "${HOME}/.cache/db/"``
  Cette commande crée le répertoire à utiliser par mongodb pour sauvegarder les
  données.

``npm run db``
  Cette commande démarre le serveur de mongodb.

``npm run dbc``
  Cette commande démarre le client de mongodb.

Configuration
-------------

Depuis le client de mongodb.

``use log2990``
  Cette commande crée la base de données si elle n'existe pas et la sélectionne.

``db.createUser({ user: "foo", pwd: "bar", roles: [{ db: "log2990", role: "readWrite" }], mechanisms: ["SCRAM-SHA-256"] })``
  Cette commande permet de créer l'usager à utiliser pour la connection du
  serveur vers mongodb.

*********************
Documentation externe
*********************

- `Angular CLI <//github.com/angular/angular-cli/blob/master/README.md>`_

- `Angular Testing <//angular.io/guide/testing>`_

- `Angular <//angular.io/docs>`_

- `Express <//expressjs.com/en/4x/api.html>`_

- `Mongo <//docs.mongodb.com/manual/>`_

- `DevDocs <//devdocs.io>`_

**********************
Conventions de nommage
**********************

- En anglais

- UPPER_SNAKE_CASE pour les constantes

- PascalCase pour les noms de types et les valeurs d'énumérations

- camelCase pour les noms de fonctions, de propriétés et de variables

- kebab-case pour les noms de balises des composants Angular

- Pas d'abbréviations dans les noms de variables ou de fonctions

- Un tableau/list/dictionnaire devrait avoir un nom indiquant qu'il contient
  plusieurs objets, par exemple "cars"

- Pas de type dans le nom (“listOfCars” devient “cars”)

- Guillemets simples dans HTML **si nécessaire**

*******
Imports
*******

Évitez ce type d'import:

.. code-block:: js

  import * as Y from 'Y';

ou bien:

.. code-block:: js

  const Y = import('Y');

Préfèrez plutôt:

.. code-block:: js

  import { X } from 'Y';

ou à la limite:

.. code-block:: js

  import Y from 'Y';

***
GIT
***

- Une seule fonctionnalité par branche

- Une branche fonctionnalité devrait se nommer ``fonctionnalite/<nom>``

- Une branche correction de bogue devrait se nommer ``boguefixe/<npm>``

- Messages de commit consis (français, court, temps au présent, troisième
  personne du singulier)

.. vim:cc=80:tw=80:fo+=t:fo-=l
