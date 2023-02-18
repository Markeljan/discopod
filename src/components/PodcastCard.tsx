import Link from "next/link";
import { Card, CardHeader, CardBody, CardFooter } from '@chakra-ui/react'

type Props = {
  title: string;
  hostName: string;
  guestName: string;
  topic: string;
  fundGoal: number;
  fundRaised: number;
};

export const PodcastCard = ({
  title,
  hostName,
  guestName,
  topic,
  fundGoal,
  fundRaised,
}: Props) => {
  const fundPercentage = (fundRaised / fundGoal) * 100;
  return (
    <Card maxWidth={80}>
      <CardBody>
        
      </CardBody>
      <CardFooter>

      </CardFooter>
    </Card>
    // <div className="flex flex-col p-4 bg-white rounded-xl border-solid border-2 border-black w-80 hover:bg-gray-100 active:bg-gray-100">
    //   <Link
    //     className="flex flex-col h-full gap-4 justify-between"
    //     href={`/${title}`}
    //   >
    //     <div className="flex flex-row gap-4 text-xl">
    //       <div className="p-2 text-white text-center font-semibold rounded-xl flex items-center w-60 bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500">
    //         {topic}
    //       </div>
    //       <div className="flex flex-col text-lg text-center">
    //         <div className="text-red-600 text-xl font-bold ">Live</div>
    //         <div className="text-center text-lg px-2">
    //           <span className="font-semibold">{hostName}</span> hosting{" "}
    //           <span className="font-semibold">{guestName}</span>
    //         </div>
    //       </div>
    //     </div>
    //     <div>
    //       <div className="w-full h-6 bg-black rounded-full relative">
    //         <div
    //           className="h-6 bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 text-center font-medium text-white  leading-none rounded-full"
    //           style={{ width: `${fundPercentage}%` }}
    //         ></div>
    //         <div className="absolute text-white top-0 right-0 pr-4">
    //           {fundGoal}${" "}
    //         </div>
    //       </div>
    //     </div>
    //   </Link>
    // </div>
  );
};
