import Image from "next/image";

function Header() {
  return (
    <header className="flex h-20 w-screen items-center justify-between border-b p-5 px-11 shadow-md sm:h-40">
      <div className="relative hidden h-40 w-40 sm:inline-block">
        <Image
          className="object-contain"
          src="/1logo.png"
          alt=""
          layout="fill"
        />
      </div>
      <h1 className="flex-1 bg-gradient-to-r from-lime-500 via-green-700 to-slate-900 bg-clip-text text-center font-Dongle text-5xl font-bold capitalize text-transparent md:text-6xl lg:text-8xl">
        Kakatiya University
      </h1>
      <div className="relative hidden h-40 w-52 sm:inline-block">
        <Image
          className="object-contain"
          src="/2logo.png"
          alt=""
          layout="fill"
        />
      </div>
    </header>
  );
}

export default Header;
