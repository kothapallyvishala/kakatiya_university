/* eslint-disable @next/next/no-img-element */
import { LogoutIcon, UserCircleIcon } from "@heroicons/react/outline";
import { signOut, useSession } from "next-auth/react";
import { useRouter } from "next/router";
import { useState } from "react";

function Navbar() {
  const { data: session } = useSession();
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const logout = async () => {
    setLoading(true);
    await signOut();
    setLoading(false);
  };

  return (
    <div
      className={`h-20 border-b-2 shadow-md ${
        loading && "animate-pulse"
      } z-50`}>
      <div className="mx-auto flex h-full w-screen items-center justify-between px-5 md:max-w-screen-2xl md:px-0 xl:max-w-screen-xl">
        <div>
          <button
            onClick={() => router.push(`/${session?.user.uid}`)}
            className="relative hidden font-Dongle text-4xl before:absolute before:-inset-1 before:block before:-skew-y-3 before:bg-indigo-500 hover:cursor-pointer md:inline-block">
            <span className="relative font-bold text-white">
              Hieee, {session?.user.name || session?.user.uid || ""}
            </span>
          </button>
        </div>
        <ul className="flex items-center space-x-4 sm:space-x-7">
          <button
            onClick={() => router.push("/assignments")}
            className={`link text-sm text-slate-800 sm:text-base ${
              router.pathname === "/assignments" && "active"
            }`}>
            Assignments
          </button>
          <button
            onClick={() => router.push("/dashboard")}
            className={`link text-sm text-slate-800 sm:text-base ${
              router.pathname === "/dashboard" && "active"
            }`}>
            Class Links
          </button>
          <button
            onClick={() => router.push(`/${session.user.uid}`)}
            className={`link text-slate-800 ${
              router.pathname === "/profile" && "active"
            }`}>
            <div className="h-11 w-11 overflow-hidden rounded-full">
              {session?.user.img ? (
                <img
                  className="h-full rounded-full object-cover object-center brightness-110"
                  src={session?.user.img}
                  alt="profile"
                />
              ) : (
                <UserCircleIcon className="h-full" />
              )}
            </div>
          </button>
          <button onClick={logout} className="link text-slate-800">
            <div className="h-9">
              <LogoutIcon className="h-full" />
            </div>
          </button>
        </ul>
      </div>
    </div>
  );
}

export default Navbar;
