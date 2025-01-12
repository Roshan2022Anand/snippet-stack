import { FaArrowRight } from "react-icons/fa";
import UserProfileForm from "../../components/user-profile-components/UserProfileForm";
import SignOut from "../../components/user-profile-components/SignOut";
import InfiniteScrolling from "../../components/utility-components/InfiniteScrolling";
import PostCard from "../../components/post-components/PostCard";
import { hapiApi } from "../../utils/utility";
import { useEffect, useState } from "react";
import { PostInfoType, UserType } from "../../utils/types";
import { Link } from "react-router-dom";
import {
  PostContainerSkeliton,
  UserProfileSkeliton,
} from "../../components/utility-components/Skelitons";

const Profile = () => {
  const [session, setsession] = useState<UserType>();
  const [posts, setposts] = useState<PostInfoType[]>();

  const getUser = async () => {
    const authRes = await hapiApi.get("/api/auth");
    setsession(authRes.data.user);
  };
  getUser();

  //to get the post related to users
  useEffect(() => {
    const getUserPost = async () => {
      if (!session) return;
      const postRes = await hapiApi.get("/api/alluserposts", {
        params: { userID: session.user_id, lastID: 0 },
      });
      setposts(postRes.data.posts);
    };

    getUserPost();
  }, [session]);

  return (
    <>
      {session && (
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
            <h1>Your Profile</h1>
            <div className="w-[90%] max-w-[800px] flex">
              {session ? (
                <>
                  <UserProfileForm session={session} />
                  <SignOut />
                </>
              ) : (
                <UserProfileSkeliton />
              )}
            </div>
          </section>
        </header>
      )}
      <main className="grid grid-cols-1 lg:grid-cols-2 gap-2 px-2 w-[95vw] max-w-[1250px] mx-auto">
        {posts && session ? (
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
                userID={session.user_id}
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
export default Profile;
