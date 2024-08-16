import { useEffect, useState, Dispatch, SetStateAction } from "react";

export const useCashe = <T>(
  id: string,
  defaultValue?: T
): [T | undefined, Dispatch<SetStateAction<T | any>>] => {
  const [state, setState] = useState<T | undefined>();

  useEffect(() => {
    const item = localStorage.getItem(id);
    if (item !== null) {
      setState(JSON.parse(item));
      console.log("Storage: ", id);
    }
  }, []);

  useEffect(() => {
    if (state !== undefined) {
      localStorage.setItem(id, JSON.stringify(state));
    }
  }, [id, state]);

  return [state || defaultValue || state, setState];
};
