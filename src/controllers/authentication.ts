import express from 'express'
import { createUser, getUserByEmail } from '../db/users';
import { random, authentication } from '../helpers';

export const login = async (req: express.Request, res: express.Response) => {
    try {
        const {email, password} = req.body
        if (!email || !password) {
            console.log("Empty email or password fields")
            res.sendStatus(400)
            return
        }
        const user = await getUserByEmail(email).select('+authentication.salt +authentication.password');
        if (!user) {
            console.log("User not found")
            return res.sendStatus(404)
        }
        const expectedHash = authentication(user.authentication.salt, password)
        if (user.authentication.password !== expectedHash) {
            console.log("Invalid password")
            return res.sendStatus(404)
        }
        const salt = random()
        user.authentication.sessionToken = authentication(salt, user._id.toString())

        await user.save()

        res.cookie('HANZALAH-AUTH', user.authentication.sessionToken, {domain: 'localhost', path: '/'})
        return res.status(200).json(user).end;

    }
    catch(err){
        console.log(err)
        res.sendStatus(400)
    }

}

export const register = async (req: express.Request, res: express.Response) => {
    try {
        const {email, password, username} = req.body;
        if (!email || !password || !username) {
            res.sendStatus(400);
            console.log("Missing fields")
            return
        }
        const existingUser = await getUserByEmail(email)
        if (existingUser){
            console.log(existingUser)
            res.sendStatus(400);
            console.log("User exists")
            return
        }
        const salt = random();
        const user = await createUser({
            username,
            email,
            authentication: {
                salt,
                password: authentication(salt, password)
            }
        })
        res.status(200).json(user).end()
    }
    catch(err) {
        console.log(err)
        res.sendStatus(400)
    }
}