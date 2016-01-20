import { Router } from 'express';
import { User, Passport } from 'models';

const router = Router();

router
  .route('/users')
  .get(async (req, res, next) => {
    try {
      const users = await User.find();
      return res.send(users);
    } catch (error) {
      return next(error);
    }
  })
  .post(async (req, res, next) => {
    let user;
    let passport;
    try {
      const { email, username, nickname, password } = req.body;
      user = await User.create({
        username,
        email,
        nickname,
      });
      passport = await Passport.create({
        user,
        password,
      });
      user.passports.push(passport);
      await user.save();
      return res.send(user);
    } catch (error) {
      if (user) {
        user.remove();
      }
      if (passport) {
        passport.remove();
      }
      return next(error);
    }
  });

router
  .route('/users/:userId')
  .get(async (req, res, next) => {
    try {
      const { userId } = req.params;
      const user = await User.findById(userId);
      if (!user) {
        throw Error('No user found');
      }
      return res.send(user);
    } catch (error) {
      return next(error);
    }
  });

export default router;
