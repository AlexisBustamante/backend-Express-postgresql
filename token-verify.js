const jwt= require('jsonwebtoken');
const secret='myCat';

function verifyToken(token,secret) {
    return jwt.sign(token,secret);
}

const payload = verifyToken(token,secret);
console.log(payload);