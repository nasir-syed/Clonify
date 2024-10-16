"use client";

import { usePathname } from "next/navigation";
import { useMemo } from "react";
import { BiSearch } from "react-icons/bi";
import { HiHome} from "react-icons/hi";
import Box from "./Box";
import SidebarItem from "./SidebarItem";
import Library from "./Library";
import { Playlist, Song } from "@/types";
import usePlayer from "@/hooks/usePlayer";
import { twMerge } from "tailwind-merge";
import PlaylistLibrary from "./PlaylistLibrary";

interface SidebarProps {
    children: React.ReactNode;
    songs: Song[]
    playlists: Playlist[]
}

const Sidebar: React.FC<SidebarProps> = ({
    children,
    songs,
    playlists
}) => {

    const pathname = usePathname()
    const player = usePlayer();

    const routes = useMemo(() => [
        {
            icon: HiHome,
            label: "Home",
            active: pathname !== '/search',
            href: '/'
        },
        {
            icon: BiSearch,
            label: 'Search',
            active: pathname === "/search",
            href: '/search'
        }
    ], [pathname])
    return (
        <div className={twMerge(`flex h-full`, player.activeId && "h-[calc(100%-80px)]")}>
            <div className="hidden md:flex flex-col gap-y-2 bg-black h-full w-[300px] p-2">
                <Box>
                    <div className="flex flex-col px-5 py-4">
                        {routes.map((item) => (
                            <SidebarItem 
                            key = {item.label}
                            {...item}
                            />
                        ))}
                    </div>
                </Box>
                <Box className="overflow-y-auto h-1/2">
                    <Library songs={songs}/>
                </Box>
                <Box className="overflow-y-auto h-1/2">
                    <PlaylistLibrary playlists={playlists}/>
                </Box>
            </div>
            <main className="h-full flex-1 overflow-y-auto py-2">
                {children}
            </main>
        </div>
    )
}

export default Sidebar

