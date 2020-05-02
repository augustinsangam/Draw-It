L’outil Seau de peinture sert à changer la couleur de toute une région de l’image. Pour l'utiliser, cliquez sur l'icône ![icône outil seau de peinture](./assets/sidebar-icons/bucket.png) ou pressez la touche **`B`** de votre clavier. Commencez par sélectionner la couleur à appliquer avec l’outil Couleur (couleur principale).

Le seau de peinture remplace tous les pixels adjacents et de la même couleur que le pixel cliqué par l’outil par la couleur principale sélectionnée précédemment.

 Le panneau d’options de l’outil Seau de peinture propose une valeur de « Tolérance » exprimée en pourcentage. Cette valeur définit à quel point les pixels adjacents au pixel cliqué seront pris en compte dans le remplacement de la couleur : une tolérance de 0% indique que SEULS les pixels ayant exactement la couleur du pixel cliqué seront sélectionnés pour le remplacement. 

<video width="90%" height="70%" class="doc-fig" autoplay loop>
    <source src="./assets/doc/vid/bucket.webm" type="video/webm">
</video>

En augmentant la tolérance, on prend en compte des pixels dont la couleur est de moins en moins proche de la couleur du pixel cliqué (utile par exemple lors du remplacement d’un ciel bleu comportant beaucoup de légères nuances de bleu). Suivant ce raisonnement, une tolérance de 100% prendra en compte tous les pixels de la zone de dessin. 

Une fois le remplacement de couleur effectué, DrawIt créera un nouvel objet dont la géométrie a été définie par la méthode présentée ci-dessus à l’aide de la valeur de tolérance. Cet objet pourra être sélectionnée et manipulé de la même manière qu’un objet créé à l’aide de l’outil Rectangle par exemple.
