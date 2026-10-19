import { useEffect, useMemo, useRef, useState } from "react";
import posterAube from "./assets/aube.svg";
import posterMemoire from "./assets/memoire.svg";
import posterOrbite from "./assets/orbite.svg";

const films = [
  { id: 1, title: "Après l’aube", genre: "Drame", time: "18 h 10", available: true, poster: posterAube },
  { id: 2, title: "La mémoire des murs", genre: "Documentaire", time: "19 h 30", available: false, poster: posterMemoire },
  { id: 3, title: "Orbite 9", genre: "Science-fiction", time: "21 h 00", available: true, poster: posterOrbite },
];

export default function App() {
  const [query, setQuery] = useState("");
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const selectedFilm = films.find((film) => film.id === selectedId);
  const dialogRef = useRef<HTMLDialogElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const triggerRef = useRef<HTMLButtonElement | null>(null);
  const [favorites, setFavorites] = useState<number[]>([]);
  const filteredFilms = useMemo(
    () => films.filter((film) => film.title.toLowerCase().includes(query.toLowerCase())),
    [query],
  );
  useEffect(() => {
    const dialog = dialogRef.current;
    if (selectedFilm && dialog && !dialog.open) {
      dialog.showModal();
      // Le titre reçoit le focus à l'ouverture : il est lu en premier, puis Tab mène aux boutons.
      titleRef.current?.focus();
    }
  }, [selectedFilm]);
  const openBooking = (id: number, trigger: HTMLButtonElement) => {
    triggerRef.current = trigger;
    setSelectedId(id);
  };
  const closeBooking = () => dialogRef.current?.close();
  const handleDialogClose = () => {
    setSelectedId(null);
    triggerRef.current?.focus();
    triggerRef.current = null;
  };
  const toggleFavorite = (id: number) => {
    setFavorites((items) => items.includes(id) ? items.filter((item) => item !== id) : [...items, id]);
  };

  return (
    <>
      <header className="topbar">
        <a className="brand" href="#programme" onClick={() => setQuery("")}>CinéScope</a>
        <nav aria-label="Navigation principale">
          <ul className="menu">
            <li><a href="#programme">Programme</a></li>
            <li><a href="#infos">Informations</a></li>
          </ul>
        </nav>
      </header>
      <main className="page">
        <h1>Films à l’affiche</h1>
        <p className="intro">Découvrez la programmation de cette semaine.</p>
        <div className="search-field">
          <label htmlFor="film-search">Rechercher un film</label>
          <input id="film-search" className="search" type="search" value={query}
            onChange={(event) => setQuery(event.target.value)} />
        </div>
        <section id="programme" aria-labelledby="programme-title">
          <h2 id="programme-title">Programme</h2>
          <div className="film-grid">
            {filteredFilms.map((film) => {
              const isFavorite = favorites.includes(film.id);
              return (
                <article className="film-card" key={film.id}>
                  <img src={film.poster} alt="" />
                  <div className="film-content">
                    <p className={"availability " + (film.available ? "available" : "unavailable")}>
                      {film.available ? "Places disponibles" : "Séance complète"}
                    </p>
                    <h3>{film.title}</h3>
                    <p>{film.genre} · {film.time}</p>
                    <div className="actions">
                      <button type="button" className="booking-trigger" aria-haspopup="dialog"
                        onClick={(event) => openBooking(film.id, event.currentTarget)}>Réserver {film.title}</button>
                      <button type="button" className="favorite" aria-pressed={isFavorite}
                        aria-label={"Favori : " + film.title} onClick={() => toggleFavorite(film.id)}>
                        <span aria-hidden="true">{isFavorite ? "★" : "☆"}</span>
                      </button>
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
          {/* Région toujours présente : seul son texte change, pour que l'annonce soit lue. */}
          <p role="status">{filteredFilms.length === 0 ? "Aucun film ne correspond à votre recherche." : ""}</p>
        </section>
        <section id="infos" className="infos" aria-labelledby="infos-title">
          <h2 id="infos-title">Informations pratiques</h2>
          <p>Le cinéma ouvre trente minutes avant la première séance.</p>
        </section>
        <dialog className="modal" ref={dialogRef} aria-labelledby="booking-title" onClose={handleDialogClose}>
          {selectedFilm && (
            <>
              <div className="dialog-heading">
                <h2 id="booking-title" ref={titleRef} tabIndex={-1}>Réserver {selectedFilm.title}</h2>
                <button
                  type="button"
                  className="close"
                  aria-label="Fermer la réservation"
                  onClick={closeBooking}
                >
                  <span aria-hidden="true">×</span>
                </button>
              </div>
              <p>{selectedFilm.genre} · Séance de {selectedFilm.time}</p>
              <p className={"availability " + (selectedFilm.available ? "available" : "unavailable")}>
                {selectedFilm.available ? "Places disponibles" : "Séance complète"}
              </p>
              <p>Consultez la séance et sa disponibilité avant de revenir au programme.</p>
              <button className="dialog-action" type="button" onClick={closeBooking}>Revenir aux films</button>
            </>
          )}
        </dialog>
      </main>
    </>
  );
}
