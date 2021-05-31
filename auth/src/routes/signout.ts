import express from 'express';

const router = express.Router();

router.get('/api/users/signout', (req, res) => {
  res.send('Signing Out');
});

export { router as signoutRouter };
