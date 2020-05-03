###########
Page d'aide
###########

******
Développement
******

``npm i``
  Cette commande installe toutes les dépendances nécessaires aux développement
  et à l'exécution du code.

``npm start``
  Cette commande démarre l'application, écoute tout changement dans le code et
  ouvre la page automatiquement dans le fureteur.
  
``npm run electron-build``
  Cette commande exécute l'application dans une fenêtre unique.

``npx ng serve``
  Cette commande démarre l'application et écoute tout changement dans le code.
  Il faut manuellement visiter le lien http://localhost:4200.

``npm run lint``
  Cette commande exécute TSLint.


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

.. code-block:: ts

  // foo-bar.ts

  const FOO_BAR = 42;

  let fooBar = 42;

  const fooBar = (): number => 42;

  enum FooBar {
    // sorted if possible
    BAR,
    FOO,
  }

  interface FooBar {
    foo: number;
    bar?: string;
  }

  class FooBar {
    private static readonly BAZ: number = 42;

    private baz: string[];

    constructor() {
      this.baz = new Array();
    }

    private fooBar(): void {
      console.log(FooBar.BAZ);
    }
  }

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

*****
Extra
*****

`VSCode <//code.visualstudio.com>`_
===================================

Pour ouvrir le project, cliquez sur ``Open Workspace…`` depuis ``File`` et
selectionnez le fichier ``project.code-workspace`` présent à la racine du dépôt.
Installez aussi les extensions recommandées.

.. vim:cc=80:tw=80:fo+=t:fo-=l
