import Navbar from "components/Navbar";
import { DISCOPOD_ADDRESS, DISCOPOD_ABI } from "constants/contractData";
import { useRouter } from "next/router";
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
  const { data: podcast } = useContractRead({
    address: DISCOPOD_ADDRESS,
    abi: DISCOPOD_ABI,
    functionName: "podcastIdToPodcast",
    args: [data],
  });

  console.log(data);
  console.log(podcast);

  return (
    <div className=" bg-gray-100 p-6">
      <Navbar />
      <div className="flex flex-col max-w-6xl w-full mx-auto p-6">
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-2xl font-bold mb-6">Podchain: {pod}</h2>
        </div>
      </div>
    </div>
  );
};

export default Post;
