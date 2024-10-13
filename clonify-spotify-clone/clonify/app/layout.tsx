import type { Metadata } from "next";
import { Figtree } from "next/font/google";
import "./globals.css";
import Sidebar from "@/components/Sidebar";
import SupabaseProvider from "@/providers/SupabaseProvider";
import UserProvider from "@/providers/UserProvider";
import ModalProvider from "@/providers/ModalProvider";
import ToasterProvider from "@/providers/ToasterProvider";
import getSongsByUserID from "@/actions/getSongsByUserID";
import Player from "@/components/Player";
import getPlaylistsByUserID from "@/actions/getPlaylistsByUserID";
import getSongs from "@/actions/getSongs";

const font = Figtree({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Clonify",
  description: "Not Spotify.",
};

export const revalidate = 0

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const userSongs = await getSongsByUserID();
  const userPlaylists = await getPlaylistsByUserID();
  const songs = await getSongs()
  
  return (
    <html lang="en">
      <body className={font.className}>
        <ToasterProvider/>
        <SupabaseProvider>
          <UserProvider>
            <ModalProvider songs={songs}/>
              <Sidebar songs={userSongs} playlists={userPlaylists}>
                {children}
              </Sidebar>
            <Player/>
          </UserProvider>
        </SupabaseProvider>
        </body>
    </html>
  );
}
