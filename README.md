# ECHOES: LAST STAND

Jeu d'action arcade, survival shooter et roguelite léger inspiré de la science-fiction sombre de 2489. Défendez les colonies humaines contre l'invasion des Égarés.

## Lancement
- **Local (Direct)** : Ouvrez simplement le fichier `index.html` dans un navigateur moderne (Chrome, Safari, Firefox, Edge).
- **Serveur Local (Recommandé pour PWA / Audio)** : 
  - Avec Python : `python3 -m http.server 8000`
  - Avec Node.js : `npx http-server`
- **Mobile** : Ouvrez l'URL locale sur votre smartphone ou installez l'application via le menu du navigateur ("Ajouter à l'écran d'accueil").

## Contrôles
- **Ordinateur** : 
  - Déplacement : Touches `A` / `D` ou Flèches `Gauche` / `Droite`
  - Pause : Touche `Échap` (Esc)
- **Mobile / Tactile** : 
  - Glissez horizontalement (touch drag) n'importe où dans la zone de jeu pour déplacer l'unité ORION.
  - Le tir est entièrement automatique.

## Fonctionnalités
- 5 missions uniques avec environnements et boss distincts.
- 8 archétypes d'ennemis aux comportements variés.
- 6 armes aux statistiques et effets uniques.
- Système d'améliorations roguelite entre les vagues (commun, rare, épique, légendaire).
- Progression permanente sauvegardée localement (`localStorage`).
- Audio synthétisé via Web Audio API.
