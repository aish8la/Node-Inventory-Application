function errorMiddleware(err, req, res, next) {
    if (!err.statusCode) {
        console.error(err);
        err.statusCode = 500;
        err.message = 'Oops! Something went wrong on our end';
    }
    res.status(err.statusCode).send(err.message);
}

module.exports = errorMiddleware;