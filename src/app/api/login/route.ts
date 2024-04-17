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
        const { email, password } = reqBody;
        if (!email || !password) {
            return NextResponse.json({ msg: "Invalid credentials" }, { status: 400 })
        }
        const isUserExist = await User.findOne({ email });
        
        const isPasswordMatch = await bcrypt.compare(password, isUserExist.password)
        if (!isPasswordMatch) {
            return NextResponse.json({ msg: "Invalid Credentials" }, { status: 409 })
        }
        const name = isUserExist.name;
        const private_key: any = process.env.SECRET_KEY;
        const token = jwt.sign({ email, name }, private_key)
        const response = NextResponse.json({ msg: "User successfull login", success: true, token }, { status: 200 })
        response.cookies.set("token", token, {
            httpOnly: true
        })
        return response;
    } catch (error) {
        return new NextResponse('Error in storing the data: ' + error, { status: 500 });
    }
} 