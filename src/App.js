import { useEffect, useRef, useState } from "react";
import StarRating from "./StarRating";
import { useMovies } from "./useMovies";
import { useLocalStorage } from "./useLocalStorage";

const tempMovieData = [
  {
    imdbID: "tt1375666",
    Title: "Inception",
    Year: "2010",
    Poster:
      "https://m.media-amazon.com/images/M/MV5BMjAxMzY3NjcxNF5BMl5BanBnXkFtZTcwNTI5OTM0Mw@@._V1_SX300.jpg",
  },
  {
    imdbID: "tt0133093",
    Title: "The Matrix",
    Year: "1999",
    Poster:
      "https://m.media-amazon.com/images/M/MV5BNzQzOTk3OTAtNDQ0Zi00ZTVkLWI0MTEtMDllZjNkYzNjNTc4L2ltYWdlXkEyXkFqcGdeQXVyNjU0OTQ0OTY@._V1_SX300.jpg",
  },
  {
    imdbID: "tt6751668",
    Title: "Parasite",
    Year: "2019",
    Poster:
      "https://m.media-amazon.com/images/M/MV5BYWZjMjk3ZTItODQ2ZC00NTY5LWE0ZDYtZTI3MjcwN2Q5NTVkXkEyXkFqcGdeQXVyODk4OTc3MTY@._V1_SX300.jpg",
  },
];

const tempWatchedData = [
  {
    imdbID: "tt1375666",
    Title: "Inception",
    Year: "2010",
    Poster:
      "https://m.media-amazon.com/images/M/MV5BMjAxMzY3NjcxNF5BMl5BanBnXkFtZTcwNTI5OTM0Mw@@._V1_SX300.jpg",
    runtime: 148,
    imdbRating: 8.8,
    userRating: 10,
  },
  {
    imdbID: "tt0088763",
    Title: "Back to the Future",
    Year: "1985",
    Poster:
      "https://m.media-amazon.com/images/M/MV5BZmU0M2Y1OGUtZjIxNi00ZjBkLTg1MjgtOWIyNThiZWIwYjRiXkEyXkFqcGdeQXVyMTQxNzMzNDI@._V1_SX300.jpg",
    runtime: 116,
    imdbRating: 8.5,
    userRating: 9,
  },
];

const average = (arr) =>
  arr.reduce((acc, cur, i, arr) => acc + cur / arr.length, 0);

export default function App() {
  // States:
  const [query, setQuery] = useState("");
  const [selectedId, setSelectedId] = useState(null);
  const [watched, setWatched] = useLocalStorage([], "watched"); // Custom hook
  const { movies, isLoading, error } = useMovies(query); // Custom hook

  // Functions:
  function removeFromWatched(id) {
    setWatched((watched) => watched.filter((movie) => movie.imdbID !== id));
  }

  // Return:
  return (
    <>
      <Nav>
        <Search query={query} setQuery={setQuery} />
        <NumResults movies={movies} />
      </Nav>
      <Main>
        {/* Movies Box */}
        <Box >
          {
            isLoading ? (
              <Loader />
            ) : error ? (
              <ErrorMessage message={error} />
            ) : !isLoading && movies.length > 0 && !error ? (
              <MovieList movies={movies} selectedId={selectedId} setSelectedId={setSelectedId} />
            ) : (
              <p className="loader">Start searching for a movie 🍿</p>
            )
          }
        </Box>
        {/* Watched Box */}
        <Box>
          {
            selectedId
              ? <MovieDetails
                selectedId={selectedId}
                setSelectedId={setSelectedId}
                watched={watched}
                setWatched={setWatched}
              />
              :
              <>
                <WatchedSummary watched={watched} />
                <WatchedList watched={watched} removeFromWatched={removeFromWatched} />
              </>
          }
        </Box>
      </Main>
    </>
  );
}

function Loader() {
  // Return:
  return (
    <div className="loader">
      <span className="loader-text">Loading...</span>
    </div>
  )
}

function ErrorMessage({ message }) {
  // Return:
  return (
    <p className="error">{message}</p>
  )
}

function Nav({ children }) {
  // Return:
  return (
    <nav className="nav-bar">
      <Logo />
      {children}
    </nav>
  )
}

function Logo() {
  return (
    <div className="logo">
      <span role="img">🍿</span>
      <h1>usePopcorn</h1>
    </div>
  )
}

function Search({ query, setQuery }) {
  const searchEl = useRef(null);

  useEffect(() => {
    const searchEl = document.querySelector('.search');
    searchEl.focus();
  }, [query]);

  return (
    <input
      className="search"
      type="text"
      placeholder="Search movies..."
      value={query}
      onChange={(e) => setQuery(e.target.value)}
      ref={searchEl}
    />
  )
}

function NumResults({ movies }) {
  return (
    <p className="num-results">
      Found <strong>{movies.length}</strong> results
    </p>
  )
}

function Main({ children }) {
  // Return:
  return (
    <main className="main">
      {children}
    </main>
  )
}

function Box({ children }) {
  // States:
  const [isOpen1, setIsOpen1] = useState(true);

  // Return:
  return (
    <div className="box">
      <button
        className="btn-toggle"
        onClick={() => setIsOpen1((open) => !open)}
      >
        {isOpen1 ? "–" : "+"}
      </button>
      {isOpen1 && children}
    </div>
  );
}

function MovieList({ movies, setSelectedId }) {
  // Return:
  return (
    <ul className="list list-movies">
      {movies?.map((movie) => (
        <Movie movie={movie} key={movie.imdbID} setSelectedId={setSelectedId} />
      ))}
    </ul>
  )
}

