const { User } = require('../models/User');
 
let auth = (req, res, next) => {
    // 인증 처리를 하는 곳 

    // 클라이언트에서 쿠키에서 토큰을 가져온다.
    let token = req.cookies.x_auth; //넣을때 넣었던 x_auth에서 가져옴

    // 토큰을 복호화한 후 유저를 찾는다. userId
    User.findByToken(token, (err, user) => {
        if(err) throw err;
        if(!user) return res.json({ isAuth: false, error:true })

        req.token = token;
        req.user = user;
        next(); //next없으면 이 middleware에 갇힘
    })

    // 유저가 있으면 okay

    // 유저가 없으면 no
}

module.exports = { auth };