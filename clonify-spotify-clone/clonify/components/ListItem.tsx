"use client";

import useAuthModal from "@/hooks/useAuthModal";
import useLoadImage from "@/hooks/useLoadImage";
import { useUser } from "@/hooks/useUser";
import { Playlist } from "@/types";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { FaPlay } from "react-icons/fa";

interface ListItemProps {
  imagePath: string | Playlist;
  name: string;
  href: string;
}

const ListItem: React.FC<ListItemProps> = ({ imagePath, name, href }) => {
  const router = useRouter();
  const authModal = useAuthModal();
  const { user } = useUser();

  const onClick = () => {
    if (!user) {
      authModal.onOpen(); // Ensure the modal opens if user is not logged in
    } else {
      router.push(href); // Navigate if the user is logged in
    }
  };

  const imageUrl = typeof imagePath === "object" ? useLoadImage(imagePath) : imagePath;

  return (
    <button onClick={onClick} className="relative group max-w-[128px] transition">
      <div className="flex flex-col">
        <div className="relative min-h-[128px] min-w-[128px]">
          <Image
            className="object-fill rounded-md group-hover:shadow-lg group-hover:shadow-neutral-900 transition"
            fill
            src={imageUrl || "/images/liked.jpg"}
            alt="Playlist Cover"
          />
        </div>
        <p className="font-bold text-xl truncate py-4 mr-auto px-1">{name}</p>
        <div className="absolute transition opacity-0 rounded-full flex items-center right-10 top-10 justify-center bg-purple-400 p-4 drop-shadow-md group-hover:opacity-100 hover:scale-105">
          <FaPlay className="text-black" />
        </div>
      </div>
    </button>
  );
};

export default ListItem;
