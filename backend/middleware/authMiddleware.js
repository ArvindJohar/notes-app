exports.isAuth = (req, res, next) => {
    if (!req.session.user) {
        return res.status(401).send("Not logged in");
    }
    next();
};

exports.isAdmin = (req, res, next) => {
    if (req.session.user.role !== "admin") {
        return res.status(403).send("Admins only");
    }
    next();
};