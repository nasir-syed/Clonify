"use client";

import usePlaylistModal from "@/hooks/usePlaylistModal";
import Modal from "./Modal"
import { FieldValues, SubmitHandler, useForm } from "react-hook-form";
import { useState } from "react";
import Input from "./Input";
import Button from "./Button";
import toast from "react-hot-toast";
import uniqid from "uniqid"
import { useUser } from "@/hooks/useUser";
import { useSupabaseClient } from "@supabase/auth-helpers-react";
import { useRouter } from "next/navigation";

const PlaylistModal = () => {

    const PlaylistModal = usePlaylistModal();
    const [isLoading, setIsLoading] = useState(false);
    const {user} = useUser();
    const supabaseClient = useSupabaseClient()
    const router = useRouter()
    const {register, handleSubmit, reset} = useForm<FieldValues>({
        
        defaultValues: {
        title: "",
        image: null,
        }
    })

    const onChange = (open: boolean) => {
        if (!open) {
            reset();
            PlaylistModal.onClose();
        }
    }

    const onSubmit: SubmitHandler<FieldValues> = async (values) => {
        try {
            setIsLoading(true)

            const imageFile = values.image?.[0];

            if (!imageFile || !user){
                return toast.error('Missing Fields');
            }

            const uniqueID = uniqid();

            const { data: imageData, error: imageError} = await supabaseClient.storage.from('images').upload(`image-${values.title}-${uniqueID}`, imageFile, {cacheControl: '3600', upsert: false })

            if (imageError) {
                setIsLoading(false);
                return toast.error("Image Upload Failed.")
            }


            const {error: supabaseError} = await supabaseClient.from('playlists').insert({user_id: user.id, title: values.title, image_path: imageData.path})

            if (supabaseError) {
                setIsLoading(false);
                return toast.error(imageData.path)
            }

            router.refresh()
            setIsLoading(false);
            reset();
            PlaylistModal.onClose();
            return toast.success("Playlist Made Successfully!")


        } catch (error) {
            toast.error("Error")
            
        } finally {
            setIsLoading(false);
        }
    }

    return ( 
        <Modal title="Make Playlist" description="Upload a Cover" isOpen={PlaylistModal.isOpen} onChange={onChange}> 
            <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-y-4">
                <Input id="title" disabled={isLoading} placeholder="Playlist Title" {...register('title', {required: true})}/>
                <div>
                    <div className="pb-1">
                        Select a Cover Image
                    </div>
                    <Input id="image" type="file" disabled={isLoading} accept="image/*" {...register('image', {required: true})}/>
                </div>
                <Button disabled={isLoading} type="submit">
                    Upload
                </Button>
            </form> 
            
        </Modal>
     );
}
 
export default PlaylistModal;