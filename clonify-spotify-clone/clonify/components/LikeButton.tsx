"use client";

import useAuthModal from "@/hooks/useAuthModal";
import { useUser } from "@/hooks/useUser";
import { useSessionContext } from "@supabase/auth-helpers-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { AiFillHeart, AiOutlineHeart } from "react-icons/ai";


interface LikeButtonProps {
    songID: string
}

const LikeButton: React.FC<LikeButtonProps> = ({songID}) => {
    
    const router = useRouter();
    const {supabaseClient} = useSessionContext();

    const authModal = useAuthModal();
    const {user} = useUser();

    const [isLiked, setIsLiked] = useState(false);

    useEffect(() => {
        if(!user?.id) {
            return
        }

        const fetchData = async () => {
            const {data, error} = await supabaseClient.from("liked_songs").select("*").eq("user_id", user.id).eq('song_id', songID).single();

            if (!error && data) {
                setIsLiked(true)
            }
        };

        fetchData();
    }, [songID, supabaseClient, user?.id])

    const Icon = isLiked ? AiFillHeart : AiOutlineHeart

    const handleLike = async () => {
        if(!user) {
            return authModal.onOpen();
        }

        if(isLiked){
            const {error} = await supabaseClient.from('liked_songs').delete().eq('user_id', user.id).eq('song_id', songID);

            if (error){
                toast.error(error.message)
            } else {
                setIsLiked(false)
            }
        } else {
            const {error} = await supabaseClient.from('liked_songs').insert({
                song_id: songID,
                user_id: user.id
            });

            if(error){
                toast.error(error.message)
            } else {
                setIsLiked(true);
                toast.success('Liked!');
            }
        }
        router.refresh()
    }

    return ( 
        <button className="hover:opacity-75 transition" onClick={handleLike}>
            <Icon color={isLiked? "#9357f7" :"white"} size={25}/>
        </button>
     );
}
 
export default LikeButton;