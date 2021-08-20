const router = require('express').Router();
const { celebrate } = require('celebrate');
const {
  getMovies, createMovie, deleteMovie,
} = require('../controllers/movies');
const { moviePost, movieDelete } = require('../utils/validation');

router.get('/movies', getMovies);
router.post('/movies', celebrate(moviePost), createMovie);
router.delete('/movies/:movieId', celebrate(movieDelete), deleteMovie);

module.exports = router;
