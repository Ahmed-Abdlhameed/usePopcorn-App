import { useState, useEffect } from "react";

export function useMovies(query) {
    // States:
    const [movies, setMovies] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState("");

    // Fetch movies:
    useEffect(
        function () {
            const controller = new AbortController();
            async function fetchMovies() {
                try {
                    // Reset states every new search:
                    setIsLoading(true); // To display the loader until the movies are fetched.
                    setMovies([]); // To clear the previous movies length.
                    setError(""); // To clear the 'Movie not found 😥' error message.

                    const res = await fetch(`https://www.omdbapi.com/?apikey=dc6e5d49&s=${query}`
                        , { signal: controller.signal }
                    );
                    const data = await res.json();
                    console.log(data)

                    // Check if the user lost internet connection:
                    if (!res.ok) throw new Error("Something went wrong with fetching movies 😥");

                    // Check if the movie was not found:
                    if (data.Response === "False") throw new Error("Movie not found 😥");

                    // Set movies:
                    setMovies(data.Search);
                } catch (err) {
                    err.name !== "AbortError" && setError(err.message);
                } finally {
                    // To hide the loader after either the movies are fetched or an error occurs.
                    setIsLoading(false);
                }
            }

            // Check if the query is empty or not to reset the 'Movie not found 😥' error message:
            query ? fetchMovies() : setError("");

            // Cleanup function:
            return function cleanup() {
                controller.abort();
            };

        }, [query] // Every time the query changes the useEffect will run.
    );

    return { movies, isLoading, error } // You can use an array normally.
}