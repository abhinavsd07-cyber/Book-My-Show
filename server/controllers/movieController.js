const Movie = require("../models/Movie");
const Show = require("../models/Show");

const filterMoviesByLocation = async (baseFilter, location) => {
  if (!location) {
    return await Movie.find(baseFilter).sort({ createdAt: -1 });
  }

  const shows = await Show.find({ isActive: true })
    .populate({
      path: "theatre",
      match: { location: { $regex: new RegExp(`^${location}$`, "i") } },
      select: "_id location"
    })
    .select("movie theatre");

  const validShows = shows.filter((s) => s.theatre !== null);
  const validMovieIds = [...new Set(validShows.map((s) => s.movie.toString()))];

  return await Movie.find({ ...baseFilter, _id: { $in: validMovieIds } }).sort({ createdAt: -1 });
};

// @GET /api/movies
const getAllMovies = async (req, res) => {
  try {
    const { genre, language, search, itemType, location } = req.query;
    let filter = { isActive: true };
    if (genre) filter.genre = { $in: [genre] };
    if (language) filter.language = language;
    if (search) filter.title = { $regex: search, $options: "i" };
    if (itemType) filter.itemType = itemType;

    let movies;
    if (location && itemType !== 'premiere') {
      movies = await filterMoviesByLocation(filter, location);
    } else {
      movies = await Movie.find(filter).sort({ createdAt: -1 });
    }

    res.json({ success: true, data: movies });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @GET /api/movies/now-showing
const getNowShowing = async (req, res) => {
  try {
    const { location } = req.query;
    const movies = await filterMoviesByLocation({ isNowShowing: true, isActive: true, itemType: "movie" }, location);
    res.json({ success: true, data: movies });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @GET /api/movies/upcoming
const getUpcoming = async (req, res) => {
  try {
    const movies = await Movie.find({ isUpcoming: true, isActive: true, itemType: "movie" }).sort({ releaseDate: 1 });
    res.json({ success: true, data: movies });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @GET /api/movies/premieres
const getPremieres = async (req, res) => {
  try {
    const movies = await Movie.find({ itemType: "premiere", isActive: true }).sort({ createdAt: -1 });
    res.json({ success: true, data: movies });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @GET /api/movies/events
const getEvents = async (req, res) => {
  try {
    const { location } = req.query;
    const movies = await filterMoviesByLocation({ itemType: "event", isActive: true }, location);
    res.json({ success: true, data: movies });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @GET /api/movies/:id
const getMovieById = async (req, res) => {
  try {
    const movie = await Movie.findById(req.params.id);
    if (!movie) return res.status(404).json({ success: false, message: "Movie not found" });
    res.json({ success: true, data: movie });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @POST /api/movies (admin)
const createMovie = async (req, res) => {
  try {
    const movie = await Movie.create(req.body);
    res.status(201).json({ success: true, message: "Movie created", data: movie });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @PUT /api/movies/:id (admin)
const updateMovie = async (req, res) => {
  try {
    const movie = await Movie.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!movie) return res.status(404).json({ success: false, message: "Movie not found" });
    res.json({ success: true, message: "Movie updated", data: movie });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @DELETE /api/movies/:id (admin)
const deleteMovie = async (req, res) => {
  try {
    await Movie.findByIdAndUpdate(req.params.id, { isActive: false });
    res.json({ success: true, message: "Movie deleted" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
// @GET /api/movies/:id/recommendations
const getMovieRecommendations = async (req, res) => {
  try {
    const movie = await Movie.findById(req.params.id);
    if (!movie) return res.status(404).json({ success: false, message: "Movie not found" });

    // Find movies with matching genre OR language, excluding the current one
    const recommendations = await Movie.find({
      _id: { $ne: movie._id },
      isActive: true,
      $or: [
        { genre: { $in: movie.genre } },
        { language: { $in: movie.language } }
      ]
    }).limit(5).sort({ createdAt: -1 });

    res.json({ success: true, data: recommendations });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = { getAllMovies, getNowShowing, getUpcoming, getPremieres, getEvents, getMovieById, getMovieRecommendations, createMovie, updateMovie, deleteMovie };
