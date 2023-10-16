import moment from "moment";
import Head from "next/head";
import { useEffect, useState } from "react";
import { getuser } from "../utils/request";
import Navbar from "./Navbar";

function ShowSubmission({ submission }) {
  const [user, setUser] = useState(null);

  useEffect(() => {
    getuser(submission.uid).then((user) => setUser(user.data));
  }, [submission.uid]);

  console.log("submission >>> ", submission);
  console.log("user >>> ", user);

  return (
    <div className="min-h-screen w-full bg-slate-50 text-slate-900 antialiased">
      <Head>
        <title>Submitted by {user ? user.email : "your student"}</title>
        <link rel="icon" href="/1logo.png" />
      </Head>
      <Navbar />
      <div className="mx-auto flex h-full w-screen items-center justify-between px-2 md:max-w-screen-2xl md:px-0 xl:max-w-screen-xl">
        <section className="w-full py-2">
          <div className="mx-auto flex w-full max-w-screen-md flex-col space-y-5 border-[0.2px] bg-white p-5 shadow-sm">
            <div className="flex flex-col md:space-y-2">
              <h1 className="text-xl font-medium text-gray-900 md:text-4xl">
                Submitted by {user ? user.email : "your student"}
              </h1>
              <div className="grid gap-5 p-5 md:grid-cols-2">
                {submission.img.url && (
                  <a
                    href={submission.img.url}
                    target="_blank"
                    rel="noreferrer"
                    className="group relative cursor-pointer overflow-hidden rounded-md">
                    <div className="absolute inset-0 group-hover:bg-black/40" />
                    <img
                      className="h-auto w-auto object-contain"
                      src={submission.img.url}
                      alt=""
                    />
                  </a>
                )}

                {submission.pdf.url && (
                  <a
                    href={submission.pdf.url}
                    target="_blank"
                    rel="noreferrer"
                    className="group relative cursor-pointer overflow-hidden rounded-md">
                    <div className="absolute inset-0 group-hover:bg-black/40" />
                    <iframe
                      title="pdf"
                      src={`${submission.pdf.url}#toolbar=0`}
                      scrolling="auto"
                      height="100%"
                      width="100%"></iframe>
                  </a>
                )}
              </div>

              <div className="flex items-start justify-between">
                <div className="flex flex-1 flex-col gap-y-2">
                  <p className="md:text-md text-base capitalize leading-tight tracking-widest text-gray-700">
                    {submission.desc}
                  </p>
                </div>

                <div className="flex w-max flex-col space-y-1">
                  <p className="text-[10px] text-gray-600 md:text-xs">
                    {user?.name || user?.email || user?.uid}
                  </p>
                  <p className="text-[10px] text-gray-600 md:text-xs">
                    {moment(submission.createdAt).format("llll")}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}

export default ShowSubmission;
