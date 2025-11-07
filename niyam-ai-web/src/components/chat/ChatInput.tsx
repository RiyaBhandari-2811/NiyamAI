"use client";

import { File, FileText, Upload } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import React from "react";
import { Badge } from "@/components/ui/badge";
import { useChatContext } from "./ChatProvider";

const ChatInput = () => {
  const {
    setOriginalUploadedFile,
    connected,
    handleSubmit,
    selectedProject,
    sessionId,
  } = useChatContext();
  const [dragActive, setDragActive] = React.useState(false);
  const [uploadedFile, setUploadedFile] = React.useState<File | null>(null);
  const [urlInput, setUrlInput] = React.useState("");
  const [textInput, setTextInput] = React.useState("");
  const [activeTab, setActiveTab] = React.useState<"upload" | "url" | "text">(
    "upload"
  );

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") setDragActive(true);
    else if (e.type === "dragleave") setDragActive(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      setUploadedFile(e.dataTransfer.files[0]);
      setOriginalUploadedFile(e.dataTransfer.files[0]);
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setUploadedFile(e.target.files[0]);
      setOriginalUploadedFile(e.target.files[0]);
    }
  };

  const handleUrlChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setUrlInput(e.target.value);
    if (e.target.value) {
      setUploadedFile(null);
      setTextInput("");
    }
  };

  const handleTextChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    if (e.target.value) {
      setTextInput(e.target.value);
      setUploadedFile(null);
      setUrlInput("");
    }
  };

  const removeFile = () => {
    setUploadedFile(null);
    setOriginalUploadedFile(null);
  };

  const getFileIcon = (fileName: string) => {
    const extension = fileName.split(".").pop()?.toLowerCase();
    switch (extension) {
      case "pdf":
        return <File className="w-5 h-5 text-red-500" />;
      case "doc":
      case "docx":
        return <FileText className="w-5 h-5 text-blue-500" />;
      default:
        return <FileText className="w-5 h-5 text-gray-400" />;
    }
  };

  const onSubmit = async () => {
    let payload: any = {};

    if (uploadedFile) {
      const base64 = await fileToBase64(uploadedFile);
      payload = {
        type: "file",
        mime: uploadedFile.type,
        data: base64 + `Project Key: ${selectedProject}`,
      };
      setUploadedFile(null);
    } else if (urlInput) {
      payload = {
        type: "url",
        data: urlInput + `Project Key: ${selectedProject}`,
      };
      setUrlInput("");
    } else if (textInput) {
      payload = {
        type: "text",
        data: textInput + `Project Key: ${selectedProject}`,
      };
      setTextInput("");
    } else return;

    handleSubmit(JSON.stringify(payload));
  };

  function fileToBase64(file: File): Promise<string> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve((reader.result as string).split(",")[1]);
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  }

  return (
   <div className="flex justify-center items-center w-full bg-slate-950/40 backdrop-blur-sm py-6">
  <div className="max-w-2xl w-full bg-slate-950/40 border border-slate-700 rounded-xl shadow-lg p-5">
    <Tabs
      defaultValue="upload"
      onValueChange={(newTab: string) => {
        if (activeTab === "upload") setUploadedFile(null);
        if (activeTab === "url") setUrlInput("");
        if (activeTab === "text") setTextInput("");
        setActiveTab(newTab as "upload" | "url" | "text");
      }}
    >
      {/* Tabs Header */}
      <TabsList className="grid w-full grid-cols-3 mb-4 bg-slate-900/50 border border-slate-700 rounded-lg">
        <TabsTrigger
          value="upload"
          className="py-2 text-sm font-medium text-slate-300 data-[state=active]:bg-slate-700 data-[state=active]:text-white"
        >
          File Upload
        </TabsTrigger>
        <TabsTrigger
          value="url"
          className="py-2 text-sm font-medium text-slate-300 data-[state=active]:bg-slate-700 data-[state=active]:text-white"
        >
          URL/Link
        </TabsTrigger>
        <TabsTrigger
          value="text"
          className="py-2 text-sm font-medium text-slate-300 data-[state=active]:bg-slate-700 data-[state=active]:text-white"
        >
          Direct Text
        </TabsTrigger>
      </TabsList>

      {/* Tabs Content */}
      <div className="min-h-[260px] flex flex-col justify-between">
        <div>
          {/* File Upload */}
          <TabsContent value="upload">
            <div
              onDragEnter={handleDrag}
              onDragLeave={handleDrag}
              onDragOver={handleDrag}
              onDrop={handleDrop}
              className={`relative flex flex-col justify-center items-center border-2 border-dashed rounded-lg p-8 text-center transition-all duration-300 ${
                dragActive
                  ? "border-emerald-400 bg-emerald-500/5"
                  : "border-slate-600 hover:bg-slate-800/40"
              }`}
            >
              <input
                type="file"
                accept=".pdf,.doc,.docx,.txt"
                onChange={handleFileSelect}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
              />
              <Upload className="w-8 h-8 text-slate-400 mb-2" />
              <h3 className="text-base font-medium text-slate-200">
                Drag & drop your files here
              </h3>
              <p className="text-xs text-slate-500 mb-3">
                or click to browse files
              </p>
              <div className="flex gap-2">
                <Badge
                  variant="outline"
                  className="border-slate-600 text-slate-300 text-xs"
                >
                  PDF
                </Badge>
                <Badge
                  variant="outline"
                  className="border-slate-600 text-slate-300 text-xs"
                >
                  Word
                </Badge>
                <Badge
                  variant="outline"
                  className="border-slate-600 text-slate-300 text-xs"
                >
                  Text
                </Badge>
              </div>
            </div>

            {uploadedFile && (
              <div className="mt-4 p-3 bg-slate-800/50 border border-slate-700 rounded-md flex items-center justify-between">
                <div className="flex items-center gap-2">
                  {getFileIcon(uploadedFile.name)}
                  <div>
                    <p className="text-slate-100 text-sm font-medium">
                      {uploadedFile.name}
                    </p>
                    <p className="text-slate-400 text-xs">
                      {(uploadedFile.size / 1024 / 1024).toFixed(2)} MB
                    </p>
                  </div>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={removeFile}
                  className="text-slate-400 hover:text-white text-xs"
                >
                  Remove
                </Button>
              </div>
            )}
          </TabsContent>

          {/* URL */}
          <TabsContent value="url">
            <Input
              placeholder="https://example.com/requirements-doc"
              value={urlInput}
              onChange={handleUrlChange}
              className="h-10 bg-slate-800 text-slate-100 border-slate-700 text-sm"
            />
            <p className="text-xs text-slate-500 mt-2">
              Enter a public link to a document
            </p>
          </TabsContent>

          {/* Text */}
          <TabsContent value="text">
            <Textarea
              placeholder="Paste your requirements or PRD content..."
              value={textInput}
              onChange={handleTextChange}
              rows={6}
              className="w-full resize-none bg-slate-800 text-slate-100 border border-slate-700 text-sm"
            />
            <p className="text-xs text-slate-500 mt-2">
              Paste text content directly
            </p>
          </TabsContent>
        </div>

        {/* Generate Button */}
        <div className="flex justify-end mt-4">
          <Button
            onClick={onSubmit}
            disabled={
              !connected || (!uploadedFile && !urlInput && !textInput)
            }
            className={`w-full h-10 rounded-md font-medium text-white bg-emerald-500 hover:bg-emerald-600 text-sm transition-all ${
              !connected ||
              !selectedProject ||
              !sessionId ||
              (!uploadedFile && !urlInput && !textInput)
                ? "opacity-50 cursor-not-allowed"
                : ""
            }`}
          >
            Generate Test
          </Button>
        </div>
      </div>
    </Tabs>
  </div>
</div>

  );
};

export default ChatInput;
