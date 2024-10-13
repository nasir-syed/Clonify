import getPlaylists from "@/actions/getPlaylists";
import getSongs from "@/actions/getSongs";
import Header from "@/components/Header";
import ListItem from "@/components/ListItem";
import PageContent from "@/components/PageContent";

// page is not cached, data is up-to-date
export const revalidate = 0

export default async function Home() {

  const songs = await getSongs()
  const playlists = await getPlaylists()
  
  return (
    <div className="bg-neutral-900 rounded-lg w-full h-full overflow-hidden overflow-y-auto">
      <Header>
        <div className="mb-2">
          <h1 className="text-white text-3xl font-semibold">
            Playlists
          </h1>
          <div className="grid grid-cols-4 sm:grid-cols-4 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 2xl:grid-cols-8 gap-4 mt-4">
            <ListItem imagePath="/images/liked.jpg" name="Liked Songs" href="liked">
            </ListItem>           
               {playlists.map((item) => {
                return (
                  <ListItem imagePath={item} name={item.title} href={`playlist/${item.id}`}></ListItem>
                )
               })}
          </div>
        </div>
      </Header>
      <div className="mt-2 mb-7 px-6">
        <div className="flex justify-between items-center ">
          <h1 className="text-white text-2xl font-semibold">
            Songs
          </h1>
        </div>
        <PageContent songs={songs}/>
      </div>
    </div>
  );
}
