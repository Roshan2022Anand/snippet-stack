"use client";
import React, { useEffect, useState } from "react";
import MDEditor from "@uiw/react-md-editor";
import { z } from "zod";
import { toast } from "react-toastify";
import { AxiosResponse } from "axios";
import { PostFormSkeliton } from "../utility-components/Skelitons";
import { PostInfoType } from "../../utils/types";
import { fileToImageUrl, hapiApi } from "../../utils/utility";
import { deleteImage, uploadImage } from "../../utils/supabaseStorage";
import { PostFormValidation } from "../../utils/validations";
import { useNavigate } from "react-router-dom";

//post form type
type postFormType = {
  title: string;
  description: string;
  image: string;
  category: string;
  about: string;
};

const CreatePostForm = ({ id }: { id?: string }) => {
  const navigate = useNavigate();
  //All the states
  const [postImage, setpostImage] = useState<string | null>(null);
  const [about, setAbout] = useState("");
  const [formError, setFormError] = useState<{
    title?: string;
    description?: string;
    about?: string;
  }>({});
  const [isPending, setisPending] = useState<boolean>(false);
  const [postData, setpostData] = useState<PostInfoType>();

  //if id is present then get the post data to update
  useEffect(() => {
    const getPostData = async () => {
      const res = await hapiApi.get("/api/post", {
        params: { postId: id },
      });
      setpostData(res.data.postData);
      setpostImage(res.data.postData.image);
      setAbout(res.data.postData.about);
    };
    if (id) getPostData();
  }, [id]);

  //function to send api req to create a post
  const createPostApiReq = async (postForm: postFormType) => {
    try {
      const res: AxiosResponse<{ message: string }> = await hapiApi.post(
        "/api/post",
        { postForm }
      );
      return { message: res.data.message };
    } catch (err) {
      console.log(err);
      return { error: "Something went wrong, Please try again later" };
    }
  };

  //function to send api req to update a post
  const updatePostApiReq = async (postForm: postFormType) => {
    try {
      const res: AxiosResponse<{ message: string }> = await hapiApi.put(
        "/api/post",
        { postForm, id }
      );
      return { message: res.data.message };
    } catch (err) {
      console.log(err);
      return { error: "Something went wrong, Please try again later" };
    }
  };

  //function to submit the post
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    setisPending(true);
    setFormError({});
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const imageFile = formData.get("image") as File;
    const imgUrl =
      imageFile.size > 0 ? await uploadImage(imageFile) : postImage;

    if (imageFile.size > 0 && postData) await deleteImage([postData.image]);

    //creating post object
    const postForm = {
      title: formData.get("title") as string,
      description: formData.get("desc") as string,
      image: imgUrl as string,
      category: formData.get("category") as string,
      about,
    };

    try {
      //validating the post object
      await PostFormValidation.parseAsync(postForm);

      // sending the post request
      const { message, error }: { message?: string; error?: string } = id
        ? await updatePostApiReq(postForm)
        : await createPostApiReq(postForm);

      if (message) {
        toast.success(message);
        navigate("/");
      } else if (error) toast.error(error);
    } catch (err) {
      //handling the error by setting the form error state given by the zod error
      if (err instanceof z.ZodError)
        err.errors.map((errObj) => {
          setFormError((prev) => {
            return { ...prev, [errObj.path[0]]: errObj.message };
          });
        });
    } finally {
      setisPending(false);
    }
  };

  return (
    <>
      {id && !postData ? (
        <PostFormSkeliton />
      ) : (
        <form
          onSubmit={handleSubmit}
          className="create-form flex flex-col w-[90%] max-w-[900px] mx-auto"
        >
          <label htmlFor="title">Title:</label>
          <input
            defaultValue={id ? postData?.title : ""}
            name="title"
            className="input-field"
            type="text"
            maxLength={45}
            placeholder="eg:How to use for loop.."
            required
          />
          {formError.title && <p className="text-red-500">{formError.title}</p>}

          <label htmlFor="desc">Description:</label>
          <textarea
            defaultValue={id ? postData?.description : ""}
            name="desc"
            className="input-field"
            placeholder="eg:This is a tutorial on how to use for loop in JavaScript"
            required
          />
          {formError.description && (
            <p className="text-red-500">{formError.description}</p>
          )}

          <label htmlFor="image">Poster:</label>
          {postImage && (
            <img
              src={`${postImage}`}
              alt="image"
              className="size-[10vw] object-cover"
            />
          )}
          <input
            name="image"
            id="image"
            className="input-field"
            type="file"
            accept="image/*"
            onChange={(e) => {
              const url = fileToImageUrl(e);
              setpostImage(url);
            }}
            required={!id}
          />

          <label htmlFor="category">Choose The Tech:</label>
          <input
            defaultValue={id ? postData?.category : ""}
            name="category"
            className="input-field"
            type="text"
            placeholder="eg:JavaScript"
            required
          />

          <div data-color-mode="light">
            <label htmlFor="about">Detailed Explanation:</label>
            <MDEditor
              value={about}
              onChange={(value?: string) => setAbout(value as string)}
              id="about"
              preview="edit"
              height={300}
              className="input-field"
              textareaProps={{
                placeholder: "Write a detailed explanation of the query",
              }}
              previewOptions={{ disallowedElements: ["style"] }}
            />
          </div>
          {formError.about && <p className="text-red-500">{formError.about}</p>}

          <button
            type="submit"
            className="w-full my-5 rounded-lg bg-accentPrimary p-1 px-5 border-2 border-textPrimary text-bgPrimary font-bold"
          >
            {isPending
              ? id
                ? "Updating the Post ..."
                : "Submiting the Post ...."
              : id
              ? "Update"
              : "Create"}
          </button>
        </form>
      )}
    </>
  );
};

export default CreatePostForm;
