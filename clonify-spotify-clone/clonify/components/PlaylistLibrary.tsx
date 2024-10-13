"use client";

import useAuthModal from "@/hooks/useAuthModal";
import usePlaylistModal from "@/hooks/usePlaylistModal";
import { useUser } from "@/hooks/useUser";
import { Playlist } from "@/types";
import { AiOutlinePlus } from "react-icons/ai";
import { TbPlaylist } from "react-icons/tb";
import MediaItem from "./MediaItem";
import useLoadImage from "@/hooks/useLoadImage";
import Image from "next/image";

interface PlaylistLibraryProps { 
    playlists: Playlist[]
}

const PlaylistLibrary: React.FC<PlaylistLibraryProps> = ({playlists}) => {

    const authModal = useAuthModal();
    const playlistModal = usePlaylistModal();

    const {user} = useUser();

    const onClick = () => {
        if (!user) {
            return authModal.onOpen();
        }
    
        playlistModal.onOpen();
        console.log(playlistModal.isOpen);  // Check if the modal's state changes
        return
    };
    
    return(
        <div className="flex flex-col">
            <div className="flex items-center justify-between px-5 pt-4">
                <div className="inline-flex items-center gap-x-2">
                    <TbPlaylist size={26} className="text-neutral-500"/>
                    <p className="text-neutral font-medium text-md">Your Playlist Library</p>
                </div>
                <AiOutlinePlus onClick={onClick} size={20} className="text-neutral-400 cursor-pointer hover:text-white transition"/>
            </div>
            <div className="flex flex-col gap-y-2 mt-4 px-5">
            {playlists.map((item) => {
                const imageUrl = useLoadImage(item); 

                return (
                    <div key={item.id} className="flex items-center gap-x-2 cursor-pointer hover:bg-neutral-800/50 w-full p-2 rounded-md">
                        <div className="relative rounded-md min-h-[48px] min-w-[48px] overflow-hidden">
                            <Image fill src={imageUrl || '/images/liked.jpg'} alt="Media Item" className="object-cover"/>
                        </div>
                        <div className="flex flex-col overflow-hidden">
                            <p className="text-white truncate">
                                {item.title}
                            </p>
                        </div>
                    </div>
                );
            })}
            </div>
        </div>
    )
}

export default PlaylistLibrary