"use client";

import React, { useEffect, useState } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { AlertCircle, Loader2 } from "lucide-react";
import { useChatContext } from "./ChatProvider";

interface JiraProject {
  id: string;
  key: string;
  name: string;
}

const JiraProjectList = () => {
  const { userId, selectedProject, setSelectedProject } = useChatContext();
  const [projects, setProjects] = useState<JiraProject[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const LOCAL_STORAGE_KEY = `jiraProjects_${userId}`;
  const LOCAL_STORAGE_SELECTED = `jiraSelectedProject_${userId}`;

  const fetchProjects = async (userId: string) => {
    try {
      setIsLoading(true);
      setError(null);

      const cachedProjects = localStorage.getItem(LOCAL_STORAGE_KEY);
      if (cachedProjects) {
        const parsed = JSON.parse(cachedProjects) as JiraProject[];
        setProjects(parsed);

        const cachedSelected = localStorage.getItem(LOCAL_STORAGE_SELECTED);
        if (cachedSelected) setSelectedProject(cachedSelected);

        setIsLoading(false);
        return;
      }

      const res = await fetch(`/api/getProjectList?userId=${userId}`, {
        cache: "no-store",
      });
      if (!res.ok) throw new Error("Failed to fetch Jira projects");

      const data: JiraProject[] = await res.json();
      setProjects(data);

      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(data));
    } catch (err: any) {
      console.error("Error fetching Jira projects:", err);
      setError(err.message || "Something went wrong");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSelectProject = (projectKey: string) => {
    setSelectedProject(projectKey);
    localStorage.setItem(LOCAL_STORAGE_SELECTED, projectKey);
  };

  useEffect(() => {
    if (userId) fetchProjects(userId);
  }, [userId]);

  return (
    <div className="w-full flex items-center gap-3">
      <span className="text-sm text-slate-400 whitespace-nowrap">
        Project List:
      </span>

      <Select
        value={selectedProject || ""}
        onValueChange={handleSelectProject}
      >
        <SelectTrigger
          className={`
            w-52 h-11 text-sm
            bg-slate-900/70 border border-slate-700
            text-slate-100
            rounded-xl
            transition-all duration-300 ease-in-out
            hover:border-green-500 focus:border-green-500
            hover:shadow-[0_0_12px_rgba(34,197,94,0.3)]
            focus:shadow-[0_0_14px_rgba(34,197,94,0.4)]
            px-4
          `}
        >
          <SelectValue
            placeholder={
              isLoading
                ? "Loading projects..."
                : error
                ? "Error loading projects"
                : "Select Project"
            }
          />
        </SelectTrigger>

        <SelectContent
          className={`
            bg-slate-900 border border-slate-700 
            rounded-xl shadow-lg min-w-52
            backdrop-blur-md
          `}
        >
          {isLoading && (
            <div className="flex items-center gap-2 p-3 text-slate-400">
              <Loader2 className="w-4 h-4 animate-spin" />
              <span className="text-sm">Loading projects...</span>
            </div>
          )}

          {error && !isLoading && (
            <div className="flex items-center gap-2 p-3 text-red-400">
              <AlertCircle className="w-4 h-4" />
              <span className="text-sm">{error}</span>
            </div>
          )}

          {!isLoading && !error && (
            <>
              {projects.length > 0 ? (
                projects.map((project) => (
                  <SelectItem
                    key={project.id}
                    value={project.key}
                    className={`
                      text-slate-100 py-3 px-3
                      cursor-pointer rounded-lg
                      transition-all duration-200
                      focus:bg-slate-800 hover:bg-slate-800
                      focus:text-green-400 hover:text-green-400
                    `}
                  >
                    <div className="flex flex-col items-start w-full min-w-0">
                      <span className="font-medium text-sm truncate w-full">
                        {project.key} - {project.name}
                      </span>
                    </div>
                  </SelectItem>
                ))
              ) : (
                <SelectItem
                  key="no-project"
                  value=""
                  disabled
                  className="text-slate-500 cursor-not-allowed py-3 px-3"
                >
                  <div className="flex flex-col items-start w-full min-w-0">
                    <span className="font-medium text-slate-400 text-sm w-full">
                      No projects found. Make one!
                    </span>
                  </div>
                </SelectItem>
              )}
            </>
          )}
        </SelectContent>
      </Select>
    </div>
  );
};

export default JiraProjectList;
