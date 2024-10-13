import { Playlist } from "@/types";
import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";

const getPlaylistByID = async (id: string): Promise<Playlist | null> => {
    const supabase = createServerComponentClient({
        cookies: cookies,
    });

    const { data, error } = await supabase
        .from('playlists')
        .select('*')
        .eq('id', id)
        .single();  

    if (error) {
        console.log(error);
        return null;
    }

    return data as Playlist;
};

export default getPlaylistByID;
