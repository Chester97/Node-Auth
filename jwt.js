const { Strategy, ExtractJwt } = require('passport-jwt');
const User = require("./models/User");

const JwtStrategy = new Strategy(
    {
        jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
        secretOrKey: 'user',
    },
    (jwtPayload, done) => {
        const { login } = jwtPayload;
        User.findOne({login})
            .then(user => {
                if(user == null) {
                    done('User not found');
                    return
                }
                done(null,user);
            })
            .catch(error => console.log(error));
    }
);

module.exports = { JwtStrategy };