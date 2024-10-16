"use client";

import useUploadModal from "@/hooks/useUploadModal";
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

const UploadModal = () => {

    const UploadModal = useUploadModal();
    const [isLoading, setIsLoading] = useState(false);
    const {user} = useUser();
    const supabaseClient = useSupabaseClient()
    const router = useRouter()
    const {register, handleSubmit, reset} = useForm<FieldValues>({
        
        defaultValues: {
        artist: "",
        title: "",
        song:null,
        image: null,

        }
    })

    const onChange = (open: boolean) => {
        if (!open) {
            reset();
            UploadModal.onClose();
        }
    }

    const onSubmit: SubmitHandler<FieldValues> = async (values) => {
        try {
            setIsLoading(true)

            const imageFile = values.image?.[0];
            const songFile = values.song?.[0]

            if (!imageFile || !songFile || !user){
                return toast.error('Missing Fields');
            }

            const uniqueID = uniqid();

            //upload song
            const { data: songData, error: songError} = await supabaseClient.storage.from('songs').upload(`song-${values.title}-${uniqueID}`, songFile, {cacheControl: '3600', upsert: false })
        
            
            if (songError) {
                setIsLoading(false);
                return toast.error("Song Upload Failed.")
            }

            const { data: imageData, error: imageError} = await supabaseClient.storage.from('images').upload(`image-${values.title}-${uniqueID}`, imageFile, {cacheControl: '3600', upsert: false })

            if (imageError) {
                setIsLoading(false);
                return toast.error("Image Upload Failed.")
            }


            const {error: supabaseError} = await supabaseClient.from('songs').insert({user_id: user.id, title: values.title, artist: values.artist, image_path: imageData.path, song_path: songData.path})

            if (supabaseError) {
                setIsLoading(false);
                return toast.error(supabaseError.message)
            }

            router.refresh()
            setIsLoading(false);
            reset();
            UploadModal.onClose();
            return toast.success("Song Uploaded Successfully!")


        } catch (error) {
            toast.error("Error")
            
        } finally {
            setIsLoading(false);
        }
    }

    return ( 
        <Modal title="Upload Song" description="Upload a MP3 file." isOpen={UploadModal.isOpen} onChange={onChange}> 
            <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-y-4">
                <Input id="title" disabled={isLoading} placeholder="Song Title" {...register('title', {required: true})}/>
                <Input id="artist" disabled={isLoading} placeholder="Song Artist" {...register('artist', {required: true})}/>
                <div>
                    <div className="pb-1">
                        Select a .MP3 File
                    </div>
                    <Input id="song" type="file" disabled={isLoading} accept=".mp3" {...register('song', {required: true})}/>
                </div>
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
 
export default UploadModal;