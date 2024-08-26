import { createContext, useState } from "react";

export const MyState = createContext(null);

export const Context = ({ children }) => {
  const [open, setOpen] = useState(false);
  const [OpenNews, setOpens] = useState(true);
  const [add, setAdd] = useState(false);
  return (
    <MyState.Provider value={{ open, setOpen, setAdd, add, setOpens }}>
      {children}
    </MyState.Provider>
  );
};
