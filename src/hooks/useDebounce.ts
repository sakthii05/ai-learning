import React, { useEffect, useState } from "react";

const useDebounce = (value: string, delay: number) => {
  const [debounced, setDebounced] = useState(value);

  useEffect(() => {
    const timer = setTimeout(() => setDebounced(value), delay);

    return () => clearInterval(timer);
  }, [value, delay]);

  return debounced;
};

export default useDebounce;
