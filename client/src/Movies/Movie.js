import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams, useHistory } from "react-router-dom";
import MovieCard from "./MovieCard";

function Movie({ addToSavedList }) {
  const [movie, setMovie] = useState(null);
  const params = useParams();
  const history = useHistory();

  useEffect(() => {
    (function fetchMovie() {
      axios
        .get(`http://localhost:5000/api/movies/${params.id}`)
        .then(res => setMovie(res.data))
        .catch(err => console.log(err.response));
    })();
  }, [params.id]);

  const saveMovie = () => {
    addToSavedList(movie);
  };

  const editMovie = () => {
    history.push(`/update-movie/${params.id}`);
  };

  if (!movie) {
    return <div>Loading movie information...</div>;
  }

  return (
    <div className="save-wrapper">
      <MovieCard movie={movie} />
      <div className="button save-button" onClick={saveMovie}>
        Save to list
      </div>

      <div className="button edit-button" onClick={editMovie}>
        Edit
      </div>
    </div>
  );
}

export default Movie;
