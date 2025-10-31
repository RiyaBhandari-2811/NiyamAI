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
    <div className="flex justify-center items-center w-full  bg-slate-950/40 backdrop-blur-sm">
      <div className="max-w-3xl w-full bg-slate-950/40 border border-slate-700 rounded-2xl shadow-lg mt-10 mb-10 p-6">
        {/* Tabs */}
        <Tabs
          defaultValue="upload"
          onValueChange={(newTab: string) => {
            if (activeTab === "upload") setUploadedFile(null);
            if (activeTab === "url") setUrlInput("");
            if (activeTab === "text") setTextInput("");
            setActiveTab(newTab as "upload" | "url" | "text");
          }}
        >
          <TabsList className="grid w-full grid-cols-3 mb-3 bg-slate-950/40 border border-slate-700 rounded-lg overflow-hidden">
            <TabsTrigger
              value="upload"
              className="p-0 text-sm font-semibold text-slate-300 data-[state=active]:bg-slate-600 data-[state=active]:text-white"
            >
              File Upload
            </TabsTrigger>
            <TabsTrigger
              value="url"
              className="p-0 text-sm font-semibold text-slate-300 data-[state=active]:bg-slate-600 data-[state=active]:text-white"
            >
              URL/Link
            </TabsTrigger>
            <TabsTrigger
              value="text"
              className="p-0 text-sm font-semibold text-slate-300 data-[state=active]:bg-slate-600 data-[state=active]:text-white"
            >
              Direct Text
            </TabsTrigger>
          </TabsList>

          {/* Content area */}
          <div className="min-h-[340px] flex flex-col justify-between">
            <div>
              {/* Upload */}
              <TabsContent value="upload">
                <div
                  onDragEnter={handleDrag}
                  onDragLeave={handleDrag}
                  onDragOver={handleDrag}
                  onDrop={handleDrop}
                  className={`relative flex flex-col justify-center items-center border-2 border-dashed rounded-xl p-10 text-center transition-all duration-300 ${
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
                  <Upload className="w-10 h-10 text-slate-400 mb-3" />
                  <h3 className="text-lg font-medium text-slate-200">
                    Drag & drop your files here
                  </h3>
                  <p className="text-sm text-slate-500 mb-4">
                    or click to browse files
                  </p>
                  <div className="flex gap-3">
                    <Badge
                      variant="outline"
                      className="border-slate-600 text-slate-300"
                    >
                      PDF
                    </Badge>
                    <Badge
                      variant="outline"
                      className="border-slate-600 text-slate-300"
                    >
                      Word
                    </Badge>
                    <Badge
                      variant="outline"
                      className="border-slate-600 text-slate-300"
                    >
                      Text
                    </Badge>
                  </div>
                </div>

                {uploadedFile && (
                  <div className="mt-5 p-4 bg-slate-800/50 border border-slate-700 rounded-lg flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      {getFileIcon(uploadedFile.name)}
                      <div>
                        <p className="text-slate-100 font-medium">
                          {uploadedFile.name}
                        </p>
                        <p className="text-slate-400 text-sm">
                          {(uploadedFile.size / 1024 / 1024).toFixed(2)} MB
                        </p>
                      </div>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={removeFile}
                      className="text-slate-400 hover:text-white"
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
                  className="h-12 bg-slate-800 text-slate-100 border-slate-700 focus-visible:border-slate-700 focus-visible:ring-slate-700 focus-visible:outline-slate-700"
                />
                <p className="text-sm text-slate-500 mt-3">
                  Enter a URL to a publicly accessible document
                </p>
              </TabsContent>

              {/* Text */}
              <TabsContent value="text">
                <Textarea
                  placeholder="Paste your requirements document content here..."
                  value={textInput}
                  onChange={handleTextChange}
                  rows={30}
                  className="w-full max-w-[1000px] h-[200px] resize-none overflow-y-auto bg-slate-800 text-slate-100 border border-slate-700  focus-visible:border-slate-700 focus-visible:ring-slate-700 focus-visible:outline-slate-700"
                />
                <p className="text-sm text-slate-500 mt-3">
                  Directly paste your PRD content
                </p>
              </TabsContent>
            </div>

            {/* Generate Button */}
            <div className="flex justify-end mt-6">
              <Button
                onClick={onSubmit}
                disabled={
                  !connected || (!uploadedFile && !urlInput && !textInput)
                }
                className={`w-full h-12 rounded-lg font-semibold text-white bg-emerald-500 hover:bg-emerald-600 transition-all duration-300 text-lg hover:cursor-pointer ${
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
