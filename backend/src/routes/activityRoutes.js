const express = require('express');
const { getActivity, getHeatmap } = require('../controllers/activityController');
const { protect } = require('../middleware/authMiddleware');

const router = express.Router();

// Every route below requires a valid session — no anonymous activity access.
router.use(protect);

// NOTE: /heatmap must be declared before any /:id-style route if one is
// ever added, so it isn't swallowed as an id param. There isn't one yet,
// but keeping the specific route first avoids that trap later.
router.get('/heatmap', getHeatmap);
router.get('/', getActivity);

module.exports = router;
