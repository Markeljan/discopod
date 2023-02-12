import Navbar from "@/components/Navbar";
import { DISCOPOD_ADDRESS, DISCOPOD_ABI } from "constants/contractData";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { useContractRead } from "wagmi";

export async function getStaticPaths() {
  const paths: never[] = [];
  return {
    paths,
    fallback: "blocking",
  };
}

export async function getStaticProps(context: { params: { pod: any } }) {
  const { pod } = context.params;

  return {
    props: {
      pod,
    },
  };
}

const DISCOPOD = {
  address: DISCOPOD_ADDRESS,
  abi: DISCOPOD_ABI,
};

const Pod = (props: any) => {
  const router = useRouter();

  const { pod } = props;
  const { data, isError, isLoading } = useContractRead({
    address: DISCOPOD_ADDRESS,
    abi: DISCOPOD_ABI,
    functionName: "podcastNameToId",
    args: [pod],
  });

  const { data: podcast }: { data: any } = useContractRead({
    address: DISCOPOD_ADDRESS,
    abi: DISCOPOD_ABI,
    functionName: "podcastIdToPodcast",
    args: [data],
  });
  const [podcastData, setPodcastData] = useState<any>({});

  console.log(data);
  useEffect(() => {
    if (podcast) {
      console.log(podcast);
      // create an object with the podcast data
      console.log(podcast.name);
      setPodcastData(podcast);
    }
  }, [podcast]);

  return (
    <div className=" bg-gray-100 p-6">
      <Navbar />
      <div className="flex flex-col max-w-6xl w-full mx-auto p-6">
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-2xl font-bold mb-6">Pod: {pod}</h2>
          <p>{podcastData?.name}</p>
          <p>{podcastData?.description}</p>
          <p>{podcastData?.topic}</p>
        </div>
      </div>
    </div>
  );
};

export default Pod;
