import { Provider, createContext } from "react";

export type Person = "candidate" | "interviewer";

const PersonContext = createContext<Person | undefined>(undefined);

const fart = (): JSX.Element => <PersonContext.Provider />;
