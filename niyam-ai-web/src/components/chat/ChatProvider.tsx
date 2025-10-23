"use client";

import React, { ReactNode } from "react";

interface ChatProviderProps {
  children: ReactNode;
}

const ChatProvider = ({ children }: ChatProviderProps): React.JSX.Element => {
  return <div>{children}</div>;
};

export default ChatProvider;
