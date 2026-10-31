# usePopcorn

A movie search app. Search the OMDb database, open a movie to see its details, rate it from 1 to 10, and keep a watched list with summary stats that is saved in your browser.

**[Live Demo](https://usepopcorn-app-sepia.vercel.app/)**

## Table of Contents

1. [Features](#features)
2. [Tech Stack](#tech-stack)
3. [How It Works](#how-it-works)
4. [Project Structure](#project-structure)
5. [Getting Started (How to Use)](#getting-started-how-to-use)
6. [Build](#build)
7. [Deployment](#deployment)
8. [Contributions](#contributions)
9. [License & Author](#license--author)

## Features

- Search any movie by title. Results update as you type, with a loading indicator, a "Movie not found" message when nothing matches, and a live "Found N results" counter in the header.
- The search box is focused automatically when the app loads.
- Click a movie to open its details: poster, release date, runtime, genre, IMDb rating, full plot, cast, and director.
- Rate a movie from 1 to 10 with an interactive star rating. Hovering previews the rating, and the **+ Add to list** button appears once you pick a score.
- A movie that is already on your list shows the rating you gave it instead of the rating stars.
- Press `Esc` or click the back arrow to close the details panel.
- The browser tab title changes to the movie's name while its details are open, and goes back to "usePopcorn" when you close it.
- The watched list shows a summary of how many movies you watched, the average IMDb rating, your average rating, and the average runtime. Remove any movie with the **X** button.
- Your watched list is saved in `localStorage`, so it is still there after a refresh or a restart.
- Both panels can be collapsed with the toggle button in the corner.
- Responsive layout: the two panels sit side by side on desktop and stack on tablets and phones.

## Tech Stack

- React 18 (Create React App, `react-scripts` 5)
- JavaScript (ES6+)
- Hooks: `useState`, `useEffect`, `useRef`, plus two custom hooks
- A reusable, from-scratch `StarRating` component (inline SVG stars, no UI library)
- [OMDb API](https://www.omdbapi.com/) for movie data
- Plain CSS3 with custom properties and media queries
- Deployed on Vercel

## How It Works

**State lives in `App`.** The search `query`, the `selectedId` of the opened movie, and the `watched` list are kept in the top-level component and passed down as props. The layout components (`Nav`, `Main`, `Box`) take `children`, so `App` decides what goes inside each panel.

**`useMovies(query)` (custom hook).** Every time the query changes, an effect fetches `https://www.omdbapi.com/?s=<query>` and returns `{ movies, isLoading, error }`. Each effect run creates an `AbortController`, and its cleanup function aborts the previous request. Because of that, a slow response for an old query can never replace the results of a newer one, and the abort is not shown as an error. An empty query skips the fetch and clears the error.

**`useLocalStorage(initialValue, key)` (custom hook).** It works like `useState`, but the initial value is read from `localStorage` through a lazy initializer function (so it runs once, not on every render), and an effect writes the value back whenever it changes. `App` uses it for the watched list.

**Movie details.** `MovieDetails` fetches a single movie by its `imdbID` whenever `selectedId` changes. It has four effects:

- fetch the movie,
- set `document.title` and restore it in the cleanup function,
- add a `keydown` listener for `Esc` and remove it in the cleanup function,
- count how many times the user changed their rating, stored in a `useRef` so it does not cause a re-render.

**Star rating.** `StarRating` is a standalone component configured through props (`length`, `size`, `color`, `messages`, `defaultRating`) and reports the chosen value to its parent with a `getRating` callback. It keeps a separate temporary rating for the hover preview.

**Derived values.** Whether a movie is already watched, and the summary averages, are calculated from the `watched` array during render instead of being stored in state, so they cannot get out of sync.

**Data source.** Search uses `GET /?s=<title>` and the details panel uses `GET /?i=<imdbID>&plot=full` on the [OMDb API](https://www.omdbapi.com/).

## Project Structure

```
public/
  favicon.ico
  index.html
src/
  App.js                # App plus all UI components
  index.js              # entry point (React.StrictMode)
  index.css             # global styles and responsive rules
  StarRating.js         # reusable star rating component
  useMovies.js          # custom hook: search + loading + error
  useLocalStorage.js    # custom hook: state saved in localStorage
package.json
```

Components in `App.js`: `App`, `Nav`, `Logo`, `Search`, `NumResults`, `Main`, `Box`, `Loader`, `ErrorMessage`, `MovieList`, `Movie`, `MovieDetails`, `WatchedSummary`, `WatchedList`, `WatchedMovie`.

## Getting Started (How to Use)

You need Node.js 16 or newer.

```bash
git clone https://github.com/Ahmed-Abdlhameed/usePopcorn-App.git
cd usePopcorn-App
npm install
npm start
```

The app runs at [http://localhost:3000](http://localhost:3000).

Try searching for `inception`, click a result, give it a rating, and press **+ Add to list**. Refresh the page and the movie is still in your watched list.

The app ships with a demo OMDb key written directly in `useMovies.js` and `App.js`. To use your own, get a free key at [omdbapi.com/apikey.aspx](https://www.omdbapi.com/apikey.aspx) and replace the `apikey=` value in both fetch URLs.

## Build

```bash
npm run build
```

The output goes to the `build/` folder.

## Deployment

The app is deployed on Vercel, which redeploys automatically on every push to `main`.

Two things matter for the deployment:

- **Use `https` for the API.** The site is served over HTTPS, and browsers block `http://` requests from an HTTPS page (mixed content), so both OMDb requests use `https://www.omdbapi.com`.
- **Fix lint warnings before deploying.** Vercel sets `CI=true`, and Create React App then treats every ESLint warning (for example an unused variable) as a build error.

There is no client-side router, so no rewrite rules are needed.

## Contributions (Adding Your Own Features)

Feel free to fork the repository and contribute by adding more features or fixes. Pull requests are welcomed!

## License & Author

This repository is for personal documentation purposes. Feel free to use or distribute its content as you wish. Built by **Ahmed Abdelhameed**. Find me on [GitHub](https://github.com/Ahmed-Abdlhameed).