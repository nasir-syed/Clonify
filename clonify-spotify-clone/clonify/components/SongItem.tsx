"use client";

import useLoadImage from "@/hooks/useLoadImage";
import { Song } from "@/types";
import Image from "next/image";
import PlayButton from "./PlayButton";

interface SongItemProps {
    data: Song,
    onClick: (id: string) => void;

}


const SongItem: React.FC<SongItemProps> = ({data, onClick}) => {
    
    const imagePath = useLoadImage(data);

    return ( 
        <div onClick={() => onClick(data.id)} className="relative group flex flex-col items-center justify-center rounded-md overflow-hidden gap-x-4 cursor-pointer transition p-3">
            <div className="relative aspect-square w-full h-full rounded-md overflow-hidden">
                {imagePath && (
                    <Image className="object-cover" src={imagePath} fill alt="song cover" />
                )}
            </div>
            <div className="flex flex-col items-start w-full pt-4 gap-y-1">
                <p className="font-semibold truncate w-full">
                    {data.title}
                </p>
                <p className="text-neutral-400 text-sm pb-4 w-full truncate">
                    {data.artist}
                </p>
            </div>
            <div className="absolute top-12 left-50">
                <PlayButton/>
            </div>
            
        </div>
     );
}
 
export default SongItem;