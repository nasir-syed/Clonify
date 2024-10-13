import { Playlist } from "@/types";
import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";

const getPlaylistsByUserID = async (): Promise<Playlist[]> => {
  const supabase = createServerComponentClient({
    cookies: cookies,
  });

  // Fetch the authenticated user
  const { data: userData, error: userError } = await supabase.auth.getUser();

  if (userError) {
    console.log(userError.message);
    return [];
  }

  // Ensure userData is available before proceeding
  if (!userData.user) {
    console.log("User is not authenticated.");
    return [];
  }

  const { data, error } = await supabase
    .from("playlists")
    .select("*")
    .eq("user_id", userData.user.id)
    .order("created_at", { ascending: false });

  if (error) {
    console.log(error.message);
    return [];
  }

  return (data as Playlist[]) || [];
};

export default getPlaylistsByUserID;
