import { create } from "zustand";

interface LoginModalStore {
	isOpen: boolean;
	onOpen: () => void;
	onClose: () => void;
}

export const useLoginModal = create<LoginModalStore>((set) => ({
	isOpen: false, 
	onOpen: () => set({ isOpen: true }), // Fungsi buka
	onClose: () => set({ isOpen: false }), // Fungsi tutup
}));
