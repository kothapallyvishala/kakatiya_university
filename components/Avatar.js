/* eslint-disable @next/next/no-img-element */
import { CameraIcon, UserCircleIcon } from "@heroicons/react/solid";
import { useDispatch } from "react-redux";
import { toggle } from "../redux/modalSlice";

function Avatar({ src = null, height = 11 }) {
  const dispatch = useDispatch();
  // const isOpen = useSelector((state) => state.modalState.isOpen);

  const uploadPhoto = () => {
    dispatch(toggle());
  };

  return (
    <div
      className={`grid place-items-center h-${height} w-${height} group relative overflow-hidden rounded-full bg-white ring-4 ring-indigo-500`}>
      {src ? (
        <img
          className="h-full rounded-full object-cover object-top brightness-110"
          src={src}
          alt=""
        />
      ) : (
        <UserCircleIcon className="h-full" />
      )}
      {/* <div className="absolute inset-0 backdrop-blur-sm z-0">
        <img
          className="h-full object-cover object-center"
          src={src || "/avatar.png"}
          alt=""
        />
      </div> */}
      <button
        onClick={uploadPhoto}
        className="absolute inset-0 grid place-items-center bg-black/50 opacity-0 group-hover:cursor-pointer group-hover:opacity-100">
        <div className="h-16 rounded-full bg-black/10 p-3">
          <CameraIcon className="h-full text-white" />
        </div>
      </button>
    </div>
  );
}

export default Avatar;
