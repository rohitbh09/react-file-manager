import passport from 'passport';

export function authenticated () {
  let result = passport.authenticate('jwt', { session: false });
  return result;
}