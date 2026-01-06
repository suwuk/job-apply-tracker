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
  serverTimestamp,
  deleteDoc,
} from "firebase/firestore";
import app from "./init";
import { CreateApplicationDTO } from "@/types/applications";
import {
  FirestoreApplicationPayload,
  ApplicationStage,
} from "@/types/applications";
import { DbUser, GoogleLoginInput } from "@/types/user";

export const firestore = getFirestore(app);

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

export async function getUserByEmail(email: string) {
  const q = query(
    collection(firestore, "users"),
    where("email", "==", email),
    limit(1)
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

export async function loginWithGoogle(
  data: GoogleLoginInput,
  callback: (result: { status: boolean; data: DbUser }) => void
) {
  const q = query(
    collection(firestore, "users"),
    where("email", "==", data.email)
  );
  const snapshot = await getDocs(q);

  if (!snapshot.empty) {
    const userDoc = snapshot.docs[0];
    const userData = userDoc.data() as DbUser;

    const updateData = {
      fullname: data.fullname,
      email: data.email,
      image: data.image,
      type: data.type,
      role: userData.role,
      updatedAt: serverTimestamp(),
    };

    await updateDoc(doc(firestore, "users", userDoc.id), updateData);

    // Callback mengirim data ke JWT, NextAuth akan lanjut handle redirect
    callback({
      status: true,
      data: {
        ...userData,
        ...data,
        id: userDoc.id,
        role: userData.role,
      } as DbUser,
    });
  } else {
    const newUser = {
      fullname: data.fullname || "",
      email: data.email || "",
      image: data.image || null,
      type: data.type,
      role: "member",
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    };

    const docRef = await addDoc(collection(firestore, "users"), newUser);

    callback({
      status: true,
      data: { id: docRef.id, ...newUser } as DbUser,
    });
  }
}

export async function createApplication(data: CreateApplicationDTO) {
  try {
    const applicationData = {
      ...data,

      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),

      stages: data.stages.map((stage: ApplicationStage) => ({
        ...stage,
        createdAt: stage.createdAt || new Date().toISOString(),
      })),
    };

    const docRef = await addDoc(
      collection(firestore, "applications"),
      applicationData
    );
    return { id: docRef.id, ...applicationData };
  } catch (error) {
    console.error("Error adding application: ", error);
    throw new Error("Failed to add application");
  }
}

export async function getApplicationsByUserId(userId: string) {
  try {
    const colRef = collection(firestore, "applications");

    const q = query(colRef, where("userId", "==", userId));
    const snapshot = await getDocs(q);

    const hasil = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));

    return hasil;
  } catch (error) {
    console.error("Error fetching data:", error);
    return [];
  }
}

export async function patchApplication(
  id: string,
  data: Partial<FirestoreApplicationPayload>
) {
  try {
    const docRef = doc(firestore, "applications", id);
    const updateData = {
      ...data,
      updatedAt: serverTimestamp(),
    };

    await updateDoc(docRef, updateData);
    return { id, ...updateData };
  } catch (error) {
    console.error("Error patching application: ", error);
    throw new Error("Gagal memperbarui data");
  }
}

export async function deleteApplication(id: string) {
  try {
    const docRef = doc(firestore, "applications", id);
    await deleteDoc(docRef);

    console.log("Data berhasil dihapus!");
  } catch (error) {
    console.error("Gagal menghapus data:", error);
  }
}
