### Problèmes, impact et vérification

1 - Le déclencheur "Réserver" était un `<div onClick>`. Impossible de l'atteindre avec Tab ou à l'activer avec Entrée/Espace. Aucun rôle n'est annoncé, donc la réservation est inaccessible sans souris.
-> On a modifier en `<button type="button">` avec le nom visible "Réserver {titre}"
-> Pour vérifier : Tab jusqu'à "Après l'aube", puis Entrée et Espace ouvrent la fenêtre. DevTools > Accessibilité : rôle `button`, nom "Réserver Après l'aube"

2 - La fenêtre était un `<div>` sans rôle ni nom, sans gestion du focus. Le contenu derrière restait dans le parcours de Tab. Le lecteur d'écran n'annonce pas de dialogue. Le focus reste sur la page, la touche Tab part derrière la fenêtre et l'utilisateur se perd.
-> On a rajouter `<dialog aria-labelledby="booking-title">` + `showModal()`. Cela donne le rôle `dialog`, le nom repris du titre, le focus placé dans la fenêtre et une page de fond pas selectionnable.
-> Pour vérifier, on va dans DevTools > Accessibilité sur le `<dialog>` : rôle `dialog`, nom "Réserver Après l'aube". À l'ouverture, `document.activeElement` est le titre `<h2 tabIndex={-1}>` « Réserver Après l'aube » : il est lu en premier et reste hors du parcours Tab. Tab/Maj+Tab ne parcourent que "Fermer la réservation" et "Revenir aux films"

3 - La fermeture se faisait par un `<span>×</span>` sans nom, sans prise en charge d'Escape et sans retour du focus. Il est donc impossible de fermer au clavier. Après fermeture, le focus repart en haut de page et l'utilisateur perd sa place.
-> On a rajouter `<button aria-label="Fermer la réservation">` (× en `aria-hidden`). Escape est géré nativement par `<dialog>`. `onClose` remet le focus sur le bouton déclencheur mémorisé au clic.
-> On a vérifié qu'escape ferme bien, puis `document.activeElement` est le bouton "Réserver Après l'aube". Même essai avec le bouton Fermer. Scénario refait avec "Orbite 9" : le focus revient bien sur "Réserver Orbite 9"
