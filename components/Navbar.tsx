import { ConnectButton } from "@rainbow-me/rainbowkit";
import { useRouter } from "next/router";

export default function Navbar() {
  const router = useRouter();

  return (
    <div>
      <nav className="flex-row">
        <ul className="flex justify-center items-center">
          <div className="w-1/2 flex justify-start items-center p-4 gap-4">
            <li className="mx-3">
              <a
                href="/"
                className={`text-primary hover:text-white font-bold ${
                  router.pathname === "/" ? "active" : ""
                }`}
                onClick={(e) => {
                  e.preventDefault();
                  router.push("/");
                }}
              >
                Home
              </a>
            </li>
            <li className="mx-3">
              <a
                href="/create"
                className={`text-primary hover:text-white font-bold ${
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
          </div>

          <li className="w-1/2 flex justify-end items-center p-4">
            <ConnectButton />
          </li>
        </ul>
      </nav>
    </div>
  );
}
