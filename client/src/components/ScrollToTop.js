import React, { useState, useEffect } from "react";
import { FaArrowUp } from "react-icons/fa";
import "./ScrollToTop.css";

const ScrollToTop = () => {
  const [visible, setVisible] = useState(false);

  const toggleVisible = () => {
    const scrolled = document.documentElement.scrollTop;
    setVisible(scrolled > 300);
  };

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  useEffect(() => {
    window.addEventListener("scroll", toggleVisible);
    return () => window.removeEventListener("scroll", toggleVisible);
  }, []);

  return (
    <div 
      id="topcontrol" 
      title="" 
      style={{position: "fixed", bottom: "5px", right: "5px", opacity: 1, cursor: "pointer"}}
       onClick={scrollToTop}>
        <FaArrowUp />
    </div>
  );
};

export default ScrollToTop;
