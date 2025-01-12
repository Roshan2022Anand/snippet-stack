import { IoMdAdd } from "react-icons/io";
import { FaUserAlt } from "react-icons/fa";
import { UserType } from "../utils/types";
import { Link } from "react-router-dom";

export default function NavBar({ session }: { session?: UserType }) {
  return (
    <section className="nav-bar">
      <div className="font-bold text-accentPrimary">Snippet Stack</div>
      <nav className="flex w-1/2 justify-end gap-3">
        {session ? (
          <>
            <Link to="/create">
              <button className="btn-accent-one flex size-[6vw] max-w-[50px] max-h-[50px] items-center justify-center">
                <IoMdAdd className="size-full" />
              </button>
            </Link>

            <Link
              to={`/profile`}
              className="rounded-md border-2 border-accentPrimary size-[6vw] max-w-[50px] max-h-[50px] overflow-hidden"
            >
              {session.pic && session.pic !== "null" ? (
                <img
                  src={`${session.pic}`}
                  alt="user"
                  className="object-cover object-top size-full"
                />
              ) : (
                <p className="size-full bg-accentPrimary text-bgPrimary text-center content-center">
                  {session.fname}
                </p>
              )}
            </Link>
          </>
        ) : (
          <>
            <Link to="/signup">
              <button className="btn-accent-one flex size-[6vw] max-w-[50px] max-h-[50px] items-center justify-center">
                <FaUserAlt className="size-full" />
              </button>
            </Link>
          </>
        )}
      </nav>
    </section>
  );
}
