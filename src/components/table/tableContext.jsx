import { createContext, useContext } from "react";

const TableCtx = createContext(null);

const TableCtxProvider = ({ children, value }) => {
  return <TableCtx.Provider value={value}>{children}</TableCtx.Provider>;
};
export const useTableCtx = () => {
  const context = useContext(TableCtx);
  if (!context) {
    throw new Error("useTable must be used within a tableProvider");
  }
  return context;
};

export default TableCtxProvider;
