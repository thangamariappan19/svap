import { Router } from 'express';
import pool from '../config/db.js';
import { verifyToken } from '../middleware/auth.middleware.js';

const router = Router();

// GET /api/applications
router.get('/', verifyToken, async (req, res) => {
    try {
        const result = await pool.query(
            'SELECT * FROM applications WHERE user_id = $1 ORDER BY created_at DESC',
            [req.user.id]
        );
        res.json({ success: true, data: result.rows, total: result.rows.length });
    } catch (error) {
        console.error('Fetch applications error:', error);
        res.status(500).json({ success: false, error: 'Internal server error' });
    }
});

// POST /api/applications
router.post('/', verifyToken, async (req, res) => {
    const { country_id, visa_type_id, notes } = req.body;
    if (!country_id || !visa_type_id) {
        return res.status(400).json({ success: false, error: 'Country and visa type required' });
    }

    try {
        const result = await pool.query(
            'INSERT INTO applications (user_id, country_id, visa_type_id, notes, status) VALUES ($1, $2, $3, $4, $5) RETURNING *',
            [req.user.id, country_id, visa_type_id, notes, 'draft']
        );
        res.status(201).json({ success: true, data: result.rows[0] });
    } catch (error) {
        console.error('Create application error:', error);
        res.status(500).json({ success: false, error: 'Internal server error' });
    }
});

// PATCH /api/applications/:id/status
router.patch('/:id/status', verifyToken, async (req, res) => {
    const { status } = req.body;
    const allowedStatuses = ['draft', 'documents_gathering', 'submitted', 'under_review', 'additional_docs_required', 'approved', 'rejected', 'passport_dispatched'];

    if (!allowedStatuses.includes(status)) {
        return res.status(400).json({ success: false, error: 'Invalid status' });
    }

    try {
        const result = await pool.query(
            'UPDATE applications SET status = $1, updated_at = NOW() WHERE id = $2 AND user_id = $3 RETURNING *',
            [status, req.params.id, req.user.id]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({ success: false, error: 'Application not found or unauthorized' });
        }

        res.json({ success: true, data: result.rows[0] });
    } catch (error) {
        console.error('Update status error:', error);
        res.status(500).json({ success: false, error: 'Internal server error' });
    }
});

// DELETE /api/applications/:id
router.delete('/:id', verifyToken, async (req, res) => {
    try {
        const result = await pool.query(
            'DELETE FROM applications WHERE id = $1 AND user_id = $2 RETURNING id',
            [req.params.id, req.user.id]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({ success: false, error: 'Application not found or unauthorized' });
        }

        res.json({ success: true, message: 'Application deleted' });
    } catch (error) {
        console.error('Delete application error:', error);
        res.status(500).json({ success: false, error: 'Internal server error' });
    }
});

export default router;

