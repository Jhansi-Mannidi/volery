"use client"

import React from "react"

import { useState, useCallback } from "react"
import { cn } from "@/lib/utils"
import {
  Building2,
  Check,
  File,
  FileSpreadsheet,
  FileText,
  Presentation,
  Trash2,
  Upload,
  Users,
  X,
} from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Progress } from "@/components/ui/progress"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Separator } from "@/components/ui/separator"
import { Textarea } from "@/components/ui/textarea"

interface UploadDocumentModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

interface UploadedFile {
  id: string
  name: string
  size: string
  type: string
  progress: number
  status: "uploading" | "complete" | "error"
  documentType: string
  relatedTo: string
  relatedToType: "startup" | "investor" | "none"
  description: string
  tags: string[]
}

const documentTypes = ["Pitch Deck", "Financial Model", "Legal", "Due Diligence", "Research", "Other"]

const mockStartups = [
  { id: "1", name: "TechCorp AI" },
  { id: "2", name: "GreenLeaf Energy" },
  { id: "3", name: "HealthBridge" },
  { id: "4", name: "EduSpark" },
  { id: "5", name: "LogiFlow" },
]

const mockInvestors = [
  { id: "1", name: "Sequoia Capital" },
  { id: "2", name: "Accel Partners" },
  { id: "3", name: "Matrix Partners India" },
]

function getFileIcon(filename: string) {
  const ext = filename.split(".").pop()?.toLowerCase()
  switch (ext) {
    case "pdf":
      return <FileText className="w-5 h-5 text-red-500" />
    case "xlsx":
    case "xls":
    case "csv":
      return <FileSpreadsheet className="w-5 h-5 text-green-500" />
    case "pptx":
    case "ppt":
      return <Presentation className="w-5 h-5 text-orange-500" />
    default:
      return <File className="w-5 h-5 text-muted-foreground" />
  }
}

function formatFileSize(bytes: number): string {
  if (bytes === 0) return "0 Bytes"
  const k = 1024
  const sizes = ["Bytes", "KB", "MB", "GB"]
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + " " + sizes[i]
}

