import { createContext, FunctionComponent, PropsWithChildren } from "react";

export const SocketContext = createContext<WebSocket | undefined>(undefined);

export interface SocketProviderProps {
  webSocket: WebSocket;
}

export const SocketProvider: FunctionComponent<
  PropsWithChildren<SocketProviderProps>
> = (props) => {
  if (props.webSocket === undefined) {
    // TODO: Use better loading component
    return <h1>LoADING</h1>;
  }

  return (
    <SocketContext.Provider value={props.webSocket}>
      {props.children}
    </SocketContext.Provider>
  );
};
