import bcrypt from "bcrypt";
import {
	addDoc,
	collection,
	doc,
	getDoc,
	getDocs,
	getFirestore,
	limit,
	query,
	updateDoc,
	where,
} from "firebase/firestore";
import app from "./init";

const firestore = getFirestore(app);

export async function retrieveData(collectionName: string) {
	const snapshot = await getDocs(collection(firestore, collectionName));
	const data = snapshot.docs.map((doc) => ({
		id: doc.id,
		...doc.data(),
	}));

	return data;
}

export async function retrieveDataByID(collectionName: string, id: string) {
	const snapshot = await getDoc(doc(firestore, collectionName, id));
	const data = snapshot.data();
	return data;
}

export async function register(data: {
	fullname: string;
	email: string;
	password: string;
	role?: string;
}) {
	const q = query(
		collection(firestore, "users"),
		where("email", "==", data.email),
	);
	const snapshot = await getDocs(q);
	const users = snapshot.docs.map((doc) => ({
		id: doc.id,
		...doc.data(),
	}));

	if (users.length > 0) {
		return { status: false, statusCode: 400, message: "Email already exists" };
	} else {
		data.role = "member";
		data.password = await bcrypt.hash(data.password, 10);
		try {
			await addDoc(collection(firestore, "users"), data);
			return { status: true, statusCode: 200, message: "Register Success" };
		} catch {
			return { status: false, statusCode: 400, message: "Register Failed" };
		}
	}
}

export async function getUserByEmail(email: string) {
	const q = query(
		collection(firestore, "users"),
		where("email", "==", email),
		limit(1),
	);
	const snapshot = await getDocs(q);

	if (snapshot.empty) {
		return null;
	}

	const userDoc = snapshot.docs[0];
	return {
		id: userDoc.id,
		...userDoc.data(),
	};
}

export async function loginWithGoogle(data: any, callback: any) {
	const q = query(
		collection(firestore, "users"),
		where("email", "==", data.email),
	);

	const snapshot = await getDocs(q);
	const user: any = snapshot.docs.map((doc) => ({
		id: doc.id,
		...doc.data(),
	}));

	if (user.length > 0) {
		data.role = user[0].role;
		await updateDoc(doc(firestore, "users", user[0].id), data).then(() => {
			callback({ status: true, data });
		});
	} else {
		data.role = "member";
		await addDoc(collection(firestore, "users"), data).then(() => {
			callback({ status: true, data });
		});
	}
}
