// Cookie-based authentication needs CSRF protection for state-changing requests.
// Browsers send the Origin header on these requests, so we reject unexpected
// browser origins while allowing normal GET/HEAD/OPTIONS requests.
const csrfOriginGuard = (req, res, next) => {
  if (['GET', 'HEAD', 'OPTIONS'].includes(req.method)) return next();

  const expectedOrigin = process.env.CLIENT_URL;
  const requestOrigin = req.headers.origin;

  if (!expectedOrigin || !requestOrigin) return next();

  if (requestOrigin !== expectedOrigin) {
    return res.status(403).json({
      success: false,
      message: 'Request origin is not allowed',
    });
  }

  next();
};

module.exports = { csrfOriginGuard };
