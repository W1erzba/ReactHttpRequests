import React, { useState, useEffect, useCallback } from 'react';

import MoviesList from './components/MoviesList';
import AddMovie from './components/AddMovie';
import './App.css';

function App() {
	const [movies, setMovies] = useState([]);
	const [isLoading, setIsLoading] = useState(false);
	const [error, setError] = useState(null);

	const fetchMoviesHandler = useCallback(async () => {
		setIsLoading(true);
		setError(null);
		try {
			const response = await fetch(
				'https://react-http-4b003-default-rtdb.europe-west1.firebasedatabase.app/movies.json'
			);
			if (!response.ok) {
				throw new Error('Something went wrong! πΆβπ«οΈ');
			}

			const data = await response.json();

			const loadedMovies = [];

			for (const key in data) {
				loadedMovies.push({
					id: key,
					title: data[key].title,
					openingText: data[key].openingText,
					releaseDate: data[key].releaseDate,
				});
			}

			setMovies(loadedMovies);
		} catch (error) {
			setError(error.message);
		}
		setIsLoading(false);
	}, []);

	useEffect(() => {
		fetchMoviesHandler();
	}, [fetchMoviesHandler]);

	async function addMovieHandler(movie) {
		const response = await fetch(
			'https://react-http-4b003-default-rtdb.europe-west1.firebasedatabase.app/movies.json',
			{
				method: 'POST',
				// method that change get request on a post to send data
				body: JSON.stringify(movie),
				// JSON.stringyfy() change js obiect to a json format
				headers: {
					'Content-Type': 'application/json',
				},
			}
		);
		const data = await response.json();
		console.log(data);
	}

	let content = <p>Found no movies π΅</p>;

	if (movies.length > 0) {
		content = <MoviesList movies={movies} />;
	}

	if (error) {
		content = <p>{error}</p>;
	}

	if (isLoading) {
		content = <p>Loading... β</p>;
	}

	return (
		<React.Fragment>
			<section>
				<AddMovie onAddMovie={addMovieHandler} />
			</section>
			<section>
				<button onClick={fetchMoviesHandler}>Fetch Movies</button>
			</section>
			<section>{content}</section>
		</React.Fragment>
	);
}

export default App;
