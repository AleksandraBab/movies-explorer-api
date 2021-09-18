const Movie = require('../models/movies');
const NotFoundError = require('../errors/not-found');
const ValidationError = require('../errors/validation-error');
const {
  ERROR_MESSAGE_INVALID,
  ERROR_MESSAGE_ITEMNOTFOUND,
  ERROR_MESSAGE_403,
  ERROR_CODE_403,
} = require('../utils/constans');

module.exports.getMovies = (req, res, next) => {
  const userId = req.user._id;
  Movie.find({ owner: userId })
    .then((movies) => res.status(200).send(movies))
    .catch(next);
};

module.exports.createMovie = (req, res, next) => {
  const {
    country,
    director,
    duration,
    year,
    description,
    image,
    trailer,
    thumbnail,
    movieId,
    nameRU,
    nameEN,
  } = req.body;

  Movie.create({
    country,
    director,
    duration,
    year,
    description,
    image,
    trailer,
    thumbnail,
    movieId,
    nameRU,
    nameEN,
    owner: req.user._id,
  })
    .then((movie) => res.status(201).send(movie))
    .catch((err) => {
      if (err.name === 'CastError' || err.name === 'ValidationError') {
        next(new ValidationError(ERROR_MESSAGE_INVALID));
      }
      next();
    });
};

const checkMovieOwner = (req, res, next) => {
  const { movieId } = req.params;

  const promise = new Promise((resolve) => {
    Movie.findById(movieId)
      .orFail(() => {
        next(new NotFoundError(ERROR_MESSAGE_ITEMNOTFOUND));
      })
      .then((movie) => resolve(movie))
      .catch((err) => {
        if (err.name === 'CastError') {
          next(new ValidationError(ERROR_MESSAGE_INVALID));
        }
        next();
      });
  });
  return promise;
};

module.exports.deleteMovie = (req, res, next) => {
  const userId = req.user._id;
  const { movieId } = req.params;

  checkMovieOwner(req, res, next)
    .then((movie) => {
      if (movie.owner._id.toString() === userId) {
        return Movie.findByIdAndRemove(movieId)
          .then(() => res.send({ message: 'Фильм удалён' }))
          .catch((err) => {
            if (err.name === 'CastError') {
              next(new ValidationError(ERROR_MESSAGE_INVALID));
            }
            next();
          });
      }
      const err = new Error(ERROR_MESSAGE_403);
      err.statusCode = ERROR_CODE_403;
      return next(err);
    })
    .catch(() => {
      next();
    });
};
