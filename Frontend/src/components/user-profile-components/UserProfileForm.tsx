import { useRef, useState } from "react";
import { FaPen, FaUser, FaPlus } from "react-icons/fa";
import { TiTick } from "react-icons/ti";
import { toast } from "react-toastify";
import axios from "axios";
import { UserType } from "../../utils/types";
import { deleteImage, uploadImage } from "../../utils/supabaseStorage";
import { fileToImageUrl, hapiApi } from "../../utils/utility";
import { FiLoader } from "react-icons/fi";

const UserProfileForm = ({ session }: { session: UserType }) => {
  const { fname, bio, pic } = session;

  //refs
  const nameRef = useRef<HTMLInputElement>(null);
  const bioRef = useRef<HTMLInputElement>(null);
  const imageRef = useRef<HTMLInputElement>(null);

  //states
  const [editState, setEditState] = useState<boolean>(false);
  const [userProfile, setuserProfile] = useState<string | null>(pic);
  const [loading, setloading] = useState(false);

  //function to update user profile
  const handleSubmit = async () => {
    setloading(true);
    const imageFile = imageRef?.current?.files?.[0] as File;
    if (imageFile?.size > 0 && pic) await deleteImage([pic]);
    const picUrl = imageFile?.size > 0 ? await uploadImage(imageFile) : pic;

    const updatedUserData = {
      name: nameRef.current?.value,
      bio: bioRef.current?.value,
      pic: picUrl,
    };

    //calling API then showing the toast message
    try {
      const res = await hapiApi.put("/api/user", updatedUserData);
      toast.success(res.data.message);
      setEditState(false);
    } catch (err) {
      if (axios.isAxiosError(err)) toast.error(err.response?.data.error);
    }
    setloading(false);
  };

  return (
    <form
      onSubmit={(e) => e.preventDefault()}
      className="flex flex-col sm:flex-row  items-center justify-around w-2/3 relative"
    >
      <section className="absolute top-1 right-1 z-10">
        {editState ? (
          <button className="btn-accent-one" onClick={handleSubmit}>
            {loading ? <FiLoader className="animate-spin" /> : <TiTick />}
          </button>
        ) : (
          <button
            className="btn-accent-one"
            onClick={() => {
              setEditState(!editState);
            }}
          >
            <FaPen />
          </button>
        )}
      </section>
      <section className="relative w-[20%] h-[85%] flex justify-center items-center border-4 border-accentPrimary rounded-full ">
        {userProfile && userProfile !== "null" ? (
          <img
            src={`${userProfile}`}
            alt={`${fname}`}
            className="size-full rounded-full object-cover"
          />
        ) : (
          <FaUser className="size-2/3 text-accentPrimary" />
        )}
        {editState && (
          <div className="size-[30px] absolute right-0 bottom-0">
            <FaPlus className="size-full bg-accentPrimary rounded-full p-1 text-bgPrimary" />
            <input
              type="file"
              className="size-full absolute top-0 left-0 opacity-0"
              ref={imageRef}
              onChange={async (e) => {
                const url = fileToImageUrl(e);
                setuserProfile(url);
              }}
            />
          </div>
        )}
      </section>
      <section className="flex flex-col w-2/3">
        <label>Name</label>
        <fieldset>
          <input
            type="text"
            name="name"
            id="name"
            ref={nameRef}
            defaultValue={fname}
            disabled={!editState}
            className="bg-transparent backdrop-blur-sm grow px-1"
          />
        </fieldset>
        <label>Bio</label>
        <fieldset>
          <input
            type="text"
            defaultValue={bio}
            ref={bioRef}
            disabled={!editState}
            className="bg-transparent backdrop-blur-sm grow px-1"
          />
        </fieldset>
      </section>
    </form>
  );
};
export default UserProfileForm;
