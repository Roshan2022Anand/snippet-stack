import { FaArrowRightFromBracket } from "react-icons/fa6";
import { Link, useParams } from "react-router-dom";
import CreatePostForm from "../../components/post-components/CreatePostForm";

const Update = () => {
  const { id } = useParams();

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
          <h1>Update Your post</h1>
        </section>
      </header>
      <CreatePostForm id={id} />
    </>
  );
};

export default Update;
