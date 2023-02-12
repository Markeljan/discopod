import Navbar from "components/Navbar";
import { DISCOPOD_ADDRESS, DISCOPOD_ABI } from "constants/contractData";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { useContractRead, useContractReads } from "wagmi";

const DISCOPOD = {
  address: DISCOPOD_ADDRESS,
  abi: DISCOPOD_ABI,
};

const Post = () => {
  const router = useRouter();

  const { pod } = router.query;

  const { data, isError, isLoading } = useContractRead({
    address: DISCOPOD_ADDRESS,
    abi: DISCOPOD_ABI,
    functionName: "podcastNameToId",
    args: ["Mark"],
  });
  const { data: podcast }: { data: any } = useContractRead({
    address: DISCOPOD_ADDRESS,
    abi: DISCOPOD_ABI,
    functionName: "podcastIdToPodcast",
    args: [data],
  });
  const [podcastData, setPodcastData] = useState<any>({});

  useEffect(() => {
    if (podcast.length > 0) {
      console.log(podcast);
      // create an object with the podcast data
      console.log(podcast.name);
      setPodcastData(podcast);
    }
  }, [podcast]);

  console.log(podcast?.length);

  return (
    <div className=" bg-gray-100 p-6">
      <Navbar />
      <div className="flex flex-col max-w-6xl w-full mx-auto p-6">
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-2xl font-bold mb-6">Pod: {pod}</h2>
          <p>{podcastData && podcastData.name}</p>
          <p>{podcastData && podcastData.description}</p>
          <p>{podcastData && podcastData.topic}</p>
        </div>
      </div>
    </div>
  );
};

export default Post;
