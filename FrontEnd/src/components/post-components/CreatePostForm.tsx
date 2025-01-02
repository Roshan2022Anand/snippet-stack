'use client';
import React, { useState } from 'react';
import Image from 'next/image';
import MDEditor from '@uiw/react-md-editor';
import { z } from 'zod';
import { PostFormValidation } from '@/lib/validations';
import { useRouter } from 'next/navigation';
import { toast } from 'react-toastify';
import { AxiosResponse } from 'axios';
import { uploadImage } from '@/lib/supabaseStorage';
import { fileToImageUrl, hapiApi } from '@/lib/client-utils';

//post form type
type postFormType = {
  title: string;
  description: string;
  image: string;
  category: string;
  about: string;
};

//function to send api req to create a post
export const createPostApiReq = async (postForm: postFormType) => {
  try {
    const res: AxiosResponse<{ message: string }> = await hapiApi.post(
      '/api/post',
      { postForm }
    );
    return { message: res.data.message };
  } catch (err) {
    console.log(err);
    return { error: 'Something went wrong, Please try again later' };
  }
};

const CreatePostForm = () => {
  const router = useRouter();

  //All the states
  const [userProfile, setUserProfile] = useState<string | null>(null);
  const [about, setAbout] = useState('');
  const [formError, setFormError] = useState<{
    title?: string;
    description?: string;
    about?: string;
  }>({});
  const [isPending, setisPending] = useState<boolean>(false);

  //function to submit the post
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    setisPending(true);
    setFormError({});
    e.preventDefault();
    const formData = new FormData(e.currentTarget);

    const imgUrl = await uploadImage(formData.get('image') as File);

    //creating post object
    const postForm = {
      title: formData.get('title') as string,
      description: formData.get('desc') as string,
      image: imgUrl as string,
      category: formData.get('category') as string,
      about,
    };

    try {
      //validating the post object
      await PostFormValidation.parseAsync(postForm);

      // sending the post request
      const { message, error }: { message?: string; error?: string } =
        await createPostApiReq(postForm);
      if (message) {
        toast.success(message);
        router.push('/');
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
      <form
        onSubmit={handleSubmit}
        className="create-form flex flex-col w-[90%] max-w-[900px] mx-auto"
      >
        <label htmlFor="title">Title:</label>
        <input
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
          name="desc"
          className="input-field"
          placeholder="eg:This is a tutorial on how to use for loop in JavaScript"
          required
        />
        {formError.description && (
          <p className="text-red-500">{formError.description}</p>
        )}

        <label htmlFor="image">Poster:</label>
        {userProfile && (
          <Image
            src={`${userProfile}`}
            alt={`${userProfile}`}
            width={100}
            height={100}
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
            setUserProfile(url);
          }}
          required
        />

        <label htmlFor="category">Choose The Tech:</label>
        <input
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
              placeholder: 'Write a detailed explanation of the query',
            }}
            previewOptions={{ disallowedElements: ['style'] }}
          />
        </div>
        {formError.about && <p className="text-red-500">{formError.about}</p>}

        <button
          type="submit"
          className="w-full my-5 rounded-lg bg-accentPrimary p-1 px-5 border-2 border-textPrimary text-bgPrimary font-bold"
        >
          {isPending ? 'Submiting the Post ....' : 'Create'}
        </button>
      </form>
    </>
  );
};

export default CreatePostForm;
