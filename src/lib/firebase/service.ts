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
  DocumentData,
  serverTimestamp,
  orderBy,
  deleteDoc,
} from "firebase/firestore";
import app from "./init";
import { CreateApplicationDTO } from "@/types/applications";

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

export async function loginWithGoogle(data: any, callback: any) {
  const q = query(
    collection(firestore, "users"),
    where("email", "==", data.email)
  );
  const snapshot = await getDocs(q);

  if (!snapshot.empty) {
    const userDoc = snapshot.docs[0];
    const userData = userDoc.data();

    // Update data profil terbaru dari Google
    const updateData = {
      ...data,
      role: userData.role,
      updatedAt: serverTimestamp(),
    };
    await updateDoc(doc(firestore, "users", userDoc.id), updateData);

    callback({ status: true, data: { id: userDoc.id, ...updateData } });
  } else {
    // Jika user baru, buat dokumen baru
    data.role = "member";
    data.createdAt = serverTimestamp();
    data.updatedAt = serverTimestamp();

    const docRef = await addDoc(collection(firestore, "users"), data);
    callback({ status: true, data: { id: docRef.id, ...data } });
  }
}

export async function createApplication(data: CreateApplicationDTO) {
  try {
    const applicationData = {
      ...data,

      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),

      stages: data.stages.map((stage: any) => ({
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

export async function deleteApplication(id: string) {
  try {
    const docRef = doc(firestore, "applications", id);
    await deleteDoc(docRef);

    console.log("Data berhasil dihapus!");
  } catch (error) {
    console.error("Gagal menghapus data:", error);
  }
}
