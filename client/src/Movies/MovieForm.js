import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams, useHistory } from "react-router-dom";

export default function MovieForm({ triggerUpdate }) {
  const [movie, setMovie] = useState(null);
  const params = useParams();
  const history = useHistory();

  const cancelEditing = () => {
    history.push(`/movies/${params.id}`);
  };

  const fetchMovie = () => {
    axios
      .get(`http://localhost:5000/api/movies/${params.id}`)
      .then(res => setMovie(res.data))
      .catch(err => console.log(err.response));
  };

  useEffect(() => {
    fetchMovie();
  }, []);

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
  const updateStar = idx => ({ target: { value } }) => {
    setMovie({
      ...movie,
      stars: movie.stars.map((x, i) => (i !== idx ? x : value)),
    });
  };
  const deleteStar = idx => () => {
    setMovie({
      ...movie,
      stars: movie.stars.filter((x, i) => idx !== i),
    });
  };

  const addStar = () => {
    setMovie({
      ...movie,
      stars: movie.stars.concat([""]),
    });
  };

  const handleSubmit = e => {
    e.preventDefault();
    axios
      .put(`http://localhost:5000/api/movies/${params.id}`, movie)
      .then(() => {
        triggerUpdate();
        cancelEditing();
      })
      .catch(console.error);
  };
  const handleReset = e => {
    e.preventDefault();
    fetchMovie();
  };

  if (!movie) {
    return <div>Loading movie information...</div>;
  }

  return (
    <div className="save-wrapper">
      <form
        className="movie-card movie-edit-form"
        onSubmit={handleSubmit}
        onReset={handleReset}
      >
        <h2>{`Editing ${movie.title}`}</h2>
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
        <button type="button" className="button form-button" onClick={addStar}>
          Add Star
        </button>
        {movie.stars.map((star, idx) => (
          <label key={idx} className="star-entry">
            <input
              name={`star #${idx}`}
              onChange={updateStar(idx)}
              value={star}
            ></input>
            <button type="button" className="button" onClick={deleteStar(idx)}>
              Delete
            </button>
          </label>
        ))}
        <div className="form-buttons">
          <input className="button" type="submit" />
          <input className="button" type="reset" />
        </div>
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
