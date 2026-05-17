const express = require('express');
const router = express.Router();
const JobRequest = require('../models/JobRequest');
const { protect } = require('../middleware/auth');

// Helper - 404 error
const notFound = (res) =>
  res.status(404).json({ success: false, error: 'Job not found' });

// GET /api/jobs - list all, optional ?category= and ?status= filters
router.get('/', async (req, res, next) => {
  try {
    const filter = {};
    if (req.query.category) filter.category = req.query.category;
    if (req.query.status) filter.status = req.query.status;

    // Bonus: keyword search across title and description
    if (req.query.search) {
      filter.$or = [
        { title: { $regex: req.query.search, $options: 'i' } },
        { description: { $regex: req.query.search, $options: 'i' } },
      ];
    }

    const jobs = await JobRequest.find(filter).sort({ createdAt: -1 });
    res.json({ success: true, count: jobs.length, data: jobs });
  } catch (err) {
    next(err);
  }
});

// GET /api/jobs/:id - single job
router.get('/:id', async (req, res, next) => {
  try {
    const job = await JobRequest.findById(req.params.id);
    if (!job) return notFound(res);
    res.json({ success: true, data: job });
  } catch (err) {
    next(err);
  }
});

// POST /api/jobs - create job (protected)
router.post('/', protect, async (req, res, next) => {
  try {
    const { title, description, category, location, contactName, contactEmail } =
      req.body;

    if (!title || !description) {
      return res
        .status(400)
        .json({ success: false, error: 'Title and description are required' });
    }

    const job = await JobRequest.create({
      title,
      description,
      category,
      location,
      contactName,
      contactEmail,
    });

    res.status(201).json({ success: true, data: job });
  } catch (err) {
    next(err);
  }
});

// PATCH /api/jobs/:id - update status only
router.patch('/:id', async (req, res, next) => {
  try {
    const { status } = req.body;
    const validStatuses = ['Open', 'In Progress', 'Closed'];

    if (!status || !validStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        error: `Status must be one of: ${validStatuses.join(', ')}`,
      });
    }

    const job = await JobRequest.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true, runValidators: true }
    );

    if (!job) return notFound(res);
    res.json({ success: true, data: job });
  } catch (err) {
    next(err);
  }
});

// DELETE /api/jobs/:id - delete job (protected)
router.delete('/:id', protect, async (req, res, next) => {
  try {
    const job = await JobRequest.findByIdAndDelete(req.params.id);
    if (!job) return notFound(res);
    res.json({ success: true, message: 'Job deleted successfully' });
  } catch (err) {
    next(err);
  }
});

module.exports = router;