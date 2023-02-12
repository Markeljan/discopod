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
  const podNormal = pod.toString().toLowerCase();
  return {
    props: {
      podNormal,
    },
  };
}

const DISCOPOD = {
  address: DISCOPOD_ADDRESS,
  abi: DISCOPOD_ABI,
};

const Pod = (props: any) => {
  const router = useRouter();

  const { podNormal: pod } = props;
  console.log("pod", pod);
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
    if (podcast?.name) {
      console.log(podcast);
      // create an object with the podcast data
      console.log(podcast.name);
      setPodcastData(podcast);
    }
  }, [podcast]);

  return (
    <div className=" bg-gray-100 p-6">
      <div className="flex flex-col max-w-6xl w-full mx-auto p-6">
        <div className="bg-white p-6 rounded-lg shadow-md">
          {!podcastData?.name && (
            <>
              <h2 className="text-2xl font-bold mb-6">
                Podcast Does not exist... Yet! Make it yourself!
              </h2>
              <button
                className=" bg-blue-500 text-white p-2 rounded-lg shadow-md"
                onClick={() => router.push("/create")}
              >
                Create Podcast
              </button>
            </>
          )}
          <h2 className="text-2xl font-bold mb-6">{podcastData?.name?.toUpperCase()}</h2>
          <p>{podcastData?.description}</p>
          <p>{podcastData?.topic}</p>
          <p>{podcastData?.host}</p>
        </div>
      </div>
    </div>
  );
};

export default Pod;
