import { FaPen, FaUser } from "react-icons/fa";
import { PostInfoType } from "../../utils/types";
import { formatDate } from "../../utils/utility";
import {
  CommentSection,
  DeletePostSection,
  VoteSection,
} from "./PostCardButtons";
import { Link } from "react-router-dom";

const PostCard = ({
  post,
  authUserID,
}: {
  post: PostInfoType;
  authUserID?: number;
}) => {
  return (
    <article
      id={`post-${post.post_id}`}
      className="border-2 border-accentPrimary rounded-lg px-2 py-1 h-[300px] sm:h-[400px] lg:h-[400px]"
    >
      <header className="flex gap-2 h-[15%]">
        <Link
          to={
            authUserID === post.user_id
              ? "/profile"
              : `/view/profile/${post.user_id}`
          }
          className="flex gap-2"
        >
          <div className="border-4 border-accentPrimary rounded-full w-[60px]">
            {post.pic && post.pic !== "null" ? (
              <img
                src={`${post.pic}`}
                alt={`${post.fname}`}
                className="size-full object-cover object-top rounded-full"
              />
            ) : (
              <FaUser className="size-full p-2 text-accentPrimary" />
            )}
          </div>
          <div>
            <h3 className="sm-bold-text">{post.fname}</h3>
            <p className="sm-light-text opacity-85">
              {formatDate(post.created_at)}
            </p>
          </div>
        </Link>
      </header>

      <main className="h-[70%]">
        <Link to={`/view/post/${post.post_id}`} className="size-full flex py-2">
          <section className="w-1/2 h-full">
            <p className="md-bold-text">{post.title}</p>
            <p className="sm-light-text">{post.description}</p>
          </section>
          <section className="w-1/2 h-full rounded-lg overflow-hidden border-2 border-accentPrimary">
            <img
              src={`${post.image}`}
              alt={post.title}
              className="object-cover size-full"
              loading="lazy"
            />
          </section>
        </Link>
      </main>

      <footer className="h-[15%] flex justify-between">
        <section className="flex gap-3 w-1/2 md:w-[30%] lg:w-1/2 h-full">
          <VoteSection post={post} />
          <Link
            className="btn-accent-one flex grow items-end"
            to={`/view/post/${post.post_id}`}
          >
            <CommentSection comments={post.comments} />
          </Link>
        </section>
        <section className="flex items-center">
          {authUserID === post.user_id && (
            <>
              <Link to={`/update/${post.post_id}`} className="btn-accent-one ">
                <FaPen />
              </Link>
              <DeletePostSection postID={post.post_id} imgUrl={post.image} />
            </>
          )}
        </section>
      </footer>
    </article>
  );
};
export default PostCard;
