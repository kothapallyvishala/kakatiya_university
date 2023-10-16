import { CameraIcon, DocumentAddIcon } from "@heroicons/react/outline";
import { getDownloadURL, ref, uploadBytesResumable } from "firebase/storage";
import { getSession, useSession } from "next-auth/react";
import { useRouter } from "next/router";
import { useRef, useState } from "react";
import { UserRole } from "../../../models/User";
import { storage } from "../../../utils/firebase";
import { updateAssignment } from "../../../utils/request";

function SubmitAssignment() {
  const [desc, setDesc] = useState("");
  const [img, setImg] = useState(null);
  const [pdf, setPdf] = useState(null);

  const [progress, setProgress] = useState(0);
  const [errorMessage, setErrorMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const { data: session } = useSession();

  const imgPickerRef = useRef(null);
  const pdfPickerRef = useRef(null);

  const addImgToPost = (e) => {
    if (e.target.files[0]) {
      setImg(e.target.files[0]);
    }
  };

  const addPdfToPost = (e) => {
    if (e.target.files[0]) {
      setPdf(e.target.files[0]);
    }
  };

  const submitassignment = async (e) => {
    e.preventDefault();
    if (loading) return;
    setLoading(true);

    const submissionData = {
      uid: session.user.uid,
      desc,
      img: { name: null, url: null },
      pdf: { name: null, url: null }
    };

    await Promise.all([
      img &&
        new Promise((resolve, reject) => {
          const imgName = img.name.trim().toLowerCase();
          const imgRef = ref(
            storage,
            `AssignmentSubmissions/AssignmentImages/${session?.user.uid}/${router.query.id}/${imgName}`
          );
          const uploadTask = uploadBytesResumable(imgRef, img);

          uploadTask.on(
            "state_changed",
            (snapshot) => {
              const prog =
                (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
              setProgress(prog);
            },
            (err) => reject(err),
            () => {
              getDownloadURL(uploadTask.snapshot.ref).then((url) => {
                submissionData.img = { name: imgName, url };
                resolve();
              });
            }
          );
        }),

      pdf &&
        new Promise((resolve, reject) => {
          const pdfName = pdf.name.trim().toLowerCase();
          const pdfRef = ref(
            storage,
            `AssignmentSubmissions/AssignmentPdfs/${session?.user.uid}/${router.query.id}/${pdfName}`
          );
          const uploadTask = uploadBytesResumable(pdfRef, pdf);

          uploadTask.on(
            "state_changed",
            (snapshot) => {
              const prog =
                (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
              setProgress(prog);
            },
            (err) => reject(err),
            () => {
              getDownloadURL(uploadTask.snapshot.ref).then((url) => {
                submissionData.pdf = { name: pdfName, url };
                resolve();
              });
            }
          );
        })
    ]);

    const payload = {
      id: router.query.id,
      submissionData
    };

    const assignment = await updateAssignment(payload);

    if (assignment.hasError) {
      typeof assignment.errorMessage === "string"
        ? setErrorMessage(assignment.errorMessage)
        : setErrorMessage("Something went wrong");
    } else {
      setErrorMessage("");
      setDesc("");
      setImg(null);
      setPdf(null);
      setProgress(0);
      setLoading(false);
      router.push("/assignments");
    }
    setLoading(false);
  };

  return (
    <div className="grid min-h-screen place-items-center bg-submitAssignment bg-cover bg-bottom">
      <form
        className="relative mx-5 flex flex-col space-y-5 rounded-md bg-white p-11 shadow-md md:w-1/2 xl:w-1/3 2xl:w-1/4"
        onSubmit={submitassignment}>
        <h1 className="mb-5 text-center text-4xl font-thin">
          Submit Assignment
        </h1>
        {errorMessage && (
          <p className="mb-5 text-center text-sm font-semibold capitalize text-red-500">
            {errorMessage}
          </p>
        )}
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
          accept="image/*"
          ref={imgPickerRef}
          onChange={addImgToPost}
          hidden
        />
        <input
          type="file"
          accept=".pdf"
          ref={pdfPickerRef}
          onChange={addPdfToPost}
          hidden
        />
        <div className="grid w-full grid-cols-2">
          {!img ? (
            <button
              type="button"
              onClick={() => imgPickerRef.current.click()}
              className="mx-auto grid h-11 w-11 cursor-pointer place-items-center rounded-full bg-red-100 outline-none transition-all hover:scale-105 focus:scale-125 focus:shadow-lg">
              <div className="h-7 w-7">
                <CameraIcon className="h-full text-red-600" />
              </div>
            </button>
          ) : (
            <button
              type="button"
              className="link cursor-pointer"
              onClick={() => setImg(null)}>
              {img.name}
            </button>
          )}
          {!pdf ? (
            <button
              type="button"
              onClick={() => pdfPickerRef.current.click()}
              className="mx-auto grid h-11 w-11 cursor-pointer place-items-center rounded-full bg-red-100 outline-none transition-all hover:scale-105 focus:scale-125 focus:shadow-lg">
              <div className="h-7 w-7">
                <DocumentAddIcon className="h-full text-red-600" />
              </div>
            </button>
          ) : (
            <button
              type="button"
              className="link cursor-pointer"
              onClick={() => setPdf(null)}>
              {pdf.name}
            </button>
          )}
        </div>

        {session.user.role === UserRole.Student && (
          <button className="authButton" type="submit">
            Submit Assignment
          </button>
        )}
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

export default SubmitAssignment;

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

  if (session.user.isFacuty) {
    return {
      redirect: {
        destination: "/assignments",
        permanent: false
      }
    };
  }

  return {
    props: { session }
  };
}
