import { ConnectButton } from "@rainbow-me/rainbowkit";
import { useRouter } from "next/router";

export default function Navbar() {
  const router = useRouter();

  return (
    <div>
      <nav className="bg-white w-full py-2">
        <ul className="flex justify-center items-center">
          <li className="w-1/2 flex justify-start items-center px-4 gap-4">
            <a
              href="/"
              className={`text-black hover:text-slate-600 font-bold ${
                router.pathname === "/" ? "active" : ""
              }`}
              onClick={(e) => {
                e.preventDefault();
                router.push("/");
              }}
            >
              Disco Pod
            </a>
          </li>
          <div className="w-1/2 flex justify-end items-center px-4 gap-4 ">
            <li className="mx-3  rounded-xl bg-gray-100 hover:bg-gray-200  p-2 ">
              <a
                href="/create"
                className={`text-black hover:text-slate-800 font-bold bg-none ${
                  router.pathname === "/create" ? "active" : ""
                }`}
                onClick={(e) => {
                  e.preventDefault();
                  router.push("/create");
                }}
              >
                Create
              </a>
            </li>

            <li>
              <ConnectButton />
            </li>
          </div>
        </ul>
      </nav>
    </div>
  );
}
