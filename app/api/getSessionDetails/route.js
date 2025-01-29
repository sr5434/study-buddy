import { NextResponse } from "next/server";
import { doc, getDoc } from "firebase/firestore";
import {v4 as uuid} from 'uuid';
import { db } from "../../firebase";

export async function POST(req) {
    const reqJSON = await req.json();
    const id = reqJSON.id;
    const sessionsRef = doc(db, "sessions", id);
    const snapshot = await getDoc(sessionsRef, reqJSON);
    return NextResponse.json(snapshot.data());
}