function Movie({ movie, setSelectedId }) {
  // Return:
  return (
    <li onClick={() => setSelectedId(movie.imdbID)}>
      <img src={movie.Poster} alt={`${movie.Title} poster`} />
      <h3>{movie.Title}</h3>
      <div>
        <p>
          <span>🗓</span>
          <span>{movie.Year}</span>
        </p>
      </div>
    </li>
  )
}

function MovieDetails({ selectedId, setSelectedId, watched, setWatched }) {
  // States:
  const [movie, setMovie] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [userRating, setUserRating] = useState(0);

  const ratingTimes = useRef(0);

  // Variables:
  const isWatched = watched.map((movie) => movie.imdbID).includes(selectedId);
  const watchedUserRating = watched.find((movie) => movie.imdbID === selectedId)?.userRating;

  // Functions:
  function handleAdd() {
    const newWatchedMovie = {
      imdbID: movie.imdbID,
      Title: movie.Title,
      Year: movie.Year,
      Poster: movie.Poster,
      runtime: movie.Runtime.split(" ").at(0),
      imdbRating: movie.imdbRating,
      userRating: userRating,
      ratingTimes: ratingTimes.current
    };
    setWatched((watched) => [...watched, newWatchedMovie]);
    setSelectedId(null);
  }

  // Effects:
  // Get movie details:
  useEffect(() => {
    async function getMovieDetails() {
      setIsLoading(true);
      const res = await fetch(`https://www.omdbapi.com/?apikey=dc6e5d49&i=${selectedId}&plot=full`);
      const data = await res.json();
      setMovie(data);
      setIsLoading(false);
    }
    getMovieDetails();
  }, [selectedId]);

  // Set document title:
  useEffect(() => {
    movie.Title && (document.title = `Movie | ${movie.Title}`);

    return function cleanup() {
      document.title = "usePopcorn";
    }
  }, [movie.Title]);

  // Listen to keydown events:
  useEffect(() => {
    function callback(e) {
      if (e.code === "Escape") {
        setSelectedId(null);
      }
    }
    document.addEventListener("keydown", callback);

    return function cleanup() {
      document.removeEventListener("keydown", callback);
    }
  }, [setSelectedId]);

  // Update rating times:
  useEffect(() => {
    if (userRating) ratingTimes.current++;
  }, [userRating]);

  // Return:
  return (
    <div className="details">
      {isLoading ? <Loader /> :
        <>
          <button className="btn-back" title="Go Back" onClick={() => setSelectedId(null)}>&larr;</button>
          <header>
            <img src={movie.Poster} alt={`${movie.Title} poster`} />
            <div className="details-overview">
              <h2>{movie.Title}</h2>
              <p>
                {movie.Released} &bull; {movie.Runtime}
              </p>
              <p>{movie.Genre}</p>
              <p>
                <span>⭐️</span>
                <span>Rated {movie.imdbRating} on IMDB</span>
              </p>
            </div>
          </header>
          <section>
            <div className="rating">
              {!isWatched ? (
                <>
                  <StarRating
                    length={10}
                    size={24}
                    getRating={setUserRating}
                  />
                  {userRating > 0 && (
                    <button className="btn-add" onClick={handleAdd}>
                      + Add to list
                    </button>
                  )}
                </>
              ) : (
                <p>
                  You rated this movie with {watchedUserRating} <span>⭐️</span>
                </p>
              )}
            </div>
            <p>
              <em>{movie.Plot}</em>
            </p>
            <p>Starring: {movie.Actors}</p>
            <p>Directed by: {movie.Director}</p>
          </section>
        </>
      }
    </div>
  )
}

function WatchedSummary({ watched }) {
  // Variables:
  const avgImdbRating = average(watched.map((movie) => movie.imdbRating));
  const avgUserRating = average(watched.map((movie) => movie.userRating));
  const avgRuntime = average(watched.map((movie) => movie.runtime));

  // Return:
  return (
    <div className="summary">
      <h2>Movies you watched</h2>
      <div>
        <p>
          <span>#️⃣</span>
          <span>{watched.length} movies</span>
        </p>
        <p>
          <span>⭐️</span>
          <span>{avgImdbRating.toFixed(2)}</span>
        </p>
        <p>
          <span>🌟</span>
          <span>{avgUserRating.toFixed(2)}</span>
        </p>
        <p>
          <span>⏳</span>
          <span>{avgRuntime} min</span>
        </p>
      </div>
    </div>
  )
}

function WatchedList({ watched, removeFromWatched }) {
  // Return:
  return (
    <ul className="list">
      {watched.map((movie) => <WatchedMovie movie={movie} key={movie.imdbID} removeFromWatched={removeFromWatched} />)}
    </ul>
  )
}

function WatchedMovie({ movie, removeFromWatched }) {
  // Return:
  return (
    <li>
      <img src={movie.Poster} alt={`${movie.Title} poster`} />
      <h3>{movie.Title}</h3>
      <div>
        <p>
          <span>⭐️</span>
          <span>{movie.imdbRating}</span>
        </p>
        <p>
          <span>🌟</span>
          <span>{movie.userRating}</span>
        </p>
        <p>
          <span>⏳</span>
          <span>{movie.runtime} min</span>
        </p>

        <button className="btn-delete"
          onClick={() => removeFromWatched(movie.imdbID)}
        >
          X
        </button>
      </div>
    </li>
  )
}