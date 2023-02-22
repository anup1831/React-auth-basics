import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken';
import { v4 as uuid } from 'uuid';
import { getDbConnection } from "../db";
import { sendEmail } from '../util/sendEmail';


export const signUpRoute ={
    path: '/api/signup',
    method: 'post',
    handler: async (req, res) => {
        const { email, password } = req.body;

        const db = getDbConnection('react-auth-db');
        const user = await db.collection('users').findOne( { email } );

        if (user){
            res.sendStatus(409);
        }

        const passwordHash = await bcrypt.hash(password, 10);

        ///maybe required to block below code
        const verificationString = uuid();

        const startingInfo = {
            hairColor: '',
            favoriteFood: '',
            bio: '',
        };

        //maybe required to block below code verificationString
        const result = await db.collection('users').insertOne({
            email,
            passwordHash,
            info:startingInfo,
            isVerified: false,
            verificationString,
        });

        const { insertedId } = result;
        //maybe required to block below code
        try{
            await sendEmail({
                to: email,
                from: 'anupkumar4u@gmail.com',
                subject: 'Please verify your email',
                text: `
                    Thanks for singing up! To verify your email click here:
                    http://localhost:3000/verify-email/${verificationString}
                `,
            });
        } catch (e) {
            console.log(e);
            res.sendStatus(500);
        }

        jwt.sign({
            id: insertedId,
            email,
            info: insertedId,
            isVerified: false,
        },
        process.env.JWT_SECRET,
        {
            expiresIn: '2d',
        },
        (err, token) => {
            if(err) {
                return res.status(500).send(err);
            }
            res.status(200).json({ token });
        });
    }
}