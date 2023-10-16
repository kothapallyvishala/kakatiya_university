import { VideoCameraIcon } from "@heroicons/react/outline";
import { getDownloadURL, ref, uploadBytesResumable } from "firebase/storage";
import { getSession, useSession } from "next-auth/react";
import { useRouter } from "next/router";
import { useEffect, useRef, useState } from "react";
import { getSubjects } from "../../utils/common";
import { storage } from "../../utils/firebase";
import { postClass } from "../../utils/request";

function AddClass() {
  const [subjectsList, setSubjectsList] = useState({});
  const [title, setTitle] = useState("");
  const [desc, setDesc] = useState("");
  const [video, setVideo] = useState(null);
  const [year, setYear] = useState("");
  const [sem, setSem] = useState("");
  const [branch, setBranch] = useState("");
  const [subject, setSubject] = useState("");
  const [progress, setProgress] = useState(0);
  const [errorMessage, setErrorMessage] = useState(false);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const { data: session } = useSession();

  const filePickerRef = useRef(null);

  useEffect(() => {
    const unsubscribe = () => {
      const subjectsSet = getSubjects();

      setSubjectsList(subjectsSet);
    };
    return unsubscribe();
  }, []);

  const addVideoToPost = (e) => {
    if (e.target.files[0]) {
      setVideo(e.target.files[0]);
    }
  };

  const addClassLink = (e) => {
    e.preventDefault();
    if (loading) return;
    setLoading(true);
    const videoName = video.name.trim().toLowerCase();

    const videoRef = ref(
      storage,
      `videos/${session?.user.uid}/${sem}/${branch}/${subject}/${videoName}`
    );
    const uploadTask = uploadBytesResumable(videoRef, video);

    // `videos/${session?.user.uid}/${sem}/${branch}/${subject}/${videoName}`

    uploadTask.on(
      "state_changed",
      (snapshot) => {
        const prog = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        setProgress(prog);
      },
      (err) => setErrorMessage(err),
      () => {
        getDownloadURL(uploadTask.snapshot.ref)
          .then(async (url) => {
            const payload = {
              title,
              desc,
              video: { name: videoName, url },
              year,
              sem,
              branch,
              subject,
              postedBy: {
                uid: session.user.uid,
                name: session.user?.name || `${subject} professor`,
                email: session.user.email
              }
            };
            const classLink = await postClass(payload);
            if (classLink.hasError) {
              setErrorMessage(classLink.errorMessage);
            } else {
              setErrorMessage("");
              setTitle("");
              setDesc("");
              setVideo(null);
              setYear("");
              setSem("");
              setBranch("");
              setSubject("");
              setProgress(0);
              setLoading(false);
              router.push("/dashboard");
            }
          })
          .catch(console.error);
      }
    );

    setLoading(false);
  };

  return (
    <div className="grid min-h-screen place-items-center bg-addClass bg-cover bg-center">
      <form
        className="relative mx-5 flex flex-col space-y-5 rounded-md bg-white p-11 shadow-md md:w-1/2 xl:w-1/3 2xl:w-1/4"
        onSubmit={addClassLink}>
        <h1 className="mb-5 text-center text-4xl font-thin">Add Class</h1>
        {errorMessage && (
          <p className="mb-5 text-center text-sm font-semibold capitalize text-red-500">
            {errorMessage}
          </p>
        )}
        <div className="w-full">
          <label htmlFor="title" className="label">
            Title:
          </label>
          <input
            className="input"
            type="text"
            name="title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
        </div>
        <div className="w-full">
          <label htmlFor="desc" className="label">
            Desc:
          </label>
          <input
            className="input"
            type="text"
            name="desc"
            value={desc}
            onChange={(e) => setDesc(e.target.value)}
          />
        </div>
        <input
          type="file"
          accept="video/*"
          ref={filePickerRef}
          onChange={addVideoToPost}
          hidden
        />
        <div className="w-full">
          {!video ? (
            <button
              type="button"
              onClick={() => filePickerRef.current.click()}
              className="mx-auto grid h-11 w-11 cursor-pointer place-items-center rounded-full bg-red-100 outline-none transition-all hover:scale-105 focus:scale-125 focus:shadow-lg">
              <div className="h-7 w-7">
                <VideoCameraIcon className="h-full text-red-600" />
              </div>
            </button>
          ) : (
            <button
              type="button"
              className="link cursor-pointer"
              onClick={() => setVideo(null)}>
              {video.name}
            </button>
          )}
        </div>
        <div className="w-full">
          <label htmlFor="year" className="label">
            Year:
          </label>
          <select
            className="input"
            name="year"
            value={year}
            onChange={(e) => setYear(e.target.value)}>
            <option hidden value=""></option>
            <option value="1st">1st</option>
            <option value="2nd">2nd</option>
            <option value="3rd">3rd</option>
            <option value="4th">4th</option>
          </select>
        </div>
        <div className="w-full">
          <label htmlFor="sem" className="label">
            Semester:
          </label>
          <select
            className="input"
            name="sem"
            value={sem}
            onChange={(e) => setSem(e.target.value)}>
            <option hidden value=""></option>
            <option value="sem1">1st</option>
            <option value="sem2">2nd</option>
            <option value="sem3">3rd</option>
            <option value="sem4">4th</option>
            <option value="sem5">5th</option>
            <option value="sem6">6th</option>
            <option value="sem7">7th</option>
            <option value="sem8">8th</option>
          </select>
        </div>
        <div className="w-full">
          <label htmlFor="branch" className="label">
            Branch:
          </label>
          <select
            className="input"
            name="branch"
            value={branch}
            onChange={(e) => setBranch(e.target.value)}>
            <option hidden value=""></option>
            <option value="cse">CSE</option>
            <option value="it">IT</option>
            <option value="ece">ECE</option>
            <option value="eee">EEE</option>
            <option value="mechanical">MECHANICAL</option>
            <option value="civil">CIVIL</option>
            <option value="mining">MINING</option>
          </select>
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
            {Array?.from(subjectsList)?.map((subject, i) => (
              <option key={i} value={subject}>
                {subject}
              </option>
            ))}
          </datalist>
        </div>
        <button className="authButton" type="submit">
          Add Class
        </button>
        <div className="absolute bottom-0 left-0 right-0 h-3">
          <div className="relative h-full w-full bg-gray-300">
            <div
              style={{ width: `${progress}%` }}
              className={`absolute inset-0 h-full bg-red-600`}
            />
          </div>
        </div>
      </form>
    </div>
  );
}

export default AddClass;

export async function getServerSideProps(context) {
  const session = await getSession(context);

  if (!session) {
    return {
      redirect: {
        destination: "/",
        permanent: false
      }
    };
  }

  return {
    props: { session }
  };
}
