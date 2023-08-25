import express from 'express';

const router = express.Router();

router.post('/create-admin');

router.post('/login');
router.get('//my-profile');
router.patch('/my-profile');

export const AdminRoutes = router;
