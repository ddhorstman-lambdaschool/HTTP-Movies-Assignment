import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams, useHistory } from "react-router-dom";
import MovieCard from "./MovieCard";

function Movie({ addToSavedList, triggerUpdate }) {
  const [movie, setMovie] = useState(null);
  const [editing, setEditing] = useState(false);
  const params = useParams();
  const history = useHistory();

  const toggleEditMode = () => {
    setEditing(!editing);
  };

  const fetchMovie = () => {
    axios
      .get(`http://localhost:5000/api/movies/${params.id}`)
      .then(res => setMovie(res.data))
      .catch(err => console.log(err.response));
  };

  const saveMovie = () => {
    addToSavedList(movie);
  };

  const deleteMovie = () => {
    axios
      .delete(`http://localhost:5000/api/movies/${params.id}`)
      .then(console.log)
      .then(() => triggerUpdate())
      .then(() => history.push("/"))
      .catch(console.error);
  };
  useEffect(() => {
    fetchMovie();
  }, [params.id]);

  if (!movie) {
    return <div>Loading movie information...</div>;
  }

  return (
    <div className="save-wrapper">
      <MovieCard movie={movie} />
      {!editing ? (
        <div className="button save-button" onClick={saveMovie}>
          Save
        </div>
      ) : (
        <div className="button delete-button" onClick={deleteMovie}>
          Delete
        </div>
      )}
      <div className="button edit-button" onClick={toggleEditMode}>
        {editing ? "Cancel" : "Edit"}
      </div>
    </div>
  );
}

export default Movie;
