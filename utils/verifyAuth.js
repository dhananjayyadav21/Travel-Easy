import { NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';

export function verifyAuth(req) {
    // Attempt to extract the token 
    const token = req.headers.get('Authorization')?.split(' ')[1];

    if (!token) {
        // If no token is present
        return {
            response: NextResponse.json({ message: 'Authentication required.' }, { status: 401 })
        };
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        return { userId: decoded.id };

    } catch (err) {
        // If JWT is invalid return an error response
        return {
            response: NextResponse.json({ message: 'Invalid or expired token.' }, { status: 401 })
        };
    }
}
