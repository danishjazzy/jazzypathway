const jwt = require('jsonwebtoken');
const db = require('./dbconn');

const auth = async (req, res, next) => {
    try {
        const token = req.cookies.loginCookies;
        console.log(token)
        const verify = jwt.verify(token, 'iamworkingonmyjazzypathwayproject')
        console.log(verify)
        try {
            const user = await db.findOne({_id: verify._id})
            req.token = token
            req.user = user
            // console.log(user.username);
        } catch (error) {
            console.log(error);
        }
        next();
    } catch (error) {
        res.status(401).send(error);
    }
}

module.exports = auth