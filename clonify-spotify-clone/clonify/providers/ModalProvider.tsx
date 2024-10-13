"use client";

import AuthModal from "@/components/AuthModal";
import UploadModal from "@/components/UploadModal";
import PlaylistModal from "@/components/PlaylistModal";

import { useEffect, useState } from "react";
import AddToPlaylistModal from "@/components/AddToPlaylistModal";
import { Song } from "@/types";

interface ModalProviderProps {
    songs: Song[]
}

const ModalProvider: React.FC<ModalProviderProps> = ({songs}) => {
    
    const [isMounted, setIsMounted] = useState(false)

    // server-side rendering is taking place, and so to 
    // prevent hydration errors the isMounted variable is used to
    // render the modal

    useEffect(()=> {
        setIsMounted(true);
    }, []);

    if(!isMounted){
        return null;
    }
    
    return(
        <>
            <AuthModal/>
            <UploadModal/>
            <PlaylistModal/>
            <AddToPlaylistModal Songs={songs}/>
        </>
    )
}

export default ModalProvider;
