'use client';
import React, { useState, useActionState } from 'react';
import { useRouter } from 'next/navigation';
import { Session } from 'next-auth';
import Image from 'next/image';
import MDEditor from '@uiw/react-md-editor';
import { PostFormValidation } from '@/lib/validations';
import { z } from 'zod';
import { createPostApiReq } from '@/lib/serverAction';
import { toast } from 'react-toastify';

const CreatePostForm = ({ session }: { session: Session }) => {
  const router = useRouter();

  //All the States
  const [userProfile, setUserProfile] = useState<string | ArrayBuffer | null>(
    null
  );
  const [about, setAbout] = useState('');
  const [formError, setFormError] = useState<{
    title?: string;
    description?: string;
  }>({});

  //Function to convert the image to base64
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

  //Function  to submit the post ot the server
  const createPost = async (previousState: unknown, formData: FormData) => {
    const postForm = {
      title: formData.get('title') as string,
      description: formData.get('desc') as string,
      image: userProfile as string,
      category: formData.get('category') as string,
      about,
    };
    setFormError({});
    try {
      await PostFormValidation.parseAsync(postForm);
      const { message, error } = await createPostApiReq(postForm, session);
      if (message) {
        toast.success(message);
        router.push('/');
      }
      if (error) toast.error(error);
    } catch (err) {
      if (err instanceof z.ZodError) {
        console.log(err.errors);
        err.errors.map((errObj) => {
          setFormError((prev) => {
            return { ...prev, [errObj.path[0]]: errObj.message };
          });
        });
      }
    }
  };

  const [data, handleSubmit, isPending] = useActionState(createPost, undefined);
  console.log(data);
  return (
    <>
      <form
        action={handleSubmit}
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
