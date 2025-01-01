'use client';
import React, { useState } from 'react';
import Image from 'next/image';
import MDEditor from '@uiw/react-md-editor';
import { z } from 'zod';
import { PostFormValidation } from '@/lib/validations';
import { useRouter } from 'next/navigation';
import { toast } from 'react-toastify';
import axios, { AxiosResponse } from 'axios';
import { uploadImage } from '@/lib/supabaseStorage';

type postFormType = {
  title: string;
  description: string;
  image: string;
  category: string;
  about: string;
};
export const createPostApiReq = async (postForm: postFormType) => {
  const email = localStorage.getItem('email');
  try {
    const res: AxiosResponse<{ message: string }> = await axios.post(
      'http://localhost:5000/api/post',
      {
        postForm,
        email,
      }
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
  const [userProfile, setUserProfile] = useState<string | ArrayBuffer | null>(
    null
  );
  const [about, setAbout] = useState('');
  const [formError, setFormError] = useState<{
    title?: string;
    description?: string;
    about?: string;
  }>({});
  const [isPending, setisPending] = useState<boolean>(false);

  //function to convert the image to base64
  const convertImg = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setUserProfile(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

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

    //validating the post object and sending the post request
    try {
      await PostFormValidation.parseAsync(postForm);
      const { message, error }: { message?: string; error?: string } =
        await createPostApiReq(postForm);
      if (message) {
        toast.success(message);
        router.push('/');
      } else if (error) {
        toast.error(error);
      }
    } catch (err) {
      //handling the error by setting the form error state given by the zod error
      if (err instanceof z.ZodError) {
        console.log(err.errors);
        err.errors.map((errObj) => {
          setFormError((prev) => {
            return { ...prev, [errObj.path[0]]: errObj.message };
          });
        });
      }
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
          onChange={convertImg}
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
