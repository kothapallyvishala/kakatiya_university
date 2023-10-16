import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import TimeAgo from "timeago-react";

function ClassLinkItem({ classLink }) {
  const [sub, setSub] = useState("");
  const { title, sem, branch, subject, postedBy, createdAt } = classLink;
  const router = useRouter();

  useEffect(() => {
    const unsubscribe = () => {
      const res = subject
        ?.split(" ")
        .map((word) => word[0])
        .join("");
      setSub(res);
    };
    return unsubscribe();
  }, [subject]);

  return (
    <tr className="grid w-full grid-cols-8 justify-items-start p-5 text-xs md:grid-cols-9 md:text-base">
      <button
        onClick={() => router.push(`/dashboard/${classLink._id}`)}
        className="link col-span-3">
        {title}
      </button>
      <td className="col-span-1">{sem}</td>
      <td className="col-span-1">{branch}</td>
      <td className="col-span-1 uppercase">{sub}</td>
      <td className="col-span-1 md:col-span-2">
        {postedBy.name || postedBy.email || postedBy.uid}
      </td>
      <td className="col-span-1 text-xs text-gray-600">
        <TimeAgo datetime={createdAt} />
      </td>
    </tr>
  );
}

export default ClassLinkItem;
