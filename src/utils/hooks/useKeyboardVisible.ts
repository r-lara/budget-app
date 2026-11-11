import { useEffect, useState } from "react";

export function useKeyboardVisible() {
  const [keyboardVisible, setKeyboardVisible] = useState(false);

  useEffect(() => {
    const visualViewport = window.visualViewport;

    if (!visualViewport) return;

    const handleResize = () => {
      const heightDifference = window.innerHeight - visualViewport.height;

      setKeyboardVisible(heightDifference > 150);
    };

    visualViewport.addEventListener("resize", handleResize);

    return () => {
      visualViewport.removeEventListener("resize", handleResize);
    };
  }, []);

  return keyboardVisible;
}