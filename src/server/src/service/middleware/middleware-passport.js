import passport from 'passport';
import { ExtractJwt, Strategy as JWTStrategy } from 'passport-jwt';
import jwt from 'jsonwebtoken';

export default function (app, userRepository, securityConfig) {
  passport.use(new JWTStrategy({
    secretOrKey: securityConfig.jwt.secret,
    issuer: securityConfig.jwt.issuer,
    audience: securityConfig.jwt.audience,
    jwtFromRequest: ExtractJwt.fromAuthHeaderWithScheme('JWT')
  }, async (token, done) => {
    try {
      const user = await userRepository.getById(token._id);
      if (user && (user.isActive === true)) {
        done(null, user);
      } else {
        done('User not active/registered', false);
      }
    } catch (err) {
      done(err, false);
    }
  }));
  app.use(passport.initialize());
}

export const getToken = (user) => {
  const payload = {
    _id: user._id,
    sub: user.userName,
    name: user.name,
    iss: 'user-identity',
    aud: 'dropBox-au'
  };
  const token = jwt.sign(payload, 'dropBox%#%#%');
  return token;
};