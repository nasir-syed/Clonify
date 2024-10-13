"use client";
import { useState, useEffect } from "react";
import { FieldValues, useForm } from "react-hook-form";
import Modal from "./Modal";
import Button from "./Button";
import { Song } from "@/types";
import useLoadImage from "@/hooks/useLoadImage";
import { useSupabaseClient } from "@supabase/auth-helpers-react";
import toast from "react-hot-toast";
import { useRouter, useParams } from "next/navigation";
import useAddToPlaylistModal from "@/hooks/useAddToPlaylistModal"; 

interface AddToPlaylistModalProps {
  Songs: Song[];  
}

const AddToPlaylistModal: React.FC<AddToPlaylistModalProps> = ({ Songs }) => {
  const playlistModal = useAddToPlaylistModal();  
  const [isLoading, setIsLoading] = useState(false);
  const [playlistSongs, setPlaylistSongs] = useState<string[]>([]); 
  const [selectedSongs, setSelectedSongs] = useState<string[]>([]); 
  const supabaseClient = useSupabaseClient();
  const router = useRouter();
  const { id } = useParams(); 

  const { handleSubmit, reset } = useForm<FieldValues>({
    defaultValues: { songs: [] },
  });

  
  useEffect(() => {
    const fetchPlaylistSongs = async () => {
        if (!id) return; 
        const { data, error } = await supabaseClient
            .from("playlist_songs")
            .select("song_id")
            .eq("playlist_id", id);

        if (error) {
            toast.error("Failed to fetch playlist songs");
        } else {
            
            const existingSongIds = data.map((item: { song_id: string }) => item.song_id);
            setPlaylistSongs(existingSongIds);
        }
    };

    fetchPlaylistSongs();
  }, [supabaseClient, id]);

  
  const availableSongs = Songs.filter((song) => !playlistSongs.includes(song.id));

  const onSongSelect = (songId: string) => {
    setSelectedSongs((prev) =>
      prev.includes(songId) ? prev.filter(id => id !== songId) : [...prev, songId]
    );
  };

  const onSubmit = async () => {
    if (selectedSongs.length === 0) {
      return toast.error("Please select at least one song");
    }

    try {
      setIsLoading(true);

      
      for (const songId of selectedSongs) {
        const { error } = await supabaseClient
          .from("playlist_songs")
          .insert({ playlist_id: id, song_id: songId });

        if (error) {
          throw new Error(`Failed to add song ${songId} to playlist.`);
        }
      }

      toast.success("Songs added to playlist successfully");
      router.refresh();
      playlistModal.onClose();  
      reset();  
    } catch (error) {
      toast.error("Error adding songs");
    } finally {
      setIsLoading(false);
    }
  };

  const onChange = (open: boolean) => {
    if (!open) {
      reset();  
      playlistModal.onClose();  
    }
  };

  return (
    <Modal
      title="Add Songs to Playlist"
      description="Select songs to add to the playlist"
      isOpen={playlistModal.isOpen}  
      onChange={onChange}  
    >
      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-y-4">
        <div className="flex flex-col max-h-[60vh] overflow-y-auto gap-y-4">
          {availableSongs.length > 0 ? (
            availableSongs.map((song: Song) => {
              const imageUrl = useLoadImage(song);
              return (
                <div key={song.id} className="flex items-center gap-x-4">
                  <div className="relative rounded-md w-[60px] h-[60px] overflow-hidden">
                    <img src={imageUrl || "/images/placeholder.jpg"} alt={song.title} className="object-cover w-full h-full" />
                  </div>
                  <div className="flex-1">
                    <p className="text-white truncate">{song.title}</p>
                    <p className="text-sm text-neutral-400">{song.artist}</p>
                  </div>
                  <input
                    type="checkbox"
                    className="h-4 w-4"
                    checked={selectedSongs.includes(song.id)}
                    onChange={() => onSongSelect(song.id)}  
                  />
                </div>
              );
            })
          ) : (
            <p className="text-neutral-400 text-center">All available songs are already in the playlist.</p>
          )}
        </div>
        <Button disabled={isLoading} type="submit">
          Add to Playlist
        </Button>
      </form>
    </Modal>
  );
};

export default AddToPlaylistModal;
