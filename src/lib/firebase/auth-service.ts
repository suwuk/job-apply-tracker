"use server"; 

import bcrypt from "bcrypt";
import { collection, addDoc, getDocs, query, where, serverTimestamp } from "firebase/firestore";
import { firestore } from "./service";

export async function register(data: any) {
    const q = query(collection(firestore, "users"), where("email", "==", data.email));
    const snapshot = await getDocs(q);

    if (!snapshot.empty) return { status: false, message: "Email already exists" };

    data.role = "member";
    data.type = "credentials";
    data.password = await bcrypt.hash(data.password, 10); 
    data.createdAt = serverTimestamp();
    data.updatedAt = serverTimestamp();

    try {
        await addDoc(collection(firestore, "users"), data);
        return { status: true, message: "Register Success" };
    } catch (error) {
        return { status: false, message: "Register Failed" };
    }
}