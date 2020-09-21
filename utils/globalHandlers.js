exports.errorHandler = (err, next) => {
    console.log('error', err);
    const error = new Error(err);
    error.httpStatusCode = 500;
    return next(error); 
};