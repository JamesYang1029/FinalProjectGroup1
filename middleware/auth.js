// middleware/auth.js
export function ensureAuthenticated(req, res, next) {
    if (req.session?.user) return next();
    res.redirect("/login");
  }
  //  only allow users with role === 'admin'
export function ensureAdmin(req, res, next) {
  if (req.session.user?.role === 'admin') return next();
  return res.status(403).render('error', { error: 'Access denied' });
}