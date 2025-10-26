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

  // Fetch projects from API or localStorage
  const fetchProjects = async (userId: string) => {
    try {
      setIsLoading(true);
      setError(null);

      // Check localStorage first
      const cachedProjects = localStorage.getItem(LOCAL_STORAGE_KEY);
      if (cachedProjects) {
        const parsed = JSON.parse(cachedProjects) as JiraProject[];
        setProjects(parsed);

        // Set previously selected project
        const cachedSelected = localStorage.getItem(LOCAL_STORAGE_SELECTED);
        if (cachedSelected) setSelectedProject(cachedSelected);

        setIsLoading(false);
        return;
      }

      // Fetch from API if not cached
      const res = await fetch(`/api/getProjectList?userId=${userId}`, {
        cache: "no-store",
      });
      if (!res.ok) throw new Error("Failed to fetch Jira projects");
      const data: JiraProject[] = await res.json();
      setProjects(data);

      // Cache in localStorage
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(data));
    } catch (err: any) {
      console.error("Error fetching Jira projects:", err);
      setError(err.message || "Something went wrong");
    } finally {
      setIsLoading(false);
    }
  };

  // Update selected project in state and localStorage
  const handleSelectProject = (projectKey: string) => {
    setSelectedProject(projectKey);
    localStorage.setItem(LOCAL_STORAGE_SELECTED, projectKey);
  };

  useEffect(() => {
    if (userId) {
      fetchProjects(userId);
    }
  }, [userId]);

  return (
    <div>
      <div className="flex items-center gap-2">
        <span className="text-sm text-slate-400">Project List:</span>

        <Select
          value={selectedProject || ""}
          onValueChange={handleSelectProject}
        >
          <SelectTrigger className="w-44 h-12 text-xs bg-slate-700/50 border-slate-600/50 text-slate-100 hover:bg-slate-600/50 focus:border-emerald-500 px-4 py-1">
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

          <SelectContent className="bg-slate-800 border-slate-600 min-w-44">
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
                      className="text-slate-100 focus:bg-slate-700 focus:text-slate-50 cursor-pointer py-3 px-3"
                    >
                      <div className="flex flex-col items-start w-full min-w-0">
                        <span className="font-medium text-slate-100 text-sm truncate w-full">
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
    </div>
  );
};

export default JiraProjectList;
