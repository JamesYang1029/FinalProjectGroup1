// middleware/auth.js
export function ensureAuthenticated(req, res, next) {
    if (req.session?.user) return next();
    res.redirect("/login");
  }