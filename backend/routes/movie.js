const express = require('express');
const router = express.Router();

const {
    createMovie,
    getAllMovies,
    getMovie,
    updateMovie,
    deleteMovie,
    createMovieReview,
    deleteMovieReview,
    getMovieTitles

} = require('../controllers/movieController');

router.route('/movies/create').post(createMovie);
router.route('/movies').get(getAllMovies);
router.route('/movies/:id').get(getMovie);
router.route('/movies/:id').put(updateMovie);
router.route('/movies/:id').delete(deleteMovie);
router.route('/review').put(createMovieReview);
router.route('/review/delete').put(deleteMovieReview);
router.route('/movies/all/titles').get(getMovieTitles);

module.exports = router
    
