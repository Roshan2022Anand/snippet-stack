import { useInView } from "react-intersection-observer";
import { useEffect, useState } from "react";
import { PostContainerSkeliton } from "./Skelitons";
import PostCard from "../post-components/PostCard";
import { PostInfoType } from "../../utils/types";
import { hapiApi } from "../../utils/utility";

const InfiniteScrolling = ({
  prevID,
  query,
  userID,
  authUserID,
}: {
  prevID: number;
  query?: string;
  userID?: number;
  authUserID?: number;
}) => {
  const { ref, inView } = useInView();
  const [lastID, setLastID] = useState<number>(prevID);
  const [allPosts, setAllPosts] = useState<PostInfoType[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    // Function to show more posts
    const showMorePosts = async () => {
      let posts: PostInfoType[] = [];
      try {
        if (userID) {
          // Get the posts based userID (for profile page)
          const res = await hapiApi.get("/api/alluserposts", {
            params: { userID, lastID },
          });
          posts = res.data.posts;
        } else {
          // Get the posts based on query (for search page)
          const res = await hapiApi.get("/api/allposts", {
            params: { query, lastID },
          });
          posts = res.data.posts;
        }

        // If no posts are found, stop the loader
        if (posts.length === 0) {
          setLoading(false);
          return;
        }
        setAllPosts((prevPosts) => [...prevPosts, ...posts]);
      } catch (err) {
        console.log(err);
        setLoading(false);
      }
      setLastID(posts[posts.length - 1].post_id);
    };

    //triggered when the loader is in view
    if (inView) {
      showMorePosts();
    }
    /* eslint-disable react-hooks/exhaustive-deps */
  }, [inView]);
  return (
    <>
      {allPosts.map((post, index) => (
        <PostCard key={index} post={post} authUserID={authUserID} />
      ))}
      {loading ? (
        <div ref={ref}>
          <PostContainerSkeliton />
        </div>
      ) : (
        <div className="my-3 h-10 w-[90vw] mx-auto text-center text-accentPrimary font-bold text[20px]">
          No more posts to show
        </div>
      )}
    </>
  );
};

export default InfiniteScrolling;
