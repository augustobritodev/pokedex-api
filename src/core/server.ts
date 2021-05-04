import express from 'express';
import dotenv from 'dotenv-safe';
import cors from 'cors';
import session from 'express-session';
import mongoose, { Error, NativeError } from 'mongoose';
import passport from 'passport';
import passportLocal from 'passport-local';
import { compare } from 'bcrypt';
import { API, SERVER } from '@src/config/env';
import Logger from '@src/config/logger';
import morganConfig from '@src/config/morgan';
import User, { IUser } from '@src/models/User';
import authRoutes from '@src/routes/auth.route';
import pokemonRoutes from '@src/routes/pokemon.route';

const LocalStrarategy = passportLocal.Strategy;

dotenv.config();

const app = express();

app.use(cors());
app.use(morganConfig);

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

app.use(API.prefix, authRoutes());
app.use(API.prefix, pokemonRoutes());

app
  .listen(SERVER.port, SERVER.hostname, () => {
    Logger.info(`Server listening on ${SERVER.hostname}:${SERVER.port}`);
  })
  .on('error', err => {
    Logger.error(err.message, err);
    process.exit(1);
  });
