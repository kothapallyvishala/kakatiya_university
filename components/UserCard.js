import Image from "next/image";
import { useRouter } from "next/router";

function UserCard({ userType, img, path }) {
  const router = useRouter();
  return (
    <div className="userCard group">
      <div className="authCard">
        <h3 className="text-2xl font-semibold">{userType}</h3>
        <div className="userImage">
          <Image className="object-contain" src={img} alt="" layout="fill" />
        </div>
      </div>
      <div className="userCardHidden">
        <div className="flex flex-col space-y-5">
          <button className="authButton" onClick={() => router.push("/login")}>
            Sign In
          </button>
          <button className="authButton" onClick={() => router.push(path)}>
            Register
          </button>
        </div>
      </div>
    </div>
  );
}

export default UserCard;
