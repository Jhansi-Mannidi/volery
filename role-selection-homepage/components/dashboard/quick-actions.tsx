"use client"

import { useState } from "react"
import Link from "next/link"
import { Building2, Sparkles, Upload, FileBarChart } from "lucide-react"
import { cn } from "@/lib/utils"
import { QuickAddModal } from "@/components/startup/quick-add-modal"
import { UploadDocumentModal } from "@/components/documents/upload-document-modal"
import { CreateReportModal } from "@/components/reports/create-report-modal"

export function QuickActions() {
  const [quickAddOpen, setQuickAddOpen] = useState(false)
  const [uploadDocumentOpen, setUploadDocumentOpen] = useState(false)
  const [createReportOpen, setCreateReportOpen] = useState(false)

  return (
    <>
      <div className="bg-card rounded-lg border border-border p-4">
        <h2 className="font-semibold text-card-foreground mb-4">Quick Actions</h2>
        <div className="grid grid-cols-2 gap-3">
          {/* Add Startup - Opens Modal */}
          <button
            onClick={() => setQuickAddOpen(true)}
            className="flex flex-col items-center gap-2 p-4 rounded-lg border border-border hover:border-primary/30 hover:bg-muted/30 transition-colors"
          >
            <div className="w-10 h-10 rounded-lg flex items-center justify-center bg-primary/10">
              <Building2 className="w-5 h-5 text-primary" />
            </div>
            <span className="text-sm font-medium text-card-foreground text-center">Add Startup</span>
          </button>

          {/* Find Matches */}
          <Link
            href="/matching"
            className="flex flex-col items-center gap-2 p-4 rounded-lg border border-border hover:border-primary/30 hover:bg-muted/30 transition-colors"
          >
            <div className="w-10 h-10 rounded-lg flex items-center justify-center bg-emerald-500/10">
              <Sparkles className="w-5 h-5 text-emerald-500" />
            </div>
            <span className="text-sm font-medium text-card-foreground text-center">Find Matches</span>
          </Link>

          {/* Upload Document - Opens Modal */}
          <button
            onClick={() => setUploadDocumentOpen(true)}
            className="flex flex-col items-center gap-2 p-4 rounded-lg border border-border hover:border-primary/30 hover:bg-muted/30 transition-colors"
          >
            <div className="w-10 h-10 rounded-lg flex items-center justify-center bg-blue-500/10">
              <Upload className="w-5 h-5 text-blue-500" />
            </div>
            <span className="text-sm font-medium text-card-foreground text-center">Upload Document</span>
          </button>

          {/* Create Report - Opens Modal */}
          <button
            onClick={() => setCreateReportOpen(true)}
            className="flex flex-col items-center gap-2 p-4 rounded-lg border border-border hover:border-primary/30 hover:bg-muted/30 transition-colors"
          >
            <div className="w-10 h-10 rounded-lg flex items-center justify-center bg-purple-500/10">
              <FileBarChart className="w-5 h-5 text-purple-500" />
            </div>
            <span className="text-sm font-medium text-card-foreground text-center">Create Report</span>
          </button>
        </div>
      </div>

      {/* Modals */}
      <QuickAddModal open={quickAddOpen} onOpenChange={setQuickAddOpen} />
      <UploadDocumentModal open={uploadDocumentOpen} onOpenChange={setUploadDocumentOpen} />
      <CreateReportModal open={createReportOpen} onOpenChange={setCreateReportOpen} />
    </>
  )
}
