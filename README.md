# Important

Les commandes doivent être exécutées dans `client` ou `server`.

## Installation des dépendances

- `npm i`

## Développement de l'application

Pour le serveur, `npm run build` transpile le TypeScript, et `npm start` exécute
le JavaScript en continu. `npm run watch` permet d’auto-transpiler à chaque
modification de code.

## Génération de composants du client

`ng generate component <name>` crée un component.

Il est aussi possible de générer des directives, pipes, services, guards,
interfaces, enums, muodules, classes, avec cette commande `ng generate
directive|pipe|service|class|guard|interface|enum|module`.

## Exécution des tests unitaires

- `npm t` exécute les test

- `npm run coverage` génére un rapport de couverture de code

## Exécution de ESLint/TSLint

- `npm run lint` exécute TSLint pour le client et ESLint pour le serveur

## Documentation externe

- [Angular CLI README](//github.com/angular/angular-cli/blob/master/README.md)
  (ou `ng help`)

- [Angular Testing](//angular.io/guide/testing)

- [Angular](//angular.io/docs)

- [Express](//expressjs.com/en/4x/api.html)

- [Mongo](//docs.mongodb.com/manual/)

- [DevDocs](//devdocs.io)

# Standards de programmation

## Format

Une ligne de code ne devrait JAMAIS dépasser les 80 caractères (par défaut dans
[ESLint](//eslint.org/docs/rules/max-len#options)).

## Conventions de nommage

- UPPER\_SNAKE\_CASE pour les constantes

- PascalCase pour les noms de types et les valeurs d'énumérations

- camelCase pour les noms de fonctions, de propriétés et de variables

- kebab-case pour les noms de balises des composants Angular

- Pas d’abbréviations dans les noms de variables ou de fonctions

- Un tableau/list/dictionnaire devrait avoir un nom indiquant qu'il contient
  plusieurs objets, par exemple "cars"

- Pas de type dans le nom (“listOfCars” devient “cars”)

- Guillemets simples dans HTML **si nécessaire**

- En html, si le tag est auto-suffisant, ajouter un slash à la fin (e.g. `<br
  />`)

## Autres standards

- Code en anglais

- Pas de `var`, mais `let` ou `const`

- Pas de `any` ou `object`

- Pas de `function`, mais fonctions anonymes `() => {…}`

- Types de paramètre et de retour obligatoires (même `void`)

- Une responsabilité par fonction (pas d’overloading)

- Moins de cinq paramètres pour chaque fonction

- Pas de nombres ni de chaînes de caractères magiques

## Git

- Une seule fonctionnalité par branche

- Une branche fonctionnalité devrait se nommer `fonctionnalite/<nom>`

- Une branche correction de bogue devrait se nommer `boguefixe/<npm>`

- Messages de commit consis (français, court, temps au présent, troisième
  personne du singulier)

https://github.com/sourcegraph/javascript-typescript-langserver/pull/480#discussion_r197905711

<!-- vim:cc=80:tw=80:fo+=t:fo-=l
-->
