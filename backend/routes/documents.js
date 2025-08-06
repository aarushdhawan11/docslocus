const express = require('express');
const auth = require('../middleware/authMiddleware');
const { createDoc, getDocs, updateDoc, revertVersion } = require('../controllers/documentController');
const router = express.Router();
router.post('/', auth, createDoc);
router.get('/', auth, getDocs);
router.put('/:docId', auth, updateDoc);
router.post('/revert', auth, revertVersion);
module.exports = router;
