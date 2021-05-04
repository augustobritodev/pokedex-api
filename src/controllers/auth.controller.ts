import { Response, Request, NextFunction } from 'express';
import passport from 'passport';
import { IVerifyOptions } from 'passport-local';
import PasswordService from '@src/services/password.service';
import User, { IUser } from '@src/models/User';

export default class AuthController {
  register = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { name, surname, email, password }: IUser = req.body;

      // TODO: Add validation with JOI
      if (!name || !surname || !email || !password) {
        return res.json({ message: 'Todos os campos precisam serem preenchidos!' });
      }

      User.findOne({ email }, async (err: Error, user: IUser) => {
        if (err) return res.json(err);
        if (user) return res.json({ message: 'Email já cadastrado!' });

        const hash = await PasswordService.genHash(password);
        const newUser = new User({
          name,
          surname,
          email,
          password: hash,
        });

        await newUser.save();
        return res.status(200).json({ message: 'Usuário criado com sucesso' });
      });
    } catch (error) {
      next(error);
    }
  };

  login = async (req: Request, res: Response, next: NextFunction) => {
    try {
      passport.authenticate('local', (err: Error, user: IUser, info: IVerifyOptions) => {
        if (err) {
          return next(err);
        }

        if (!user) {
          return res.status(401).json(info);
        }

        req.logIn(user, error => {
          if (error) {
            return next(err);
          }
          return res.status(200).json({ message: 'Logged in' });
        });
      })(req, res, next);
    } catch (error) {
      next(error);
    }
  };
}
