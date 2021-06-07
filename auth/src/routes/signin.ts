import { BadRequestError, validateRequest } from '@sprockets/common';
import express, { Request, Response } from 'express';
import { body } from 'express-validator';
import jwt from 'jsonwebtoken';
import { User } from '../models/user';
import { Password } from '../services/password';

const router = express.Router();

router.post(
  '/api/users/signin',
  [
    body('email').isEmail().withMessage('email must be valid'),
    body('password')
      .trim()
      .isLength({ min: 4, max: 20 })
      .withMessage('please provide a password'),
  ],
  validateRequest,
  async (req: Request, res: Response) => {
    const { email, password } = req.body;

    const existingUser = await User.findOne({ email });
    if (!existingUser) {
      throw new BadRequestError('Invalid credentials!');
    }

    const passwordsMatch = await Password.compare(
      existingUser.password.toString(),
      password
    );
    if (!passwordsMatch) {
      throw new BadRequestError('Invalid credentials!');
    }

    const token = jwt.sign(
      { id: existingUser.id, email: existingUser.email },
      process.env.JWT_KEY!
    );
    req.session = { jwt: token };

    res.status(200).send(existingUser);
  }
);

export { router as signinRouter };
