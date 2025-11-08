import passport from 'passport';
import { Strategy as JwtStrategy, ExtractJwt, StrategyOptions } from 'passport-jwt';
import { Strategy as LocalStrategy } from 'passport-local';
import User from '../modules/admin/models/User';
import { config } from '../config';
import { JWTPayload } from '../types';

const jwtOptions: StrategyOptions = {
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
  secretOrKey: config.jwt.secret,
};

passport.use(
  new JwtStrategy(jwtOptions, async (payload: JWTPayload, done) => {
    try {
      const user = await User.findById(payload.sub).select('-password');
      if (!user) {
        return done(null, false);
      }
      return done(null, {
        id: (user as any)._id.toString(),
        email: user.email,
        role: user.role,
      });
    } catch (error) {
      return done(error, false);
    }
  })
);

passport.use(
  new LocalStrategy(
    {
      usernameField: 'email',
      passwordField: 'password',
    },
    async (email, password, done) => {
      try {
        const user = await User.findOne({ email }).select('+password');
        if (!user) {
          return done(null, false, { message: 'Invalid credentials' });
        }

        const isMatch = await user.comparePassword(password);
        if (!isMatch) {
          return done(null, false, { message: 'Invalid credentials' });
        }

        return done(null, {
          id: (user as any)._id.toString(),
          email: user.email,
          role: user.role,
        });
      } catch (error) {
        return done(error, false);
      }
    }
  )
);

export default passport;

