import { Link } from "react-router-dom";
import CreatePostForm from "../../components/post-components/CreatePostForm";
import { FaArrowRightFromBracket } from "react-icons/fa6";

const Create = () => {
  return (
    <>
      <header>
        <nav className="nav-bar">
          <div className="font-bold text-accentPrimary">Snippet Stack</div>
          <button className="btn-accent-one h-2/3">
            <Link to="/">
              <FaArrowRightFromBracket className="size-full" />
            </Link>
          </button>
        </nav>
        <section className="heading">
          <h1>Create Your post</h1>
        </section>
      </header>
      <CreatePostForm />;
    </>
  );
};
export default Create;
