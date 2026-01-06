"use server";

import bcrypt from "bcrypt";
import {
  collection,
  addDoc,
  getDocs,
  query,
  where,
  serverTimestamp,
  FieldValue,
} from "firebase/firestore";
import { firestore } from "./service";

interface RegisterDTO {
  fullname: string;
  email: string;
  password: string;
}

interface UserDocument extends RegisterDTO {
  role: string;
  type: string;
  createdAt: FieldValue;
  updatedAt: FieldValue;
}

export async function register(data: RegisterDTO) {
  try {
    const q = query(
      collection(firestore, "users"),
      where("email", "==", data.email)
    );
    const snapshot = await getDocs(q);

    if (!snapshot.empty) {
      return { status: false, message: "Email already exists" };
    }

    const hashedPassword = await bcrypt.hash(data.password, 10);

    const newUser: UserDocument = {
      ...data,
      password: hashedPassword,
      role: "member",
      type: "credentials",
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    };

    await addDoc(collection(firestore, "users"), newUser);

    return { status: true, message: "Register Success" };
  } catch (error) {
    console.error("Register Error:", error);
    return { status: false, message: "Register Failed" };
  }
}
