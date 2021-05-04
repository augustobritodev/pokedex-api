import dotenv from 'dotenv-safe';
import express, { Request, Response, NextFunction } from 'express';
import session from 'express-session';
import mongoose, { Error, NativeError, Document } from 'mongoose';
import passport from 'passport';
import passportLocal, { IVerifyOptions } from 'passport-local';
import { compare } from 'bcrypt';
import User, { IUser } from '@src/models/User';
import PasswordService from '@src/services/password.service';

const LocalStrarategy = passportLocal.Strategy;

dotenv.config();

const app = express();

mongoose.connect(
  'mongodb+srv://augustobrito:@AB91mongo,.;@pokedex-cluster-0.hlivn.mongodb.net/pokedex-db?retryWrites=true&w=majority',
  {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  }
);

app.use(
  session({
    secret: 'secret',
    resave: false,
    saveUninitialized: true,
  })
);

app.use(express.urlencoded({ extended: false }));

app.use(express.json());

app.use(passport.initialize());
app.use(passport.session());

passport.serializeUser<any, any>((req, user, done) => {
  done(undefined, user);
});

passport.deserializeUser((id, done) => {
  User.findById(id, (err: Error, user: IUser) => {
    done(err, user);
  });
});

passport.use(
  new LocalStrarategy({ usernameField: 'email' }, (email, password, done) => {
    User.findOne({ email: email.toLowerCase() }, (err: NativeError, user: IUser) => {
      if (err) {
        return done(err);
      }
      if (!user) {
        return done(undefined, false, { message: `Email: ${email} não encontrado.` });
      }

      // TODO: Move compare function to a password service
      compare(password, user.password, (error: Error, match: boolean) => {
        if (match) {
          console.log(user);
          return done(undefined, user);
        }
        return done(undefined, false, { message: 'Senha incorreta' });
      });
    });
  })
);

app.post('/auth/register', async (req: Request, res: Response) => {
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
});

app.post('/auth/login', (req: Request, res: Response, next: NextFunction) => {
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
});

app.listen(3333);
