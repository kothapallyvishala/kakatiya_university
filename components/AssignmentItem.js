import moment from "moment";
import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import { UserRole } from "../models/User";

function AssignmentItem({ assignment }) {
  const { _id, title, createdAt, desc, postedBy, submissions } = assignment;
  const { data: session } = useSession();

  const router = useRouter();

  return (
    <li className="">
      <details
        className="w-full rounded-lg p-6 open:bg-white open:shadow-lg open:ring-1 open:ring-black/5 dark:open:bg-slate-900 dark:open:ring-white/10"
        open>
        <summary className="cursor-pointer select-none text-sm font-semibold capitalize leading-6 text-slate-900 dark:text-white">
          {title}
        </summary>
        <div className="mt-3 flex items-start justify-between gap-x-4 text-sm leading-6 text-slate-600 dark:text-slate-400">
          <div className="flex flex-1 flex-col space-y-2">
            <p className="capitalize">{desc}</p>
            <p className="text-xs opacity-50">
              {submissions.length} submissions
            </p>
            <div className="flex space-x-2">
              <button
                onClick={() => router.push(`/assignments/${_id}`)}
                className="rounded-md bg-blue-500 p-1 px-3 text-sm uppercase text-white transition-all duration-300 hover:bg-white hover:text-blue-500 hover:ring-[1.4px] hover:ring-blue-500">
                Visit
              </button>
              {session.user.role === UserRole.Student && (
                <button
                  onClick={() =>
                    router.push(`/assignments/${_id}/submitAssignment`)
                  }
                  className="rounded-md bg-blue-500 p-1 px-3 text-sm uppercase text-white transition-all duration-300 hover:bg-white hover:text-blue-500 hover:ring-[1.4px] hover:ring-blue-500">
                  Submit Assignment
                </button>
              )}
            </div>
          </div>
          <div className="hidden flex-col items-end space-y-2 text-xs text-slate-600 md:flex">
            <p className="text-slate-800">{moment(createdAt).format("llll")}</p>

            <p className="text-slate-800">By {postedBy.name || postedBy.uid}</p>
          </div>
        </div>
      </details>
    </li>
  );
}

export default AssignmentItem;
