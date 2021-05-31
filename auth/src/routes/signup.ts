import express from 'express';

const router = express.Router();

router.get('/api/users/signup', (req, res) => {
  res.send('Signing Up');
});

export { router as signupRouter };
