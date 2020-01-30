# Crée les fichiers .md du fichier doc.json
# Utilisation : $ python3 jsonParser.py

import os
import json

mdFiles = os.listdir('doc.md/')

print(mdFiles)

# for mdFile in mdFiles:
with open('doc.md/' + 'Créer un nouveau dessin.md', 'r') as f:
    s = f.read()
