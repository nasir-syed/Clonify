import getPlaylistByID from "@/actions/getPlaylistByID";
import Header from "@/components/Header";
import PlaylistContent from "../components/PlaylistContent";
import getPlaylistSongs from "@/actions/getPlaylistSongs";

export const revalidate = 0

async function Playlist({ params }: { params: { id: string } }) {
    const playlist = await getPlaylistByID(params.id);
    const playlistSongs = await getPlaylistSongs(params.id)
    
    if (!playlist) {
        return <p>Playlist not found.</p>;
    }

    return (
        <div className="bg-neutral-900 h-full w-full overflow-hidden overdflow-y-auto rounded-lg">
        <Header>
            <PlaylistContent playlist={playlist} songs={playlistSongs}/>
        </Header>
        </div>
    );
}
 
export default Playlist;