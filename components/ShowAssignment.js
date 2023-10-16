import { deleteObject, ref } from "firebase/storage";
import moment from "moment";
import { useSession } from "next-auth/react";
import Head from "next/head";
import { useRouter } from "next/router";
import { useState } from "react";
import { UserRole } from "../models/User";
import { storage } from "../utils/firebase";
import Navbar from "./Navbar";

function ShowAssignment({ assignment }) {
  const {
    _id,
    title,
    createdAt,
    desc,
    postedBy,
    submissions,
    subject,
    branch,
    sem,
    img,
    pdf
  } = assignment;
  const [, setErrorMessage] = useState(false);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const { data: session } = useSession();

  const deleteAssignment = async () => {
    if (loading) return;
    setLoading(true);

    const pdfRef = ref(
      storage,
      `AssignmentPdfs/${session?.user.uid}/${sem}/${branch}/${subject}/${pdf.name}`
    );

    const imgRef = ref(
      storage,
      `AssignmentImages/${session?.user.uid}/${sem}/${branch}/${subject}/${img.name}`
    );

    deleteObject(pdfRef)
      .then(async () => {
        setErrorMessage("");
      })
      .catch((err) => setErrorMessage(err));
    deleteObject(imgRef)
      .then(async () => {
        setErrorMessage("");
      })
      .catch((err) => setErrorMessage(err));

    const payload = { id: router.query.id, uid: postedBy.uid };

    const res = await deleteAssignment(payload);

    if (res.hasError) {
      setErrorMessage(res.errorMessage);
    } else {
      setLoading(false);
      router.replace("/assignments");
    }

    setLoading(false);
  };
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
            <div className="flex flex-col md:space-y-2">
              <h1 className="text-xl font-medium capitalize text-gray-900 md:text-4xl">
                {title}
              </h1>
              <div className="grid gap-5 p-5 md:grid-cols-2">
                <a
                  href={img.url}
                  target="_blank"
                  rel="noreferrer"
                  className="group relative cursor-pointer overflow-hidden rounded-md">
                  <div className="absolute inset-0 group-hover:bg-black/40" />
                  <img
                    className="h-auto w-auto object-contain"
                    src={img.url}
                    alt=""
                  />
                </a>

                <a
                  href={pdf.url}
                  target="_blank"
                  rel="noreferrer"
                  className="group relative cursor-pointer overflow-hidden rounded-md">
                  <div className="absolute inset-0 group-hover:bg-black/40" />
                  <iframe
                    title="pdf"
                    src={`${pdf.url}#toolbar=0`}
                    scrolling="auto"
                    height="100%"
                    width="100%"></iframe>
                </a>
              </div>

              <div className="flex items-start justify-between">
                <div className="flex flex-1 flex-col gap-y-2">
                  <p className="md:text-md text-base capitalize leading-tight tracking-widest text-gray-700">
                    {desc}
                  </p>
                  <p className="text-xs text-gray-500">
                    {submissions.length} submissions
                  </p>
                  {session.user.role === UserRole.Admin ||
                  (session.user.role === UserRole.Faculty &&
                    session.user.isApprovedAsFaculty) ? (
                    postedBy.uid === session.user.uid && (
                      <button
                        onClick={deleteAssignment}
                        className={`mt-3 w-max rounded-md bg-red-500 p-2 px-4 text-xs uppercase text-white hover:bg-white hover:text-red-500 hover:ring-2 hover:ring-red-500 md:text-sm ${
                          loading && "opacity-50"
                        }`}>
                        {loading ? "Deleting" : "Delete Assignment"}
                      </button>
                    )
                  ) : (
                    <button
                      onClick={() =>
                        router.push(`/assignments/${_id}/submitAssignment`)
                      }
                      className={`mt-3 w-max rounded-md bg-blue-500 p-2 px-4 text-sm uppercase text-white transition-all duration-300 hover:bg-white hover:text-blue-500 hover:ring-[1.4px] hover:ring-blue-500 ${
                        loading && "opacity-50"
                      }`}>
                      {loading ? "Submitting" : "Submit Assignment"}
                    </button>
                  )}
                </div>

                <div className="flex w-max flex-col space-y-1">
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
          </div>

          {(session.user.role === UserRole.Admin ||
            (session.user.role === UserRole.Faculty &&
              session.user.isApprovedAsFaculty)) &&
            postedBy.uid === session.user.uid && (
              <div className="mx-auto mt-4 flex w-full max-w-screen-md flex-col space-y-5 border-[0.2px] bg-white p-5 shadow-sm">
                <h1 className="text-center text-2xl font-thin uppercase md:text-4xl">
                  Submitted By
                </h1>

                <table className="mx-auto w-full max-w-screen-md table-auto border-[0.2px] bg-white shadow-sm">
                  <thead>
                    <tr className="grid w-full grid-cols-3 justify-items-start bg-gray-100 p-5 text-xs md:text-base">
                      <th>Roll No</th>
                      <th>Description</th>
                      <th>Submissions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {submissions.map((user, i) => (
                      <tr
                        key={i}
                        className="grid w-full grid-cols-3 justify-items-start p-5 text-xs md:text-base">
                        <td className="col-span-1">{user.uid}</td>
                        <td className="col-span-1">{user.desc}</td>
                        <td className="col-span-1">
                          <button
                            className="authButton"
                            onClick={() =>
                              router.push(
                                `/assignments/${router.query.id}?submission=${user._id}`
                              )
                            }>
                            View Submitted Assignment
                          </button>
                        </td>
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

export default ShowAssignment;
