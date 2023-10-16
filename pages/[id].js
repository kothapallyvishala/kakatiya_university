import { PencilIcon, XIcon } from "@heroicons/react/outline";
import { deleteObject, ref } from "firebase/storage";
import { getSession, signOut, useSession } from "next-auth/react";
import Head from "next/head";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import Avatar from "../components/Avatar";
import ClassLinkItem from "../components/ClassLinkItem";
import Modal from "../components/Modal";
import Navbar from "../components/Navbar";
import UserDetails from "../components/UserDetails";
import UserEditForm from "../components/UserEditForm";
import { UserRole } from "../models/User";
import { update } from "../redux/userSlice";
import { storage } from "../utils/firebase";
import {
  deleteuser,
  getUnapprovedFacultyDetails,
  getUserClassLinks,
  getuser,
  updateuser
} from "../utils/request";

function Profile({
  userData,
  userClassLinks,
  unapprovedFacultyDetails: unapproved
}) {
  const { data: session } = useSession();
  const [isEditing, setIsEditing] = useState(false);
  const [message, setMessage] = useState(false);
  const [loading, setLoading] = useState(false);
  const [unapprovedFacultyDetails, setUnapprovedFacultyDetails] = useState(() =>
    unapproved?.data?.length > 0 ? unapproved.data : null
  );

  const userDataFromStore = useSelector((state) => state.userState);

  const dispatch = useDispatch();

  useEffect(() => {
    const unsubscribe = async () => {
      dispatch(update(userData));
    };
    return unsubscribe();
  }, [dispatch, userData]);

  const router = useRouter();

  const user = userDataFromStore?.data;
  const loggedInUser = session?.user.uid === user?.uid;
  const currentUser = session?.user.uid === router.query.id;

  const updateUser = async (payload) => {
    if (loading) return;
    setLoading(true);
    const user = await updateuser({ ...payload });
    dispatch(update(user));
    setLoading(false);
    return user;
  };

  const deleteUser = async (id) => {
    if (loading) return;
    setLoading(true);

    const deleteRef = ref(
      storage,
      `images/${userData.data.uid}/profileImg/${userData.data.email}`
    );

    deleteObject(deleteRef)
      .then(async () => {
        setMessage("");
      })
      .catch((err) => setMessage(err));

    const user = await deleteuser(id);
    if (user.hasError) {
      setMessage(user.errorMessage);
    } else {
      setLoading(false);
      router.replace("/dashboard");
    }
    setLoading(false);
  };

  return (
    <div
      className={`min-h-screen w-full bg-slate-50 text-slate-900 antialiased`}>
      <Head>
        <title>welcome {session?.user?.email}</title>
        <link rel="icon" href="/1logo.png" />
      </Head>
      <Navbar />
      <Modal />
      <div className="mx-auto flex h-full w-screen items-center justify-between px-5 md:max-w-screen-2xl md:px-0 xl:max-w-screen-xl">
        <div className="w-full py-5">
          <section className="relative mx-auto flex w-full max-w-screen-md flex-col items-center gap-y-8 gap-x-16 border-[0.2px] bg-white p-11 shadow-sm md:flex-row md:items-start">
            {message && (
              <p className="mb-5 text-center text-sm font-semibold capitalize text-red-500">
                {message}
              </p>
            )}

            {(loggedInUser ||
              session.user.role === UserRole.Admin ||
              (session.user.role === UserRole.Faculty &&
                session.user.isApprovedAsFaculty)) && (
              <button
                onClick={() => setIsEditing((val) => !val)}
                className="absolute top-3 right-3 h-7 cursor-pointer font-bold text-gray-400">
                {isEditing ? (
                  <XIcon className="h-full" />
                ) : (
                  <PencilIcon className="h-full" />
                )}
              </button>
            )}

            <Avatar src={user?.img} height="40" />

            <div className="flex flex-1 flex-col items-start space-y-2">
              {isEditing ? (
                <UserEditForm updateUser={updateUser} />
              ) : (
                <UserDetails />
              )}
              <div className="flex items-center gap-x-4">
                {!isEditing && loggedInUser && (
                  <button
                    onClick={signOut}
                    className="animate-slide-up rounded-md bg-blue-500 p-2 px-3 text-sm uppercase text-white hover:bg-white hover:text-blue-500 hover:ring-2 hover:ring-blue-500">
                    Sign Out
                  </button>
                )}

                {!isEditing &&
                  (session.user.role === UserRole.Admin ||
                    (session.user.role === UserRole.Faculty &&
                      session.user.isApprovedAsFaculty)) && (
                    <button
                      onClick={() => deleteUser(user.uid)}
                      className="animate-slide-up rounded-md bg-red-500 p-2 px-3 text-sm uppercase text-white hover:bg-white hover:text-red-500 hover:ring-2 hover:ring-red-500">
                      Delete User
                    </button>
                  )}
              </div>
            </div>
          </section>

          {session.user.role === UserRole.Faculty &&
            session.user.isApprovedAsFaculty &&
            !isEditing &&
            currentUser && (
              <div className="animate-slide-up">
                <p className="my-10 mx-auto w-full max-w-screen-md text-xl font-medium">
                  Posted By You:
                </p>

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
                    {userClassLinks.data.length > 0 ? (
                      userClassLinks?.data?.map((classLink) => (
                        <ClassLinkItem
                          key={classLink._id}
                          classLink={classLink}
                        />
                      ))
                    ) : (
                      <tr className="grid w-full place-items-center p-5 text-xs md:text-base">
                        <td className="text-3xl font-medium">
                          No Classes Found
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            )}

          {session.user.role === UserRole.Admin &&
            !isEditing &&
            currentUser && (
              <div className="animate-slide-up">
                <p className="my-10 mx-auto w-full max-w-screen-md text-xl font-medium">
                  Approvals Needed for Faculty:
                </p>

                <table className="mx-auto w-full max-w-screen-md table-auto border-[0.2px] bg-white shadow-sm">
                  <thead>
                    <tr className="grid w-full grid-cols-4 justify-items-center bg-gray-100 p-5 text-xs md:text-base">
                      <th className="col-span-1 capitalize">uid</th>
                      <th className="col-span-1 capitalize">branch</th>
                      <th className="col-span-1 capitalize">email</th>
                      <th className="col-span-1 capitalize">Action</th>
                    </tr>
                  </thead>
                  <tbody className="">
                    {unapprovedFacultyDetails !== null ||
                    unapprovedFacultyDetails?.length > 0 ? (
                      unapprovedFacultyDetails.map((faculty, i) => (
                        <tr
                          key={i}
                          className="grid w-full grid-cols-4 place-items-center justify-items-center p-5 text-xs md:text-base">
                          <td className="col-span-1 text-xs">{faculty.uid}</td>
                          <td className="col-span-1 text-xs">
                            {faculty.branch}
                          </td>
                          <td className="col-span-1 overflow-hidden text-xs uppercase">
                            {faculty.email}
                          </td>
                          <td className="col-span-1 text-xs">
                            <button
                              onClick={() => {
                                updateUser({
                                  uid: faculty.uid,
                                  isApprovedAsFaculty: true
                                }).then(() => {
                                  const rest = unapprovedFacultyDetails.filter(
                                    (fac) => fac.uid !== faculty.uid
                                  );
                                  setUnapprovedFacultyDetails(rest);
                                });
                              }}
                              className="authButton">
                              Approve
                            </button>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr className="grid w-full place-items-center p-5 text-xs md:text-base">
                        <td className="text-3xl font-medium">
                          No Faculty profiles found
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            )}
        </div>
      </div>
    </div>
  );
}

export default Profile;

export async function getServerSideProps(ctx) {
  const session = await getSession(ctx);
  const user = await getuser(ctx.query.id);
  const userClassLinks = await getUserClassLinks(ctx.query.id);
  const unapprovedFacultyDetails = await getUnapprovedFacultyDetails();

  if (user.hasError) {
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
      userData: user,
      userClassLinks,
      unapprovedFacultyDetails
    }
  };
}
