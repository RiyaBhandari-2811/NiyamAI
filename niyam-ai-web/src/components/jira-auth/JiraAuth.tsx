import React from "react";
import { Button } from "../ui/button";

const JiraAuth = () => {
  return (
    <div>
      <Button
        variant={"secondary"}
        className="hover:bg-secondary-foreground hover:text-secondary cursor-pointer transition-all duration-300"
      >
        Connect to JIRA
      </Button>
    </div>
  );
};

export default JiraAuth;
