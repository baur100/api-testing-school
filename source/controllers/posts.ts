/** source/controllers/routes.ts */
import { Request, Response, NextFunction } from 'express';
import {KJUR} from 'jsrsasign';
import users from '../users';
import {devPrivateKey,devPublicKey} from '../routes/keys_dev'
import {qaPrivateKey,qaPublicKey} from '../routes/keys_qa'

interface TokenBody {
    iat: number,
    sub: number,
    exp: number,
    iss: string
}

const createToken = (opts:TokenBody, env:string) => {
    const header = {
        alg: 'RS256',
        typ: 'JWT',
    };
    const sHeader = JSON.stringify(header);
    const sData = JSON.stringify(opts);
    const privateKey = env === 'qa' ? qaPrivateKey : devPrivateKey;

    return KJUR.jws.JWS.sign(header.alg, sHeader, sData, privateKey);
};

const checkToken = (token: string, env:string) => {
    const publicKey = env === 'qa' ? qaPublicKey : devPublicKey;
    return KJUR.jws.JWS.verify(token, publicKey, ["RS256"]);
}

const hashCredentials= (username: string, password: string) => {
    const str = username.concat(password);
    let hash = 0;
    for(let i=0; i<str.length;i+=1){
        const char = str.charCodeAt(i);
        hash = ((hash<<5)-hash)+char;
        hash = hash & hash; // Convert to 32bit integer
    }
    return hash;
}
const generateToken = async (req: Request, res: Response) => {
    const username = req.body.username;
    const password = req.body.password;
    const env = req.url.split('/')[1];
    const hash = hashCredentials(username,password);
    const user = users.find((u:any)=>u.hash===hash)
    if(user===undefined) {
        return res.status(401).json({message: 'This combination of user and password does not exist'});
    }
    const {userId, role} = user;
    const time = Math.round(Date.now()/1000);
    const expTime = time+60*60;

    const tokenBody = {
        iat: time,
        sub: userId,
        exp: expTime,
        role,
        iss: 'api-testing-school'
    }
    const token = createToken(tokenBody, env);
    checkToken(token,env)
    return res.status(200).json({token});
}
const validateToken = async (req: Request, res: Response) => {
    const [,env] = req.url.split('/');
    let token = req.header('Authorization')
    if(token===undefined) {
        return res.status(400).json({message: 'Proper Authorization header does not provided'});
    }
    [,token] = token.split(' ');

    let isValid;
    try{
        isValid = checkToken(token,env);
    } catch (error) {
        return res.status(400).json({message: 'Can\'t read token'});
    }

    if(isValid){
        const tokenBody: object | undefined = KJUR.jws.JWS.parse(token).payloadObj;
        // @ts-ignore
        const { sub, role , exp } = tokenBody;
        const time = Math.round(Date.now()/1000);
        // @ts-ignore
        if(time >= exp) {
            return res.status(400).json({message: 'Token has been expired'});
        }
        return res.status(200).json({sub, role});
    }
    return res.status(403).json({message: 'Invalid signature'})
}

export default { generateToken, validateToken };
