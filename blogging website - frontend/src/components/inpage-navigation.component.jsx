import React, { useEffect, useRef, useState } from "react";

const InPageNavigation = ({ routes, defaultActiveIndex = 0, defaultHidden = [] , children }) => {

  let activeTabLineRef = useRef();
  let activeTab = useRef();

  let [inPageNavIndex, setInPageNavIndex] = useState(defaultActiveIndex);

  const changePageState = (btn, i) => {
    let { offsetWidth, offsetLeft } = btn;

    activeTabLineRef.current.style.width = offsetWidth + "px";
    activeTabLineRef.current.style.left = offsetLeft + "px";
  };

  useEffect(() => {
    changePageState(activeTab.current , defaultActiveIndex )
  
    return () => {
      second
    }
  }, [])
  

  return (
    <>
      <div className="relative mb-8 bg-white border-grey border-b flex flex-nowrap overflow-x-auto">
        {routes.map((route, i) => {
          return (
            <button
            ref={i == defaultActiveIndex? activeTab : null}
              key={i}
              className={
                "p-4 px-5 capitalize " +
                (inPageNavIndex == i ? "text-black" : "text-dark-grey ") + ( defaultHidden.includes(route)? " md:hidden" : " ")
              }
              onClick={(e) => {
                changePageState(e.target, i);
                setInPageNavIndex(i)
              }}
            >
              {route}
            </button>
          );
        })}

        <hr
          ref={activeTabLineRef}
          className="absolute bottom-0 duration-500 "
        />
      </div>

      {Array.isArray(children)? children[inPageNavIndex]:children}
    </>
  );
};

export default InPageNavigation;
