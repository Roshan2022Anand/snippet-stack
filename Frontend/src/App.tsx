import React, { useEffect, useState } from "react";
import { PostInfoType } from "./utils/types";
import { hapiApi } from "./utils/utility";
import { UserType } from "./utils/types";
import { FaSearch } from "react-icons/fa";
import NavBar from "./components/NavBar";
import InfiniteScrolling from "./components/utility-components/InfiniteScrolling";
import PostCard from "./components/post-components/PostCard";
import { ImCross } from "react-icons/im";
import {
  NavSkeliton,
  PostContainerSkeliton,
} from "./components/utility-components/Skelitons";

const App = () => {
  // const navigate = useNavigate();
  const queryRef = React.useRef<HTMLInputElement>(null);

  //all states
  const [session, setSession] = useState<UserType>();
  const [posts, setPosts] = useState<PostInfoType[] | null>(null);
  const [query, setquery] = useState<string>();
  const [loading, setloading] = useState(true);
  const [postLoading, setpostLoading] = useState(false);

  //to fetch user data
  const getSessionData = async () => {
    try {
      const res = await hapiApi.get("/api/auth");
      const fetchedSession = res.data.user;
      setSession(fetchedSession);
    } catch (err) {
      console.log("Error fetching session:", err);
    }
    setloading(false);
  };
  getSessionData();

  //to fetch posts
  useEffect(() => {
    const getPots = async () => {
      try {
        const res = await hapiApi.get("/api/allposts", {
          params: { query, lastID: 0 },
        });
        const fetchedPosts = res.data.posts;
        setPosts(fetchedPosts);
      } catch (err) {
        console.log("Error fetching posts:", err);
      }
      setpostLoading(false);
    };
    if (session) {
      setpostLoading(true);
      getPots();
    }
  }, [session, query]);

  return (
    <>
      <header className="w-full">
        {loading ? <NavSkeliton /> : <NavBar session={session} />}
        <section className="heading">
          <h1>Find Programming insights here</h1>
          <section className="search-form mx-auto flex w-1/2 max-w-[350px] items-center gap-1 rounded-lg border-2 border-accentPrimary bg-bgPrimary px-2 py-1">
            <input
              type="text"
              className="bg-transparent text-accentPrimary focus:outline-none grow"
              ref={queryRef}
              placeholder="Search..."
              value={query}
              onChange={(e) => setquery(e.target.value)}
            />
            {query && (
              <button className="btn-accent-one" onClick={() => setquery("")}>
                <ImCross />
              </button>
            )}
            <button
              className="btn-accent-one"
              onClick={() => {
                setquery(queryRef.current?.value);
              }}
            >
              <FaSearch />
            </button>
          </section>
        </section>
      </header>
      {postLoading ? (
        <PostContainerSkeliton />
      ) : posts && session ? (
        <main>
          {posts.length === 0 ? (
            <div className="md-bold-text w-full text-center text-textPrimary">
              No Posts Found
            </div>
          ) : (
            <>
              {query && (
                <h2 className="md-bold-text flex gap-2 pl-5 w-[95vw] max-w-[1250px]">
                  Search result
                  <p className="text-accentPrimary font-bold"> {query}</p>
                </h2>
              )}
              <section className="grid grid-cols-1 lg:grid-cols-2 gap-2 px-2 w-[95vw] max-w-[1250px] mx-auto">
                {posts.map((post, index) => (
                  <PostCard
                    key={`initial-${index}`}
                    post={post}
                    authUserID={session.user_id}
                  />
                ))}
                <InfiniteScrolling
                  prevID={posts[posts.length - 1].post_id}
                  query={query}
                  authUserID={session.user_id}
                />
              </section>
            </>
          )}
        </main>
      ) : (
        <h3 className="text-center font-bold text-[4vw]">
          Please Login To see the posts
        </h3>
      )}
    </>
  );
};

export default App;
