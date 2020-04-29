import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams, useHistory } from "react-router-dom";

export default function MovieForm({ triggerUpdate }) {
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

  const cancelEditing = () => {
    history.push(`/movies/${params.id}`);
  };

  const deleteMovie = () => {
    axios
      .delete(`http://localhost:5000/api/movies/${params.id}`)
      //.then(console.log)
      .then(() => triggerUpdate())
      .then(() => history.push("/"))
      .catch(console.error);
  };

  const handleChange = ({ target: { name, value } }) => {
    setMovie({
      ...movie,
      [name]: value,
    });
  };
  const updateStar = idx => (e) => {
      e.preventDefault();
    setMovie({
      ...movie,
      stars: movie.stars.map((x, i) => (i !== idx ? x : e.target.value)),
    });
  };
  const deleteStar = ({target:{value}}) => {
    console.log({
      ...movie,
      stars: movie.stars.filter(x => x !== value),
    });
    //debugger;
  };
  if (!movie) {
    return <div>Loading movie information...</div>;
  }

  return (
    <div className="save-wrapper">
      <form className="movie-card movie-edit-form">
        <h2>Editing movie info</h2>
        <label>
          Title:
          <input
            onChange={handleChange}
            name="title"
            value={movie.title}
          ></input>
        </label>
        <label>
          Director:
          <input
            onChange={handleChange}
            name="director"
            value={movie.director}
          ></input>
        </label>
        <label>
          Metascore:
          <input
            onChange={handleChange}
            name="metascore"
            value={movie.metascore}
          ></input>
        </label>
        <h3>Stars:</h3>
        {movie.stars.map((star, idx) => (
          <label key={idx}>
            <input
              name={`star #${idx}`}
              onChange={updateStar(idx)}
              value={star}
            ></input>
            <button onClick={deleteStar}>Delete</button>
          </label>
        ))}
      </form>
      <div className="button delete-button" onClick={deleteMovie}>
        Delete Item
      </div>

      <div className="button edit-button" onClick={cancelEditing}>
        Cancel Editing
      </div>
    </div>
  );
}
