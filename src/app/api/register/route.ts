import connetToDb from '@/utils/db';
import User from '@/models/user'
import { NextResponse } from 'next/server';
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken"

export const POST = async (req: any, res: any) => {
    try {
        await connetToDb();
        const reqBody = await req.json();
        console.log(reqBody);
        const { username, email, password } = reqBody;
        if (!username || !email || !password) {
            return NextResponse.json({ msg: "Invalid fields" }, { status: 400 })
        }
        const isUserExist = await User.findOne({ email });
        if (isUserExist) {
            return NextResponse.json({ msg: "User is already present" }, { status: 409 })
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const user = new User({ username, email, password: hashedPassword });
        const userData = await user.save();
        const private_key: any = process.env.SECRET_KEY;
        console.log(userData.id)
        const token = jwt.sign({ username, email }, private_key);
        const response = NextResponse.json({ mgs: "ok", success: true, token }, { status: 200 })
        response.cookies.set("token", token, {
            httpOnly: true
        });
        return response;
    } catch (error) {
        return new NextResponse('Error in storing the data: ' + error, { status: 500 });
    }
} 