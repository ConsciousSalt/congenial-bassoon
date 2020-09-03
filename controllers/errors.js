exports.getPageNotFound = (req, res, next) => {
  res
    .status(404)
    .render("404", {
      pageTitle: "Page not Found!",
      path: "/404",
      isAuthenticated: req.session.isLoggedIn,
    });
};
