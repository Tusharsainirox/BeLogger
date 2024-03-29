import React, { useContext, useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import logo from "../imgs/logo.png";
import AnimationWrapper from "../common/page-animation";
import blogBanner from "../imgs/blog banner.png";
import { uploadIamge } from "../common/aws";
import { Toaster, toast } from "react-hot-toast";
import { EditorContext } from "../pages/editor.pages";
import EditorJS from "@editorjs/editorjs";
import { tools } from "./tools.component";
import axios from "axios";
import { userContext } from "../App";

const BlogEditor = () => {

  let{userAuth:{access_token}} = useContext(userContext)

  let navigate = useNavigate();

  //using context
  let {
    blog: { title, banner, content, tags, des },
    setBlog,
    blog,
    setTextEditorState,
    textEditorState,
    editorState,
    setEditorState
  } = useContext(EditorContext);


  useEffect(() => {
    if(!textEditorState.isReady){
      setTextEditorState(
        new EditorJS({
          holderId: "textEditor",
          tools: tools,
          data: content,
          placeholder: "Let's write an awesome story!",
        }))
    }
  }, []);



  const handelBannerUpload = (e) => {
    let img = e.target.files[0];

    if (img) {
      let loadingToast = toast.loading("Uploading...");
      uploadIamge(img)
        .then((url) => {
          if (url) {
            toast.dismiss(loadingToast);
            toast.success("Uploaded 👍");
            setBlog({ ...blog, banner: url });
          }
        })
        .catch((err) => {
          toast.dismiss(loadingToast);
          return toast.error(err);
        });
    }
  };

  const handleBannerError = (e) => {
    let img = e.target;

    img.src = blogBanner;
  };

  const handelTitleKeyDown = (e) => {
    if (e.keyCode == 13) {
      //enter key action disabled
      e.preventDefault();
    }
  };

  const handelTitleChange = (e) => {
    let input = e.target;
    // for resetting height so that we dont get the scroll bar on the textField with larger inputs
    input.style.height = "auto";
    input.style.height = input.scrollHeight + "px";

    // handeling the changing heading use context
    setBlog({ ...blog, title: input.value });
  };

  const handlePublishEvent = (e)=>{
    if(!banner.length){
      return toast.error("Upload blog banner to Publish")
    }
    if(!title.length){
      return toast.error("Write blog title to Publish")
    }
    if(textEditorState.isReady ){
      textEditorState.save().then(data=>{
        if(data.blocks.length){
          setBlog({...blog, content:data})
          setEditorState("publish")
        }else{
          return toast.error("Write something in your blog to Publish it")
        }
      }).catch((err)=>{
        console.log(err);
      })
    }
  }

  const handelSaveDraft = (e)=>{
    if (e.target.className.includes("disable")) {
      return;
    }

    if (!title.length) {
      return toast.error("Write a Title before saving it as a draft");
    }

    let loadingToast = toast.loading("Saving Draft...");
    e.target.classList.add("disable");

    if(textEditorState.isReady){
      textEditorState.save().then(content =>{

        let blogObj = {
          title,
          des,
          banner,
          content,
          tags,
          draft: true,
        };

      axios.post(import.meta.env.VITE_SERVER_DOMAIN + "/create-blog", blogObj, {
        headers: {
          Authorization: `Bearer ${access_token}`,
        },
      })
      .then(() => {
        e.target.classList.remove("disable");

        toast.dismiss(loadingToast)
        toast.success("Saved 👍")

        setTimeout(() => {
          navigate("/")
        }, 500);

      }).catch(({response})=>{
        e.target.classList.remove("disable");
        toast.dismiss(loadingToast)

        return toast.error(response.data.error)
      })

      })
    }   
  }

  return (
    <>
      <nav className="navbar">
        <Link to="/" className=" flex-none w-10 ">
          <img src={logo} />
        </Link>
        <p className=" max-md:hidden text-black line-clamp-1 w-full ">
          {title.length ? title : "New Blog!"}
        </p>
        <div className=" flex gap-4 ml-auto">
          <button onClick={handlePublishEvent} className="btn-dark py-2">Publish</button>
          <button onClick={handelSaveDraft} className="btn-light py-2">Save Draft</button>
        </div>
      </nav>
      <Toaster />
      <AnimationWrapper>
        <section>
          <div className="mx-auto max-w-[900] w-full">
            <div className="relative aspect-video bg-white border-4 hover:opacity-80 border-grey">
              <label htmlFor="uploadBanner">
                <img
                  src={banner}
                  className="z-20"
                  onError={handleBannerError}
                />
                <input
                  id="uploadBanner"
                  type="file"
                  accept=".jpg, .jpeg, .png"
                  hidden
                  onChange={handelBannerUpload}
                />
              </label>
            </div>

            <textarea
            defaultValue={title}
              placeholder="Blog title"
              className="text-4xl font-medium w-full h-20 outline-none resize-none mt-10 leading-tight placeholder:opacity-40 "
              onKeyDown={handelTitleKeyDown}
              onChange={handelTitleChange}
            ></textarea>
            <hr className="w-full opacity-10 my-5" />

            <div id="textEditor" className=" font-gelasio"></div>
          </div>
        </section>
      </AnimationWrapper>
    </>
  );
};

export default BlogEditor;
