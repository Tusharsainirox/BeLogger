import React, { useRef } from "react";
import { Link } from "react-router-dom";
import logo from "../imgs/logo.png";
import AnimationWrapper from "../common/page-animation";
import blogBanner from "../imgs/blog banner.png";
import { uploadIamge } from "../common/aws";
import { Toaster, toast } from "react-hot-toast";
const BlogEditor = () => {
  let blogBannerRef = useRef();

  const handelBannerUpload = (e) => {
    let img = e.target.files[0];

    if (img) {
      let loadingToast = toast.loading("Uploading...");
      uploadIamge(img).then((url) => {
        if (url) {
          toast.dismiss(loadingToast);
          toast.success("Uploaded 👍")
          blogBannerRef.current.src = url;
        }
      }).catch(err=>{
        toast.dismiss(loadingToast);
        return toast.error(err)
      })
    }
  };

  const handelTitleKeyDown =(e)=>{
    if(e.keyCode == 13){//enter key action disabled
      e.preventDefault();
    }
  }

  const handelTitleChange = (e)=>{
    let input = e.target ; 
// for resetting height so that we dont get the scroll bar on the textField with larger inputs
    input.style.height = "auto";
    input.style.height = input.scrollHeight + "px"
  }

  return (
    <>
      <nav className="navbar">
        <Link to="/" className=" flex-none w-10 ">
          <img src={logo} />
        </Link>
        <p className=" max-md:hidden text-black line-clamp-1 w-full ">
          New BlogEditor
        </p>
        <div className=" flex gap-4 ml-auto">
          <button className="btn-dark py-2">Publish</button>
          <button className="btn-light py-2">Save Draft</button>
        </div>
      </nav>
      <Toaster />
      <AnimationWrapper>
        <section>
          <div className="mx-auto max-w-[900] w-full">
            <div className="relative aspect-video bg-white border-4 hover:opacity-80 border-grey">
              <label htmlFor="uploadBanner">
                <img ref={blogBannerRef} src={blogBanner} className="z-20" />
                <input
                  id="uploadBanner"
                  type="file"
                  accept=".jpg, .jpeg, .png"
                  hidden
                  onChange={handelBannerUpload}
                />
              </label>
            </div>

            <textarea placeholder="Blog title" className="text-4xl font-medium w-full h-20 outline-none resize-none mt-10 leading-tight placeholder:opacity-40 " onKeyDown={handelTitleKeyDown}
            onChange={ handelTitleChange}>


            </textarea>


          </div>
        </section>
      </AnimationWrapper>
    </>
  );
};

export default BlogEditor;
