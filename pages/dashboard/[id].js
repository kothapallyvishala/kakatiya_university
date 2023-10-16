/* eslint-disable jsx-a11y/media-has-caption */
import { SearchIcon } from "@heroicons/react/outline";
import { deleteObject, ref } from "firebase/storage";
import moment from "moment";
import { getSession, useSession } from "next-auth/react";
import Head from "next/head";
import { useRouter } from "next/router";
import { useState } from "react";
import Navbar from "../../components/Navbar";
import { UserRole } from "../../models/User";
import { storage } from "../../utils/firebase";
import {
  deleteClassLink,
  getClass,
  updateClassLink
} from "../../utils/request";

function VideoPage({ classLink }) {
  const { data: session } = useSession();

  const [loading, setLoading] = useState(false);
  const [, setErrorMessage] = useState("");
  const router = useRouter();
  const {
    title,
    desc,
    video,
    sem,
    branch,
    subject,
    postedBy,
    createdAt,
    watchedBy
  } = classLink;

  function userExists() {
    return watchedBy.some(function (person) {
      return person.uid === session.user.uid;
    });
  }

  const handleTime = async (e) => {
    const now = e.target.currentTime / e.target.duration;
    const percent = now * 100;

    const payload = {
      id: router.query.id,
      uid: session?.user.uid,
      percent: parseInt(percent)
    };

    if (userExists()) {
      const user = watchedBy.find((user) => user.uid === session.user.uid);
      if (percent > user?.watchedPercent) {
        await updateClassLink(payload);
      }
    } else {
      await updateClassLink(payload);
    }
  };

  const deleteClass = async () => {
    if (loading) return;
    setLoading(true);

    const videoRef = ref(
      storage,
      `videos/${session?.user.uid}/${sem}/${branch}/${subject}/${video.name}`
    );

    deleteObject(videoRef)
      .then(async () => {
        setErrorMessage("");
      })
      .catch((err) => setErrorMessage(err));

    const payload = { id: router.query.id, uid: postedBy.uid };

    const res = await deleteClassLink(payload);

    if (res.hasError) {
      setErrorMessage(res.errorMessage);
    } else {
      setLoading(false);
      router.replace("/dashboard");
    }

    setLoading(false);
  };

  const handleVideoEnded = () => {};

  return (
    <div className="min-h-screen w-full bg-slate-50 text-slate-900 antialiased">
      <Head>
        <title>{title}</title>
        <link rel="icon" href="/1logo.png" />
      </Head>
      <Navbar />
      <div className="mx-auto flex h-full w-screen items-center justify-between px-2 md:max-w-screen-2xl md:px-0 xl:max-w-screen-xl">
        <section className="w-full py-2">
          <div className="mx-auto flex w-full max-w-screen-md flex-col space-y-5 border-[0.2px] bg-white p-5 shadow-sm">
            <video
              className="aspect-video w-full"
              controls
              controlsList="nodownload"
              disablePictureInPicture
              onTimeUpdate={handleTime}
              onEnded={handleVideoEnded}>
              <source src={video?.url} type="video/mp4" />
              Your browser does not support the video tag.
            </video>
            <div className="flex items-start justify-between">
              <div className="flex flex-col md:space-y-2">
                <h1 className="text-xl font-medium text-gray-900 md:text-4xl">
                  {title}
                </h1>
                <p className="md:text-md text-base leading-tight tracking-widest text-gray-700">
                  {desc}
                </p>
                <p className="text-xs text-gray-500">
                  {watchedBy.length} views
                </p>
                {(session.user.role === UserRole.Admin ||
                  (session.user.role === UserRole.Faculty &&
                    session.user.isApprovedAsFaculty)) &&
                  postedBy.uid === session.user.uid && (
                    <button
                      onClick={deleteClass}
                      className={`mt-3 w-max rounded-md bg-red-500 p-2 px-4 text-xs uppercase text-white hover:bg-white hover:text-red-500 hover:ring-2 hover:ring-red-500 md:text-sm ${
                        loading && "opacity-50"
                      }`}>
                      {loading ? "Deleting" : "Delete Class"}
                    </button>
                  )}
              </div>
              <div className="flex flex-col items-end space-y-1">
                <p className="text-[10px] lowercase text-gray-600 md:text-xs">
                  {subject}
                </p>
                <p className="text-[10px] text-gray-600 md:text-xs">
                  {postedBy.name || postedBy.email || postedBy.uid}
                </p>
                <p className="text-[10px] text-gray-600 md:text-xs">
                  {moment(createdAt).format("llll")}
                </p>
              </div>
            </div>
          </div>
          {(session.user.role === UserRole.Admin ||
            (session.user.role === UserRole.Faculty &&
              session.user.isApprovedAsFaculty)) &&
            postedBy.uid === session.user.uid && (
              <div className="mx-auto mt-4 flex w-full max-w-screen-md flex-col space-y-5 border-[0.2px] bg-white p-5 shadow-sm">
                <h1 className="text-center text-2xl font-thin uppercase md:text-4xl">
                  Watched By
                </h1>
                <div className="input mx-auto flex gap-x-5">
                  <div className="h-7 w-7">
                    <SearchIcon className="h-full w-full text-gray-400" />
                  </div>
                  <input
                    className="w-full outline-none"
                    type="text"
                    placeholder="Enter roll number"
                  />
                </div>
                <table className="mx-auto w-full max-w-screen-md table-auto border-[0.2px] bg-white shadow-sm">
                  <thead>
                    <tr className="grid w-full grid-cols-2 justify-items-start bg-gray-100 p-5 text-xs md:text-base">
                      <th>Roll No</th>
                      <th>Watched Percentage</th>
                    </tr>
                  </thead>
                  <tbody>
                    {watchedBy.map((user, i) => (
                      <tr
                        key={i}
                        className="grid w-full grid-cols-2 justify-items-start p-5 text-xs md:text-base">
                        <td className="col-span-1">{user.uid}</td>
                        <td className="col-span-1">{user.watchedPercent}%</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
        </section>
      </div>
    </div>
  );
}

export default VideoPage;

export async function getServerSideProps(ctx) {
  const session = await getSession(ctx);
  // ctx.query
  // http://localhost:3000/dashboard/643b9de443a6f8f2d0f82339
  // 643b9de443a6f8f2d0f82339
  const classLink = await getClass(ctx.query.id);

  if (classLink.hasError) {
    return {
      notFound: true
    };
  }

  if (!session) {
    return {
      redirect: {
        destination: "/",
        permanent: false
      }
    };
  }

  return {
    props: { session, classLink: classLink.data }
  };
}
