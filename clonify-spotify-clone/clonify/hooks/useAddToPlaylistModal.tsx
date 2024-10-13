import {create} from "zustand";

interface AddToPlaylistModalStore {
    isOpen: boolean;
    onOpen: () => void;
    onClose: () => void;
}

const useAddToPlaylistModal = create<AddToPlaylistModalStore>((set) => ({
    isOpen: false,
    onOpen: () => set({isOpen: true}),
    onClose: () => set({isOpen: false})
}))

export default useAddToPlaylistModal;