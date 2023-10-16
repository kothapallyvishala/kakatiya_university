import { PlusIcon } from "@heroicons/react/outline";
import { getSession, useSession } from "next-auth/react";
import Head from "next/head";
import { useRouter } from "next/router";
import AssignmentItem from "../../components/AssignmentItem";
import Navbar from "../../components/Navbar";
import { UserRole } from "../../models/User";
import { getAssignments } from "../../utils/request";

function Assignments({ assignments }) {
  const { data: session } = useSession();
  const router = useRouter();

  return (
    <div className="min-h-screen w-full bg-slate-50 text-slate-900 antialiased">
      <Head>
        <title>welcome {session?.user?.email}</title>
        <link rel="icon" href="/1logo.png" />
      </Head>
      <Navbar />
      <div className="mx-auto flex h-full w-screen animate-slide-up items-center justify-between px-2 md:max-w-screen-2xl md:px-0  xl:max-w-screen-xl">
        <section className="w-full py-2">
          {(session.user.role === UserRole.Admin ||
            (session.user.role === UserRole.Faculty &&
              session.user.isApprovedAsFaculty)) && (
            <button
              onClick={() => router.push("/assignments/addAssignment")}
              className="group mx-auto mb-4 grid w-full max-w-screen-md cursor-pointer place-items-center rounded-lg border-[0.2px] bg-white p-4 shadow-sm">
              <div className="grid h-16 w-16 place-items-center rounded-full bg-red-100 group-hover:scale-105">
                <div className="h-11 w-11">
                  <PlusIcon className="h-full text-red-600" />
                </div>
              </div>
            </button>
          )}
          <ul className="mx-auto flex w-full max-w-screen-md flex-col border-[0.2px] bg-white p-5 shadow-sm">
            {assignments?.data?.length > 0 ? (
              assignments?.data?.map((assignment) => (
                <AssignmentItem key={assignment._id} assignment={assignment} />
              ))
            ) : (
              <li className="w-full p-5 text-center text-3xl font-medium">
                No Assignments Found
              </li>
            )}
          </ul>
        </section>
      </div>
    </div>
  );
}

export default Assignments;

export async function getServerSideProps(context) {
  const session = await getSession(context);

  const assignments = await getAssignments();

  if (!session) {
    return {
      redirect: {
        destination: "/",
        permanent: false
      }
    };
  }

  return {
    props: { session, assignments }
  };
}
