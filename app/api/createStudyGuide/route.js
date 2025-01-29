import { NextResponse } from "next/server";
import { setDoc, doc } from "firebase/firestore";
import {v4 as uuid} from 'uuid';
import { db } from "../../firebase";

export async function POST(req) {
    const reqJSON = await req.json();
    const id = uuid();
    const sessionsRef = doc(db, "sessions", id);
    setDoc(sessionsRef, reqJSON);
    return NextResponse.json({ link: `/dashboard/${id}` });
}