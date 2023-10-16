import { EmojiSadIcon } from "@heroicons/react/outline";
import Head from "next/head";
import Navbar from "../components/Navbar";

function Custom404() {
  return (
    <div>
      <Navbar />
      <Head>
        <title>404, Not Found</title>
        <link rel="icon" href="/1logo.png" />
      </Head>
      <div className="mx-auto flex h-full w-screen items-center justify-between px-5 md:max-w-screen-2xl md:px-0 xl:max-w-screen-xl">
        <section className="w-full py-5">
          <div className="mx-auto flex w-full max-w-screen-md items-center justify-center gap-x-5 border-[0.2px] bg-white p-11 shadow-sm">
            <h1 className="text-center text-4xl font-medium ">Not Found</h1>
            <div className="h-16">
              <EmojiSadIcon className="h-full" />
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}

export default Custom404;
