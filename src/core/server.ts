import dotenv from 'dotenv-safe';
import express, { Request, Response, NextFunction } from 'express';
import session from 'express-session';
import mongoose, { Error, NativeError, Document } from 'mongoose';
import passport from 'passport';
import passportLocal, { IVerifyOptions } from 'passport-local';
import { compare } from 'bcrypt';
import User, { IUser } from '@src/models/User';

const LocalStrarategy = passportLocal.Strategy;

dotenv.config();

const app = express();

mongoose.connect(
  'mongodb+srv://augustobrito:@AB91mongo,.;@pokedex-cluster-0.hlivn.mongodb.net/myFirstDatabase?retryWrites=true&w=majority',
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
          return done(undefined, user);
        }
        return done(undefined, false, { message: 'Senha incorreta' });
      });
      return done(undefined, false, { message: 'Senha ou Email inválido' });
    });
  })
);

app.get('/', (req, res) => {
  res.json({ message: 'Home' });
});

app.post('/register', (req: Request, res: Response) => {
  res.json({ message: 'Register' });
});

app.post('/login', (req: Request, res: Response, next: NextFunction) => {
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
      res.status(200).json({ message: 'Logged in' });
    });
  })(req, res, next);
});

app.listen(3333);
