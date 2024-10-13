import { Song, Playlist } from "@/types";
import { useSupabaseClient } from "@supabase/auth-helpers-react";

// The hook will now accept either a Song or a Playlist item.
const useLoadImage = (item: Song | Playlist) => {
    const supabaseClient = useSupabaseClient();

    // If no item is provided, return null.
    if (!item) {
        return null;
    }

    // Extract the public URL for the image from Supabase storage.
    const { data: imageData } = supabaseClient.storage.from('images').getPublicUrl(item.image_path);

    // Return the public URL for the image.
    return imageData?.publicUrl || null;
};

export default useLoadImage;
