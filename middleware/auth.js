const password = process.env.APP_PASSWORD || '';

function auth(req, res, next) {
    const authorized = ({ currentProtectStatus, inputProtectStatus, inputPassword} ) => {
        if (currentProtectStatus || inputProtectStatus) {
            return inputPassword === password;
        } 
        return true;
    }
    req.authorized = authorized;
    next();
}

module.exports = {
    auth,
};