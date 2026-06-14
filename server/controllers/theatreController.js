const Theatre = require("../models/Theatre");

// @GET /api/theatres
const getAllTheatres = async (req, res) => {
  try {
    const theatres = await Theatre.find({ isActive: true }).sort({ name: 1 });
    res.json({ success: true, data: theatres });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @GET /api/theatres/:id
const getTheatreById = async (req, res) => {
  try {
    const theatre = await Theatre.findById(req.params.id);
    if (!theatre) return res.status(404).json({ success: false, message: "Theatre not found" });
    res.json({ success: true, data: theatre });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @POST /api/theatres (admin)
const createTheatre = async (req, res) => {
  try {
    const theatre = await Theatre.create(req.body);
    res.status(201).json({ success: true, message: "Theatre created", data: theatre });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @PUT /api/theatres/:id (admin)
const updateTheatre = async (req, res) => {
  try {
    const theatre = await Theatre.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!theatre) return res.status(404).json({ success: false, message: "Theatre not found" });
    res.json({ success: true, message: "Theatre updated", data: theatre });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @DELETE /api/theatres/:id (admin)
const deleteTheatre = async (req, res) => {
  try {
    await Theatre.findByIdAndUpdate(req.params.id, { isActive: false });
    res.json({ success: true, message: "Theatre deleted" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = { getAllTheatres, getTheatreById, createTheatre, updateTheatre, deleteTheatre };
