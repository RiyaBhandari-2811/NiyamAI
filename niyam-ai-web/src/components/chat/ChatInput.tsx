"use client";

import { File, FileText, Upload, Link } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import React from "react";
import { Badge } from "@/components/ui/badge";
import { useChatContext } from "./ChatProvider";

const ChatInput = () => {
  const { userId, connected, handleSubmit } = useChatContext();
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
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      setUploadedFile(e.dataTransfer.files[0]);
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setUploadedFile(e.target.files[0]);
    }
  };

  const handleUrlChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setUrlInput(e.target.value);
    if (e.target.value) {
      setUploadedFile(null); // clear File
      setTextInput(""); // clear Text
    }
  };

  const handleTextChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    if (e.target.value) {
      setTextInput(e.target.value);
    }
  };

  const removeFile = () => {
    setUploadedFile(null);
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
        return <FileText className="w-5 h-5 text-gray-500" />;
    }
  };

  const onSubmit = async () => {
    let payload: any = {};

    if (uploadedFile) {
      const base64 = await fileToBase64(uploadedFile);
      payload = { type: "file", mime: uploadedFile.type, data: base64 };
      setUploadedFile(null);
    } else if (urlInput) {
      payload = { type: "url", data: urlInput };
      setUrlInput("");
    } else if (textInput) {
      payload = { type: "text", data: textInput };
      setTextInput("");
    } else {
      return;
    }

    handleSubmit(JSON.stringify(payload));
  };
  function fileToBase64(file: File): Promise<string> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();

      reader.onload = () => {
        const result = reader.result as string;
        // Remove prefix like "data:application/pdf;base64,"
        const base64Data = result.split(",")[1];
        resolve(base64Data);
      };

      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  }

  return (
    <div className="flex justify-center items-center z-10 w-full gap-4 flex-shrink-0 border-t-2 border-slate-600/80">
      {/* Left: Upload area */}
      <div className="max-w-4xl w-full p-4">
        <div className="flex-1">
          <Tabs
            defaultValue="upload"
            className="w-full"
            onValueChange={(newTab: string) => {
              // Clear data from previous tab
              switch (activeTab) {
                case "upload":
                  setUploadedFile(null);
                  break;
                case "url":
                  setUrlInput("");
                  break;
                case "text":
                  setTextInput("");
                  break;
              }
              setActiveTab(newTab as "upload" | "url" | "text"); // switch to new tab
            }}
          >
            <TabsList className="grid w-full grid-cols-3 mb-6 bg-slate-300">
              <TabsTrigger value="upload" className="flex items-center gap-2">
                <Upload className="w-4 h-4" />
                <span className="font-bold">File Upload</span>
              </TabsTrigger>
              <TabsTrigger value="url" className="flex items-center gap-2">
                <Link className="w-4 h-4" />
                <span className="font-bold">URL/Link</span>
              </TabsTrigger>
              <TabsTrigger value="text" className="flex items-center gap-2">
                <FileText className="w-4 h-4" />
                <span className="font-bold">Direct Text</span>
              </TabsTrigger>
            </TabsList>

            {/* File Upload Tab */}
            <TabsContent value="upload" className="space-y-6">
              <div
                className={`relative border-2 border-dashed rounded-lg p-4 text-center transition-all duration-300 ${
                  dragActive
                    ? "border-secondary bg-primary/5"
                    : "border-secondary hover:bg-slate-400/5"
                }`}
                onDragEnter={handleDrag}
                onDragLeave={handleDrag}
                onDragOver={handleDrag}
                onDrop={handleDrop}
              >
                <input
                  type="file"
                  accept=".pdf,.doc,.docx,.txt"
                  onChange={handleFileSelect}
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                />
                <h3 className="text-lg font-semibold mb-2 text-slate-400">
                  Drag & drop your files here
                </h3>
                <p className="text-muted-foreground mb-4 text-xs">
                  or click to browse files
                </p>
                <div className="flex flex-wrap justify-center gap-2">
                  <Badge variant="secondary">PDF</Badge>
                  <Badge variant="secondary">Word</Badge>
                  <Badge variant="secondary">Text</Badge>
                </div>
              </div>

              {/* Uploaded File */}
              {uploadedFile && (
                <div className="space-y-3">
                  <h4 className="font-medium text-slate-400">Uploaded File:</h4>
                  <div className="flex items-center justify-between p-3 bg-secondary rounded-lg">
                    <div className="flex items-center gap-3">
                      {getFileIcon(uploadedFile.name)}
                      <div>
                        <div className="font-medium">{uploadedFile.name}</div>
                        <div className="text-sm text-muted-foreground">
                          {(uploadedFile.size / 1024 / 1024).toFixed(2)} MB
                        </div>
                      </div>
                    </div>
                    <Button variant="ghost" size="sm" onClick={removeFile}>
                      Remove
                    </Button>
                  </div>
                </div>
              )}
            </TabsContent>

            {/* URL Tab */}
            <TabsContent value="url" className="space-y-6">
              <div>
                <Input
                  placeholder="https://example.com/requirements-doc"
                  value={urlInput}
                  onChange={handleUrlChange}
                  className="h-12 text-slate-50"
                />
                <p className="text-sm text-muted-foreground mt-2">
                  Enter a URL to a publicly accessible requirements document
                </p>
              </div>
            </TabsContent>

            {/* Text Tab */}
            <TabsContent value="text" className="space-y-6">
              <div>
                <Textarea
                  placeholder="Paste your requirements document content here..."
                  value={textInput}
                  onChange={handleTextChange}
                  rows={12}
                  className="resize-none text-slate-50 h-25 overflow-auto"
                />
                <p className="text-sm text-muted-foreground mt-2">
                  Directly paste your PRD content
                </p>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>
      {/* Right: Generate Button */}
      <div className="flex-shrink-0 self-end mb-4">
        <Button
          variant="secondary"
          onClick={onSubmit}
          disabled={!connected || (!uploadedFile && !urlInput && !textInput)}
          className={`text-lg transition-all duration-300 cursor-pointer
              ${
                !connected || (!uploadedFile && !urlInput && !textInput)
                  ? "opacity-50 cursor-not-allowed"
                  : "hover:bg-slate-600 hover:text-secondary cursor-pointer"
              }`}
        >
          Generate Test
        </Button>
      </div>
    </div>
  );
};

export default ChatInput;
