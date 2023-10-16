import { PlusIcon, SearchIcon } from "@heroicons/react/outline";
import { getSession, useSession } from "next-auth/react";
import Head from "next/head";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import ClassLinkItem from "../../components/ClassLinkItem";
import Navbar from "../../components/Navbar";
import { UserRole } from "../../models/User";
import { getSemesters, getSubjects } from "../../utils/common";
import { getClasses } from "../../utils/request";

function Dashboard({
  classLinks,
  serverBranch,
  serverSemester,
  serverSubject
}) {
  const [semesters, setSemesters] = useState([]);
  const [branch, setBranch] = useState(serverBranch);
  const [semester, setSemester] = useState(serverSemester);
  const [subject, setSubject] = useState(serverSubject);
  const [subjects, setSubjects] = useState([]);
  const [isVisible, setIsVisible] = useState(false);
  const { data: session } = useSession();
  const router = useRouter();

  useEffect(() => {
    const unsubscribe = async () => {
      const res = getSemesters();
      const subres = getSubjects();

      setSemesters(res);
      setSubjects(subres);
    };
    return unsubscribe();
  }, []);

  const fetchData = async () => {
    const queryStringArray = [];

    const sub = subject.toLowerCase().split(" ").join("%20");

    queryStringArray.push(branch ? `branch=${branch}` : "");
    queryStringArray.push(semester ? `semester=${semester}` : "");
    queryStringArray.push(subject ? `subject=${sub}` : "");

    let queryString = "";
    queryStringArray.map((query) => (queryString = queryString + query + "&"));

    // const res = await getClasses(queryString);
    router.push(`/dashboard?${queryString}`);
  };

  return (
    <div className="min-h-screen w-full bg-slate-50 text-slate-900 antialiased">
      <Head>
        <title>welcome {session?.user?.email}</title>
        <link rel="icon" href="/1logo.png" />
      </Head>

      <Navbar />

      <main className="relative mx-auto h-full w-screen animate-slide-up px-2 md:max-w-screen-2xl md:px-0 xl:max-w-screen-xl">
        <div className="absolute -top-[61px] left-2">
          <button
            onClick={() => setIsVisible((isVisible) => !isVisible)}
            className="grid h-10 w-10 cursor-pointer place-items-center rounded-full bg-indigo-100 md:hidden">
            <div className="h-6 w-6">
              <SearchIcon className="h-full w-full text-indigo-600" />
            </div>
          </button>
        </div>
        <section className="w-full py-2">
          <div className="mx-auto flex max-w-screen-lg flex-col items-center gap-y-5 md:flex-row md:items-start">
            <div
              className={`${
                !isVisible && "hidden md:flex"
              } flex max-w-screen-md flex-col space-y-5 text-xs transition-all md:w-60 md:text-base`}>
              <div className="w-full">
                <label htmlFor="subject" className="label">
                  Branch:
                </label>
                <input
                  className="input"
                  list="branch"
                  value={branch}
                  onChange={(e) => setBranch(e.target.value)}
                />
                <datalist className="input" name="branch" id="branch">
                  <option value="cse">cse</option>
                  <option value="it">it</option>
                  <option value="ece">ece</option>
                  <option value="eee">eee</option>
                  <option value="mechanical">mechanical</option>
                  <option value="civil">civil</option>
                  <option value="mining">mining</option>
                </datalist>
              </div>
              <div className="w-full">
                <label htmlFor="subject" className="label">
                  Semester:
                </label>
                <input
                  className="input"
                  list="semester"
                  value={semester}
                  onChange={(e) => setSemester(e.target.value)}
                />
                <datalist className="input" name="semester" id="semester">
                  {semesters?.map((semester, i) => (
                    <option key={i} value={semester}>
                      {semester}
                    </option>
                  ))}
                </datalist>
              </div>

              <div className="w-full">
                <label htmlFor="subject" className="label">
                  Subject:
                </label>
                <input
                  className="input"
                  list="subject"
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                />
                <datalist className="input" name="subject" id="subject">
                  {Array?.from(subjects)
                    ?.sort()
                    .map((subject, i) => (
                      <option key={i} value={subject}>
                        {subject}
                      </option>
                    ))}
                </datalist>
              </div>
              <button
                disabled={!branch || !semester || !subject}
                onClick={fetchData}
                className="authButton disabled:cursor-not-allowed disabled:opacity-80 disabled:hover:bg-black disabled:hover:text-white">
                Search Results
              </button>
            </div>

            <div className="flex-1">
              {(session.user.role === UserRole.Admin ||
                (session.user.role === UserRole.Faculty &&
                  session.user.isApprovedAsFaculty)) && (
                <button
                  onClick={() => router.push("/dashboard/addClass")}
                  className="group mx-auto mb-4 grid w-full max-w-screen-md cursor-pointer place-items-center rounded-lg border-[0.2px] bg-white p-4 shadow-sm">
                  <div className="grid h-16 w-16 place-items-center rounded-full bg-red-100 group-hover:scale-105">
                    <div className="h-11 w-11">
                      <PlusIcon className="h-full text-red-600" />
                    </div>
                  </div>
                </button>
              )}
              <table className="mx-auto w-full max-w-screen-md table-auto border-[0.2px] bg-white shadow-sm">
                <thead>
                  <tr className="grid w-full grid-cols-8 justify-items-start bg-gray-100 p-5 text-xs md:grid-cols-9 md:text-base">
                    <th className="col-span-3 capitalize">Title</th>
                    <th className="col-span-1 capitalize">sem</th>
                    <th className="col-span-1 capitalize">branch</th>
                    <th className="col-span-1 capitalize">subject</th>
                    <th className="col-span-1 capitalize md:col-span-2">
                      postedBy
                    </th>
                    <th className="col-span-1 capitalize">createdAt</th>
                  </tr>
                </thead>
                <tbody className="">
                  {classLinks?.data?.length > 0 ? (
                    classLinks?.data?.map((classLink) => (
                      <ClassLinkItem
                        key={classLink._id}
                        classLink={classLink}
                      />
                    ))
                  ) : (
                    <tr className="grid w-full place-items-center p-5 text-xs md:text-base">
                      <td className="text-3xl font-medium">No Classes Found</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}

export default Dashboard;

export async function getServerSideProps(context) {
  const { query } = context;
  const { branch, semester, subject } = query;
  const session = await getSession(context);
  const queryStringArray = [];

  const sub = subject && subject.toLowerCase().split(" ").join("%20");

  queryStringArray.push(branch ? `branch=${branch}` : "");
  queryStringArray.push(semester ? `semester=${semester}` : "");
  queryStringArray.push(subject ? `subject=${sub}` : "");

  let queryString = "";
  queryStringArray.map((query) => (queryString = queryString + query + "&"));

  const classLinks = await getClasses(queryString);

  if (classLinks?.hasError) {
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
    props: {
      session,
      classLinks,
      serverBranch: branch || "",
      serverSemester: semester || "",
      serverSubject: subject || ""
    }
  };
}
