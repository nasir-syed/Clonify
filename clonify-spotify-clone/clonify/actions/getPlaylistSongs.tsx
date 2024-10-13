import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";
import { Song } from "@/types"; // Import your Song type if you have it defined

const getPlaylistSongs = async (id: string): Promise<Song[]> => {
    const supabase = createServerComponentClient({
        cookies: cookies
    });

    if (!id) {
        return [];
    }

    // Fetch song IDs from the playlist
    const { data: playlistData, error: playlistError } = await supabase
        .from("playlist_songs")
        .select("song_id")
        .eq("playlist_id", id);

    if (playlistError) {
        console.log("Error fetching playlist songs:", playlistError);
        return [];
    }

    // Extract song IDs from the response
    const songIds = playlistData?.map((item: { song_id: string }) => item.song_id) || [];

    if (songIds.length === 0) {
        return []; // Return empty if no song IDs found
    }

    // Fetch songs from the songs table using the retrieved song IDs
    const { data: songsData, error: songsError } = await supabase
        .from("songs")
        .select("*")
        .in("id", songIds); // Assuming `id` is the primary key in the songs table

    if (songsError) {
        console.log("Error fetching songs:", songsError);
        return [];
    }

    return songsData as Song[]; // Return the fetched songs
};

export default getPlaylistSongs;
