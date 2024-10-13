"use client";

import Button from "@/components/Button";
import LikeButton from "@/components/LikeButton";
import MediaItem from "@/components/MediaItem";
import useAddToPlaylistModal from "@/hooks/useAddToPlaylistModal";
import useLoadImage from "@/hooks/useLoadImage";
import useOnPlay from "@/hooks/useOnPlay";
import { useUser } from "@/hooks/useUser";
import { Playlist, Song } from "@/types";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { AiOutlinePlus } from "react-icons/ai";


interface PlaylistContentProps {
    
    playlist: Playlist
    songs: Song[]
}

const PlaylistContent: React.FC<PlaylistContentProps> = ({playlist, songs}) => {
    
    const router = useRouter()
    const {isLoading, user} = useUser();
    const AddToPlaylistModal = useAddToPlaylistModal()
    const onPlay = useOnPlay(songs);

    useEffect(()=>{
        if(!isLoading && !user){
            router.replace('/')
        }
    },[isLoading, user, router]);

    const onClick = () => {
        AddToPlaylistModal.onOpen();
        console.log(AddToPlaylistModal.isOpen);  // Check if the modal's state changes
        return
    };

    return ( 
        <div className="mt-20">
                <div className="flex flex-col md:flex-row items-center gap-x-5">
                    <div className="relative h-32 w-32 lg:h-44 lg:w-44">
                        <Image fill className="object-cover" src={useLoadImage(playlist) || "/images/liked.jpg"} alt="Playlist"/>
                    </div>
                    <div className="flex flex-col gap-y-2 mt-4 md:mt-0">
                        <p className="hidden md:block font-semibold text-sm">
                            Playlist
                        </p>
                        <h1 className="text-white text-4xl sm:text-5xl lg:text-7xl font-bold">
                            {playlist.title}
                        </h1>
                        <Button className="bg-purple-500 px-6 py-2 w-1/2" onClick={onClick}>
                                Add Songs
                        </Button>
                    </div>
                </div>


                <div className="flex flex-col gap-y-2 w-full py-4 px-0">
                    {songs.map((song) => (
                        <div key={song.id} className="flex items-center gap-x-4 w-full">
                            <div className="flex-1">
                                <MediaItem onClick={(id: string)=>{onPlay(id)}} data={song}/>
                            </div>
                            <LikeButton songID={song.id}/>
                        </div>
                    ))}
                </div>        
        </div>
    );
}
 
export default PlaylistContent;