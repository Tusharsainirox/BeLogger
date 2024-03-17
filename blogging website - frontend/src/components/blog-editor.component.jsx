import React from "react";
import { Link } from "react-router-dom";
import logo from "../imgs/logo.png";
import AnimationWrapper from "../common/page-animation";
import blogBanner from "../imgs/blog banner.png"

const BlogEditor = () => {

    const handelBannerUpload = (e)=>{
        let img = e.target.files[0];
        console.log(img)
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
    
    <AnimationWrapper>
        <section >
        <div className="mx-auto max-w-[900] w-full">

        <div className="relative aspect-video bg-white border-4 hover:opacity-80 border-grey" >
            <label htmlFor="uploadBanner" >
                <img src={blogBanner} className="z-20"/>
                <input id="uploadBanner" type="file" accept=".jpg, .jpeg, .png" hidden onChange={handelBannerUpload}/>
            </label>
        </div>

        </div>

        </section>
    </AnimationWrapper>


    </>
  );
};

export default BlogEditor;