export function UploadDocumentModal({ open, onOpenChange }: UploadDocumentModalProps) {
  const [isDragOver, setIsDragOver] = useState(false)
  const [files, setFiles] = useState<UploadedFile[]>([])
  const [currentStep, setCurrentStep] = useState<"upload" | "details">("upload")

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragOver(true)
  }, [])

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragOver(false)
  }, [])

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragOver(false)
    const droppedFiles = Array.from(e.dataTransfer.files)
    addFiles(droppedFiles)
  }, [])

  const handleFileSelect = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const selectedFiles = Array.from(e.target.files)
      addFiles(selectedFiles)
    }
  }, [])

  const addFiles = (newFiles: File[]) => {
    const uploadedFiles: UploadedFile[] = newFiles.map((file) => ({
      id: Math.random().toString(36).substring(7),
      name: file.name,
      size: formatFileSize(file.size),
      type: file.type,
      progress: 0,
      status: "uploading" as const,
      documentType: "",
      relatedTo: "",
      relatedToType: "none" as const,
      description: "",
      tags: [],
    }))

    setFiles((prev) => [...prev, ...uploadedFiles])

    // Simulate upload progress
    uploadedFiles.forEach((file) => {
      simulateUpload(file.id)
    })
  }

  const simulateUpload = (fileId: string) => {
    let progress = 0
    const interval = setInterval(() => {
      progress += Math.random() * 30
      if (progress >= 100) {
        progress = 100
        clearInterval(interval)
        setFiles((prev) =>
          prev.map((f) => (f.id === fileId ? { ...f, progress: 100, status: "complete" } : f))
        )
      } else {
        setFiles((prev) =>
          prev.map((f) => (f.id === fileId ? { ...f, progress } : f))
        )
      }
    }, 500)
  }

  const removeFile = (fileId: string) => {
    setFiles((prev) => prev.filter((f) => f.id !== fileId))
  }

  const updateFileDetails = (fileId: string, updates: Partial<UploadedFile>) => {
    setFiles((prev) =>
      prev.map((f) => (f.id === fileId ? { ...f, ...updates } : f))
    )
  }

  const handleContinue = () => {
    if (files.length > 0 && files.every((f) => f.status === "complete")) {
      setCurrentStep("details")
    }
  }

  const handleUpload = () => {
    // Here you would submit the files with their metadata
    onOpenChange(false)
    setFiles([])
    setCurrentStep("upload")
  }

  const handleClose = () => {
    onOpenChange(false)
    setFiles([])
    setCurrentStep("upload")
  }

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="max-w-[600px]" onCloseAutoFocus={(e) => e.preventDefault()}>
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Upload className="w-5 h-5 text-primary" />
            Upload Documents
          </DialogTitle>
          <DialogDescription>
            {currentStep === "upload"
              ? "Drag and drop files or click to browse"
              : "Add details for your uploaded documents"}
          </DialogDescription>
        </DialogHeader>

        {currentStep === "upload" && (
          <div className="mt-4 space-y-4">
            {/* Drop Zone */}
            <div
              className={cn(
                "border-2 border-dashed rounded-lg p-8 text-center transition-colors",
                isDragOver
                  ? "border-primary bg-primary/5"
                  : "border-border hover:border-primary/50 hover:bg-muted/50"
              )}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
            >
              <div className="flex flex-col items-center">
                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                  <Upload className="w-6 h-6 text-primary" />
                </div>
                <p className="text-sm font-medium text-foreground mb-1">
                  Drag and drop files here
                </p>
                <p className="text-xs text-muted-foreground mb-4">or</p>
                <label>
                  <input
                    type="file"
                    className="hidden"
                    multiple
                    accept=".pdf,.pptx,.ppt,.xlsx,.xls,.csv,.doc,.docx"
                    onChange={handleFileSelect}
                  />
                  <Button variant="outline" size="sm" asChild>
                    <span className="cursor-pointer">Browse Files</span>
                  </Button>
                </label>
                <p className="text-xs text-muted-foreground mt-4">
                  Supported: PDF, PPTX, XLSX, DOC (Max 50MB per file)
                </p>
              </div>
            </div>

            {/* File List */}
            {files.length > 0 && (
              <div className="space-y-2">
                <Label className="text-sm font-medium">Uploading Files</Label>
                <div className="space-y-2 max-h-[200px] overflow-y-auto">
                  {files.map((file) => (
                    <div
                      key={file.id}
                      className="flex items-center gap-3 p-3 rounded-lg bg-muted/50 border"
                    >
                      {getFileIcon(file.name)}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between mb-1">
                          <p className="text-sm font-medium text-foreground truncate">
                            {file.name}
                          </p>
                          <span className="text-xs text-muted-foreground shrink-0 ml-2">
                            {file.size}
                          </span>
                        </div>
                        {file.status === "uploading" && (
                          <Progress value={file.progress} className="h-1.5" />
                        )}
                        {file.status === "complete" && (
                          <div className="flex items-center gap-1 text-xs text-green-600 dark:text-green-400">
                            <Check className="w-3 h-3" />
                            Complete
                          </div>
                        )}
                      </div>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 shrink-0"
                        onClick={() => removeFile(file.id)}
                      >
                        <Trash2 className="w-4 h-4 text-muted-foreground" />
                      </Button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div className="flex justify-end gap-2 pt-4">
              <Button variant="outline" onClick={handleClose}>
                Cancel
              </Button>
              <Button
                className="bg-primary text-primary-foreground hover:bg-primary/90"
                disabled={files.length === 0 || !files.every((f) => f.status === "complete")}
                onClick={handleContinue}
              >
                Continue
              </Button>
            </div>
          </div>
        )}

        {currentStep === "details" && (
          <div className="mt-4 space-y-4">
            <div className="max-h-[400px] overflow-y-auto space-y-6">
              {files.map((file, index) => (
                <div key={file.id} className="space-y-4">
                  {index > 0 && <Separator />}

                  {/* File Header */}
                  <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/50 border">
                    {getFileIcon(file.name)}
                    <div className="flex-1 min-w-0">
                      <Input
                        value={file.name}
                        onChange={(e) => updateFileDetails(file.id, { name: e.target.value })}
                        className="h-8 font-medium"
                      />
                    </div>
                    <span className="text-xs text-muted-foreground shrink-0">{file.size}</span>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    {/* Document Type */}
                    <div>
                      <Label className="text-sm font-medium mb-2 block">Document Type</Label>
                      <Select
                        value={file.documentType}
                        onValueChange={(value) => updateFileDetails(file.id, { documentType: value })}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select type" />
                        </SelectTrigger>
                        <SelectContent>
                          {documentTypes.map((type) => (
                            <SelectItem key={type} value={type}>
                              {type}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    {/* Related To Type */}
                    <div>
                      <Label className="text-sm font-medium mb-2 block">Related To</Label>
                      <Select
                        value={file.relatedToType}
                        onValueChange={(value) =>
                          updateFileDetails(file.id, {
                            relatedToType: value as "startup" | "investor" | "none",
                            relatedTo: "",
                          })
                        }
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select type" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="none">None</SelectItem>
                          <SelectItem value="startup">
                            <div className="flex items-center gap-2">
                              <Building2 className="w-4 h-4" />
                              Startup
                            </div>
                          </SelectItem>
                          <SelectItem value="investor">
                            <div className="flex items-center gap-2">
                              <Users className="w-4 h-4" />
                              Investor
                            </div>
                          </SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  {/* Related Entity Selector */}
                  {file.relatedToType !== "none" && (
                    <div>
                      <Label className="text-sm font-medium mb-2 block">
                        Select {file.relatedToType === "startup" ? "Startup" : "Investor"}
                      </Label>
                      <Select
                        value={file.relatedTo}
                        onValueChange={(value) => updateFileDetails(file.id, { relatedTo: value })}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder={`Select ${file.relatedToType}`} />
                        </SelectTrigger>
                        <SelectContent>
                          {(file.relatedToType === "startup" ? mockStartups : mockInvestors).map(
                            (entity) => (
                              <SelectItem key={entity.id} value={entity.id}>
                                {entity.name}
                              </SelectItem>
                            )
                          )}
                        </SelectContent>
                      </Select>
                    </div>
                  )}

                  {/* Description */}
                  <div>
                    <Label className="text-sm font-medium mb-2 block">Description (Optional)</Label>
                    <Textarea
                      placeholder="Add a description..."
                      rows={2}
                      value={file.description}
                      onChange={(e) => updateFileDetails(file.id, { description: e.target.value })}
                    />
                  </div>

                  {/* Tags */}
                  <div>
                    <Label className="text-sm font-medium mb-2 block">Tags</Label>
                    <Input
                      placeholder="Enter tags separated by commas"
                      onKeyDown={(e) => {
                        if (e.key === "Enter") {
                          const input = e.target as HTMLInputElement
                          const newTags = input.value
                            .split(",")
                            .map((t) => t.trim())
                            .filter((t) => t && !file.tags.includes(t))
                          if (newTags.length > 0) {
                            updateFileDetails(file.id, { tags: [...file.tags, ...newTags] })
                            input.value = ""
                          }
                        }
                      }}
                    />
                    {file.tags.length > 0 && (
                      <div className="flex flex-wrap gap-1 mt-2">
                        {file.tags.map((tag) => (
                          <Badge
                            key={tag}
                            variant="secondary"
                            className="cursor-pointer hover:bg-destructive/10 hover:text-destructive"
                            onClick={() =>
                              updateFileDetails(file.id, {
                                tags: file.tags.filter((t) => t !== tag),
                              })
                            }
                          >
                            {tag}
                            <X className="w-3 h-3 ml-1" />
                          </Badge>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>

            <div className="flex justify-between pt-4">
              <Button variant="outline" onClick={() => setCurrentStep("upload")}>
                Back
              </Button>
              <div className="flex gap-2">
                <Button variant="outline" onClick={() => addFiles([])}>
                  Upload More
                </Button>
                <Button
                  className="bg-primary text-primary-foreground hover:bg-primary/90"
                  onClick={handleUpload}
                >
                  Done
                </Button>
              </div>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  )
}
