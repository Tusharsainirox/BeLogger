import React from "react";
import AnimationWrapper from "../common/page-animation";
import InPageNavigation from "../components/inpage-navigation.component";

const HomePage = () => {
  return (
    <AnimationWrapper>
      <section className="h-cover flex justify-center gap-10">
        {/* latest Blog  */}
        <div className=" w-full ">
          <InPageNavigation
          
            routes={["home", "trending blogs"]}
            defaultHidden={["trending blogs"]}
          >

          <h1> Latest blogs here</h1>
          <h1> Trending blogs here</h1>


          </InPageNavigation>
        </div>

        <hr className="absolute bottom-0 " />

        {/* Filters and trending blogs */}
        <div></div>
      </section>
    </AnimationWrapper>
  );
};

export default HomePage;
