const asyncHandler = require("express-async-handler");
const Review = require("../models/Review");
const Movie = require("../models/Movie");

// @desc    Get all reviews for a specific movie
// @route   GET /api/reviews/movie/:movieId
// @access  Public
const getMovieReviews = asyncHandler(async (req, res) => {
  const reviews = await Review.find({ movie: req.params.movieId })
    .populate("user", "name email avatar")
    .sort("-createdAt");
  
  res.status(200).json({ success: true, count: reviews.length, data: reviews });
});

// @desc    Create a new review
// @route   POST /api/reviews
// @access  Private
const createReview = asyncHandler(async (req, res) => {
  const { movie: movieId, rating, comment } = req.body;

  if (!movieId || !rating || !comment) {
    res.status(400);
    throw new Error("Please provide movie ID, rating, and comment");
  }

  // Check if user already reviewed this movie
  const alreadyReviewed = await Review.findOne({
    user: req.user._id,
    movie: movieId,
  });

  if (alreadyReviewed) {
    res.status(400);
    throw new Error("You have already reviewed this movie");
  }

  const review = await Review.create({
    user: req.user._id,
    movie: movieId,
    rating: Number(rating),
    comment,
  });

  // Calculate new average rating for the movie
  const reviews = await Review.find({ movie: movieId });
  const numReviews = reviews.length;
  const avgRating = reviews.reduce((acc, item) => item.rating + acc, 0) / numReviews;

  await Movie.findByIdAndUpdate(movieId, {
    rating: avgRating
  });

  res.status(201).json({ success: true, data: review });
});

// @desc    Like or Dislike a review
// @route   PUT /api/reviews/:id/vote
// @access  Private
const voteReview = asyncHandler(async (req, res) => {
  const { type } = req.body; // 'like' or 'dislike'
  const reviewId = req.params.id;
  const userId = req.user._id;

  const review = await Review.findById(reviewId);
  if (!review) {
    res.status(404);
    throw new Error("Review not found");
  }

  const hasLiked = review.likedBy.includes(userId);
  const hasDisliked = review.dislikedBy.includes(userId);

  if (type === "like") {
    if (hasLiked) {
      // Remove like
      review.likedBy.pull(userId);
      review.likes -= 1;
    } else {
      // Add like
      review.likedBy.push(userId);
      review.likes += 1;
      if (hasDisliked) {
        review.dislikedBy.pull(userId);
        review.dislikes -= 1;
      }
    }
  } else if (type === "dislike") {
    if (hasDisliked) {
      // Remove dislike
      review.dislikedBy.pull(userId);
      review.dislikes -= 1;
    } else {
      // Add dislike
      review.dislikedBy.push(userId);
      review.dislikes += 1;
      if (hasLiked) {
        review.likedBy.pull(userId);
        review.likes -= 1;
      }
    }
  }

  await review.save();
  res.status(200).json({ success: true, data: review });
});

module.exports = {
  getMovieReviews,
  createReview,
  voteReview,
};
