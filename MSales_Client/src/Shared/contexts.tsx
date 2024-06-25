import { createContext, useContext } from "react";
import { ListLeadsContextProps } from "./Types.d";

export const CreateListLeadsContext = createContext({});
export const useListLeadsContext = (): ListLeadsContextProps => {
  // @ts-ignore
  return useContext<ListLeadsContextProps>(CreateListLeadsContext);
};
