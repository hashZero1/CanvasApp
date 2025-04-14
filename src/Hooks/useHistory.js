import { useCallback, useState } from "react";

export const useHistory = (initialState) => {
    const [state, setState] = useState(initialState);
    const [history, setHistory] = useState([initialState]);
    const [pointer, setPointer] = useState(0);
  
    const push = useCallback(
      (newState) => {
        const newHistory = history.slice(0, pointer + 1);
        newHistory.push(JSON.parse(JSON.stringify(newState)));
        setHistory(newHistory);
        setPointer(newHistory.length - 1);
        setState(newState);
      },
      [history, pointer]
    );
  
    const undo = useCallback(() => {
      if (pointer > 0) {
        setPointer(pointer - 1);
        setState(history[pointer - 1]);
        return true;
      }
      return false;
    }, [history, pointer]);
  
    const redo = useCallback(() => {
      if (pointer < history.length - 1) {
        setPointer(pointer + 1);
        setState(history[pointer + 1]);
        return true;
      }
      return false;
    }, [history, pointer]);
  
    return [state, push, undo, redo];
  };