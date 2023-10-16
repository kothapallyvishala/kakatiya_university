import Head from "next/head";
import Header from "../components/Header";
import UserCard from "../components/UserCard";

export default function Home() {
  return (
    <div className="overflow-hidden bg-slate-50 text-slate-900 antialiased md:min-h-screen">
      <Head>
        <title>Kakatiya University</title>
        <link rel="icon" href="/1logo.png" />
      </Head>

      <Header />

      <main className="m-11 mx-auto flex max-w-screen-xl flex-col justify-around space-y-11 md:mt-32 md:flex-row md:space-y-0">
        <UserCard userType="Student" img="/student.jpg" path="/register" />
        <UserCard
          userType="Faculty"
          img="/faculty.jpg"
          path="/facultyRegister"
        />
      </main>
    </div>
  );
}
