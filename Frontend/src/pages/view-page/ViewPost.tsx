import { FaArrowRight, FaUser } from "react-icons/fa";
import MarkdownIt from "markdown-it";
import { VoteSection } from "../../components/post-components/PostCardButtons";
import CommentsBox from "../../components/post-components/CommentsBox";
import { Link, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { PostInfoType } from "../../utils/types";
import { formatDate, hapiApi } from "../../utils/utility";
import { ViewPostSkeliton } from "../../components/utility-components/Skelitons";
const ViewPost = () => {
  const { postId } = useParams();

  const [postData, setpostData] = useState<PostInfoType>();

  useEffect(() => {
    const getPost = async () => {
      //fetching the post based on postId
      const res = await hapiApi.get("/api/post", {
        params: { postId },
      });
      setpostData(res.data.postData);
    };
    getPost();
  }, [postId]);

  if (!postData) return <ViewPostSkeliton />;

  //parsing the markdown content
  const md = new MarkdownIt();
  const htmlOutput = md.render(postData.about);

  return (
    <>
      <header className="flex w-full flex-col">
        <nav className="nav-bar">
          <div className="font-bold text-accentPrimary">Snippet Stack</div>
          <Link to="/">
            <button className="btn-accent-one flex size-[6vw] max-w-[50px] max-h-[50px] items-center justify-center">
              <FaArrowRight />
            </button>
          </Link>
        </nav>

        <section className="heading">
          <div className="w-[80%] max-w-[1000px] lg:flex flex-row-reverse justify-around gap-1">
            <article className="flex lg:flex-col-reverse lg:justify-evenly lg:w-1/2 justify-between p-1 backdrop-blur-[5px]">
              <div>
                <p className="w-fit bg-accentPrimary px-2 py-1 text-bgPrimary">
                  {formatDate(postData.created_at)}
                </p>
                <h2 className="md-bold-text">{postData.title}</h2>
                <p className="sm-light-text">{postData.description}</p>
              </div>

              {/* user profile */}
              <div className="w-1/2 flex items-start justify-end lg:flex-row-reverse gap-2">
                <p className="font-bold text-[30px]">{postData.fname}</p>
                <div className="overflow-hidden rounded-full size-[70px] border-2 border-accentPrimary">
                  {postData.pic && postData.pic !== "null" ? (
                    <img
                      src={`${postData.pic}`}
                      alt={`${postData.fname}`}
                      className="object-cover size-full"
                    />
                  ) : (
                    <FaUser className="size-full bg-accentPrimary p-2" />
                  )}
                </div>
              </div>
            </article>
            <div className="bg-bgPrimary size-full lg:size-[400px]  border-2 border-accentPrimary rounded-md overflow-hidden">
              <img
                src={`${postData.image || "#"}`}
                alt={postData.title}
                className="object-cover size-full"
              />
            </div>
          </div>
        </section>
      </header>

      <main className="px-3 rounded-md mx-auto w-[85%] max-w-[800px]">
        {htmlOutput && (
          <article
            className="prose markdown-body"
            dangerouslySetInnerHTML={{ __html: htmlOutput }}
          ></article>
        )}
      </main>

      <footer className="w-[85%] mx-auto max-w-[800px] px-2">
        <section className="flex gap-3 w-1/2 h-[70px] my-2">
          <VoteSection post={postData} />
          <div className="grow"></div>
          {/* <ViewsSection views={postData.views} /> */}
        </section>
        {/* comment section */}
        <CommentsBox postID={postData.post_id} />
      </footer>
    </>
  );
};
export default ViewPost;
