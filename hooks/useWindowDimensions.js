import { useState, useEffect } from "react";

export default function useWindowDimensions() {
  const [width, setWidth] = useState(0);
  const [height, setHeight] = useState(0);

  useEffect(() => {
    const callback = () => {
      setWidth(window.innerWidth);
      setHeight(window.innerHeight);
    };

    callback(); // populate on load

    window.addEventListener("resize", callback);

    // on unmount
    return () => {
      window.removeEventListener("resize", callback);
    };
  }, []);

  return { width, height };
}
