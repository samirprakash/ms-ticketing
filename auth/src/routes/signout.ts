import express from 'express';

const router = express.Router();

router.post('/api/users/signout', (req, res) => {
  res.send('Signing Out');
});

export { router as signoutRouter };
