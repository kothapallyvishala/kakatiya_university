import { getSession } from "next-auth/react";
import ShowAssignment from "../../../components/ShowAssignment";
import ShowSubmission from "../../../components/ShowSubmission";
import { getAssignment } from "../../../utils/request";

function Assignment({ assignment }) {
  return assignment.isSubmission ? (
    <ShowSubmission submission={assignment.submissions[0]} />
  ) : (
    <ShowAssignment assignment={assignment} />
  );
}

export default Assignment;

export async function getServerSideProps(ctx) {
  const session = await getSession(ctx);
  const assignment = await getAssignment(ctx.query.id, ctx.query.submission);

  if (assignment.hasError) {
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
    props: { session, assignment: assignment.data }
  };
}
