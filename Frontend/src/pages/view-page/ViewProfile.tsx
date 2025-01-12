import { useEffect, useState } from "react";
import { FaArrowRight, FaUser } from "react-icons/fa";
import { Link, useParams } from "react-router-dom";
import InfiniteScrolling from "../../components/utility-components/InfiniteScrolling";
import PostCard from "../../components/post-components/PostCard";
import { PostInfoType, UserType } from "../../utils/types";
import { hapiApi } from "../../utils/utility";
import {
  PostContainerSkeliton,
  UserProfileSkeliton,
} from "../../components/utility-components/Skelitons";

const ViewProfile = () => {
  const { userID } = useParams();

  const [posts, setposts] = useState<PostInfoType[]>();
  const [user, setuser] = useState<UserType>();
  const [session, setsession] = useState<UserType>();

  //to get the data of the selected user
  const getUserData = async () => {
    const otherUserRes = await hapiApi.get("/api/user", {
      params: { userID },
    });
    setuser(otherUserRes.data.user);
  };

  //to get the session data
  const getSessionData = async () => {
    const authRes = await hapiApi.get("/api/auth");
    setsession(authRes.data.user);
  };
  getSessionData();
  getUserData();

  useEffect(() => {
    const getUserPost = async () => {
      if (!user) return;
      const postRes = await hapiApi.get("/api/alluserposts", {
        params: { userID: user.user_id, lastID: 0 },
      });
      setposts(postRes.data.posts);
    };
    getUserPost();
  }, [user]);

  return (
    <>
      <header className="flex w-full flex-col">
        <nav className="nav-bar">
          <div className="font-bold text-accentPrimary">Snippet Stack</div>
          <button className="btn-accent-one">
            <Link to="/">
              <FaArrowRight />
            </Link>
          </button>
        </nav>

        <section className="heading">
          <h1>{user?.fname} Profile</h1>
          {user ? (
            <article className="w-1/2  flex gap-2 justify-around">
              <div className="bg-accentPrimary rounded-xl h-[100px] p-1 overflow-hidden">
                {user.pic && user.pic !== "null" ? (
                  <img
                    src={`${user.pic}`}
                    alt="image"
                    className="size-full rounded-xl"
                  />
                ) : (
                  <FaUser />
                )}
              </div>
              <div className="grow">
                <p className="border-b-2 border-accentPrimary w-fit text-[25px] font-bold">
                  {user.fname}
                </p>
                <p className="text-[10px]">{user.bio}</p>
              </div>
            </article>
          ) : (
            <UserProfileSkeliton />
          )}
        </section>
      </header>
      <main className="grid grid-cols-1 lg:grid-cols-2 gap-2 px-2 w-[95vw] max-w-[1250px] mx-auto">
        {posts && user && session ? (
          posts.length > 0 ? (
            <>
              {posts.map((post, index) => (
                <PostCard
                  key={`post-${index}`}
                  post={post}
                  authUserID={session.user_id}
                />
              ))}
              <InfiniteScrolling
                prevID={posts[posts.length - 1].post_id}
                userID={user.user_id}
                authUserID={session.user_id}
              />
            </>
          ) : (
            <p className="w-screen text-center font-bold text-[2vw]">
              no post found
            </p>
          )
        ) : (
          <PostContainerSkeliton />
        )}
      </main>
    </>
  );
};
export default ViewProfile;
