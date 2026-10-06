'use client'

import React from "react"

import { useState } from 'react'
import { DashboardHeader } from '@/components/dashboard/header'
import { DashboardSidebar } from '@/components/dashboard/sidebar'
import { ProtectedRoute } from '@/components/auth/protected-route'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import {
  Upload,
  FileText,
  FileSpreadsheet,
  File,
  Settings,
  History,
  CheckCircle2,
  Clock,
  AlertTriangle,
  Download,
  RefreshCw,
  Eye,
  Edit,
  FolderPlus,
  Sparkles,
  Building2,
  DollarSign,
  Users,
  X,
} from 'lucide-react'

// Mock data for processing queue
const mockProcessingQueue = [
  {
    id: 1,
    name: 'TechCorp_PitchDeck_v3.pdf',
    status: 'complete',
    dataPoints: 45,
    confidence: 94,
    timestamp: '2 min ago',
  },
  {
    id: 2,
    name: 'Financial_Model_2026.xlsx',
    status: 'processing',
    progress: 60,
    currentTask: 'Analyzing: Revenue projections, Unit economics...',
    estimate: '1 min',
  },
  {
    id: 3,
    name: 'Cap_Table_Jan2026.pdf',
    status: 'review',
    dataPoints: 32,
    confidence: 78,
    warningCount: 3,
    timestamp: '5 min ago',
  },
]

export default function DataExtractionPage() {
  const [isDragging, setIsDragging] = useState(false)
  const [selectedFile, setSelectedFile] = useState<number | null>(null)

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(true)
  }

  const handleDragLeave = () => {
    setIsDragging(false)
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
    // Handle file drop logic here
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'complete':
        return <CheckCircle2 className="w-5 h-5 text-green-600" />
      case 'processing':
        return <Clock className="w-5 h-5 text-blue-600 animate-spin" />
      case 'review':
        return <AlertTriangle className="w-5 h-5 text-amber-600" />
      default:
        return null
    }
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'complete':
        return <Badge className="bg-green-100 text-green-700 hover:bg-green-100">Complete</Badge>
      case 'processing':
        return <Badge className="bg-blue-100 text-blue-700 hover:bg-blue-100">Processing</Badge>
      case 'review':
        return <Badge className="bg-amber-100 text-amber-700 hover:bg-amber-100">Needs Review</Badge>
      default:
        return null
    }
  }

  return (
    <ProtectedRoute>
      <div className="flex flex-col h-screen bg-background">
        <DashboardHeader title="AI Data Extraction" />
        <div className="flex flex-1 overflow-hidden">
          <DashboardSidebar />
          <main className="flex-1 overflow-auto">
            <div className="p-4 md:p-6">
              <div className="max-w-[1600px] mx-auto space-y-6">
                {/* Header */}
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                  <div>
                    <h1 className="text-3xl font-bold text-foreground flex items-center gap-2">
                      <Sparkles className="w-7 h-7 text-cyan-600" />
                      AI Data Extraction
                    </h1>
                    <p className="text-muted-foreground mt-1">
                      Upload documents and let AI extract key metrics
                    </p>
                  </div>
                  <div className="flex gap-2 flex-wrap">
                    <Button variant="outline" size="sm" className="gap-1 bg-transparent">
                      <History className="w-4 h-4" />
                      View History
                    </Button>
                    <Button variant="outline" size="sm" className="gap-1 bg-transparent">
                      <Settings className="w-4 h-4" />
                      Settings
                    </Button>
                  </div>
                </div>

                {/* Upload Area */}
                <Card>
                  <CardContent className="p-8">
                    <div
                      className={`border-2 border-dashed rounded-lg p-12 text-center transition-all ${
                        isDragging
                          ? 'border-cyan-500 bg-cyan-50/50'
                          : 'border-border hover:border-cyan-300 hover:bg-muted/30'
                      }`}
                      onDragOver={handleDragOver}
                      onDragLeave={handleDragLeave}
                      onDrop={handleDrop}
                    >
                      <div className="flex flex-col items-center gap-4">
                        <div className="w-20 h-20 rounded-full bg-cyan-100 flex items-center justify-center">
                          <Upload className="w-10 h-10 text-cyan-600" />
                        </div>
                        <div className="space-y-2">
                          <h3 className="text-xl font-semibold text-foreground">
                            Drop files here
                          </h3>
                          <p className="text-sm text-muted-foreground">
                            or click to browse
                          </p>
                        </div>
                        <p className="text-xs text-muted-foreground">
                          Supported: PDF, XLSX, DOCX, PPTX, Images
                        </p>
                        <Button className="mt-2">
                          <Upload className="w-4 h-4 mr-2" />
                          Choose Files
                        </Button>
                      </div>
                    </div>

                    {/* Quick Templates */}
                    <div className="mt-6 pt-6 border-t border-border">
                      <p className="text-sm font-medium text-muted-foreground mb-3">
                        Quick Templates:
                      </p>
                      <div className="flex flex-wrap gap-2">
                        {['Pitch Deck', 'Financial Model', 'Cap Table', 'Term Sheet'].map(
                          (template) => (
                            <Button
                              key={template}
                              variant="outline"
                              size="sm"
                              className="bg-transparent"
                            >
                              <FileText className="w-3 h-3 mr-2" />
                              {template}
                            </Button>
                          )
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Processing Queue */}
                <Card>
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <FileSpreadsheet className="w-5 h-5 text-cyan-600" />
                        <CardTitle>Processing Queue</CardTitle>
                      </div>
                      <Button variant="ghost" size="sm" className="text-muted-foreground">
                        Clear All
                      </Button>
                    </div>
                    <CardDescription>Track extraction progress and review results</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {mockProcessingQueue.map((item) => (
                      <div
                        key={item.id}
                        className={`border rounded-lg p-4 transition-all ${
                          selectedFile === item.id
                            ? 'border-cyan-500 bg-cyan-50/30'
                            : 'border-border hover:border-cyan-200 hover:bg-muted/30'
                        }`}
                      >
                        <div className="flex items-start justify-between gap-4">
                          <div className="flex items-start gap-3 flex-1">
                            {getStatusIcon(item.status)}
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center gap-2 mb-1">
                                <h4 className="font-semibold text-sm text-foreground truncate">
                                  {item.name}
                                </h4>
                                {getStatusBadge(item.status)}
                              </div>

                              {item.status === 'complete' && (
                                <div className="space-y-2">
                                  <p className="text-xs text-muted-foreground">
                                    {item.dataPoints} data points extracted • Confidence:{' '}
                                    {item.confidence}%
                                  </p>
                                  <div className="flex flex-wrap gap-2">
                                    <Button
                                      size="sm"
                                      variant="outline"
                                      className="bg-transparent"
                                      onClick={() => setSelectedFile(item.id)}
                                    >
                                      <Eye className="w-3 h-3 mr-1" />
                                      View Extraction
                                    </Button>
                                    <Button size="sm" variant="outline" className="bg-transparent">
                                      <FolderPlus className="w-3 h-3 mr-1" />
                                      Add to Research
                                    </Button>
                                    <Button size="sm" variant="outline" className="bg-transparent">
                                      <RefreshCw className="w-3 h-3 mr-1" />
                                      Re-process
                                    </Button>
                                  </div>
                                </div>
                              )}

                              {item.status === 'processing' && (
                                <div className="space-y-2">
                                  <div className="flex items-center gap-3">
                                    <Progress value={item.progress} className="flex-1" />
                                    <span className="text-xs font-medium text-muted-foreground">
                                      {item.progress}%
                                    </span>
                                  </div>
                                  <p className="text-xs text-muted-foreground">
                                    {item.currentTask}
                                  </p>
                                </div>
                              )}

                              {item.status === 'review' && (
                                <div className="space-y-2">
                                  <p className="text-xs text-muted-foreground">
                                    {item.dataPoints} data points • Confidence: {item.confidence}%
                                    (low in some fields)
                                  </p>
                                  <p className="text-xs text-amber-600 font-medium flex items-center gap-1">
                                    <AlertTriangle className="w-3 h-3" />
                                    {item.warningCount} fields need manual verification
                                  </p>
                                  <div className="flex flex-wrap gap-2">
                                    <Button size="sm" variant="default">
                                      <Edit className="w-3 h-3 mr-1" />
                                      Review & Fix
                                    </Button>
                                    <Button size="sm" variant="outline" className="bg-transparent">
                                      <RefreshCw className="w-3 h-3 mr-1" />
                                      Re-process with OCR
                                    </Button>
                                  </div>
                                </div>
                              )}
                            </div>
                          </div>
                          <div className="text-xs text-muted-foreground">
                            {item.timestamp || `Est. ${item.estimate}`}
                          </div>
                        </div>
                      </div>
                    ))}
                  </CardContent>
                </Card>

                {/* Extraction Results (shown when a file is selected) */}
                {selectedFile === 1 && (
                  <Card>
                    <CardHeader>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <FileText className="w-5 h-5 text-cyan-600" />
                          <CardTitle>TechCorp_PitchDeck_v3.pdf - Extraction Results</CardTitle>
                        </div>
                        <div className="flex gap-2">
                          <Button size="sm" variant="outline" className="bg-transparent">
                            <Download className="w-4 h-4 mr-2" />
                            Export
                          </Button>
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => setSelectedFile(null)}
                          >
                            <X className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-6">
                      {/* Overall Confidence */}
                      <div>
                        <p className="text-sm font-medium text-muted-foreground mb-2">
                          Overall Confidence:
                        </p>
                        <div className="flex items-center gap-3">
                          <Progress value={94} className="flex-1" />
                          <span className="text-sm font-semibold text-foreground">94%</span>
                        </div>
                      </div>

                      {/* Company Information */}
                      <div className="border rounded-lg p-4 bg-muted/30">
                        <div className="flex items-center justify-between mb-3">
                          <div className="flex items-center gap-2">
                            <Building2 className="w-5 h-5 text-cyan-600" />
                            <h3 className="font-semibold text-foreground">Company Information</h3>
                          </div>
                          <Badge className="bg-green-100 text-green-700 hover:bg-green-100">
                            Confidence: 98%
                          </Badge>
                        </div>
                        <div className="space-y-3 text-sm">
                          <div className="grid grid-cols-2 gap-x-4">
                            <div className="flex justify-between py-2 border-b border-border">
                              <span className="text-muted-foreground">Company Name:</span>
                              <span className="font-medium text-foreground">TechCorp AI</span>
                            </div>
                            <div className="flex items-center justify-end text-xs text-green-600">
                              <CheckCircle2 className="w-3 h-3 mr-1" />
                              High confidence
                            </div>
                          </div>
                          <div className="grid grid-cols-2 gap-x-4">
                            <div className="flex justify-between py-2 border-b border-border">
                              <span className="text-muted-foreground">Founded:</span>
                              <span className="font-medium text-foreground">2022</span>
                            </div>
                            <div className="flex items-center justify-end text-xs text-green-600">
                              <CheckCircle2 className="w-3 h-3 mr-1" />
                              High confidence
                            </div>
                          </div>
                          <div className="grid grid-cols-2 gap-x-4">
                            <div className="flex justify-between py-2 border-b border-border">
                              <span className="text-muted-foreground">Headquarters:</span>
                              <span className="font-medium text-foreground">Bangalore, India</span>
                            </div>
                            <div className="flex items-center justify-end text-xs text-green-600">
                              <CheckCircle2 className="w-3 h-3 mr-1" />
                              High confidence
                            </div>
                          </div>
                          <div className="grid grid-cols-2 gap-x-4">
                            <div className="flex justify-between py-2 border-b border-border">
                              <span className="text-muted-foreground">Sector:</span>
                              <span className="font-medium text-foreground">Fintech / AI</span>
                            </div>
                            <div className="flex items-center justify-end text-xs text-green-600">
                              <CheckCircle2 className="w-3 h-3 mr-1" />
                              High confidence
                            </div>
                          </div>
                          <div className="grid grid-cols-2 gap-x-4">
                            <div className="flex justify-between py-2">
                              <span className="text-muted-foreground">Stage:</span>
                              <span className="font-medium text-foreground">Series A</span>
                            </div>
                            <div className="flex items-center justify-end text-xs text-green-600">
                              <CheckCircle2 className="w-3 h-3 mr-1" />
                              High confidence
                            </div>
                          </div>
                        </div>
                        <div className="flex gap-2 mt-4 pt-4 border-t border-border">
                          <Button size="sm" variant="default">
                            Accept All
                          </Button>
                          <Button size="sm" variant="outline" className="bg-transparent">
                            <Edit className="w-3 h-3 mr-1" />
                            Edit
                          </Button>
                        </div>
                      </div>

                      {/* Financial Metrics */}
                      <div className="border rounded-lg p-4 bg-muted/30">
                        <div className="flex items-center justify-between mb-3">
                          <div className="flex items-center gap-2">
                            <DollarSign className="w-5 h-5 text-cyan-600" />
                            <h3 className="font-semibold text-foreground">Financial Metrics</h3>
                          </div>
                          <Badge className="bg-green-100 text-green-700 hover:bg-green-100">
                            Confidence: 92%
                          </Badge>
                        </div>
                        <div className="space-y-3 text-sm">
                          <div className="grid grid-cols-2 gap-x-4">
                            <div className="flex justify-between py-2 border-b border-border">
                              <span className="text-muted-foreground">Current ARR:</span>
                              <span className="font-medium text-foreground">₹12 Cr</span>
                            </div>
                            <div className="flex items-center justify-end text-xs text-green-600">
                              <CheckCircle2 className="w-3 h-3 mr-1" />
                              High confidence
                            </div>
                          </div>
                          <div className="grid grid-cols-2 gap-x-4">
                            <div className="flex justify-between py-2 border-b border-border">
                              <span className="text-muted-foreground">MRR:</span>
                              <span className="font-medium text-foreground">₹1 Cr</span>
                            </div>
                            <div className="flex items-center justify-end text-xs text-green-600">
                              <CheckCircle2 className="w-3 h-3 mr-1" />
                              High confidence
                            </div>
                          </div>
                          <div className="grid grid-cols-2 gap-x-4">
                            <div className="flex justify-between py-2 border-b border-border">
                              <span className="text-muted-foreground">Gross Margin:</span>
                              <span className="font-medium text-foreground">85%</span>
                            </div>
                            <div className="flex items-center justify-end text-xs text-green-600">
                              <CheckCircle2 className="w-3 h-3 mr-1" />
                              High confidence
                            </div>
                          </div>
                          <div className="grid grid-cols-2 gap-x-4">
                            <div className="flex justify-between py-2 border-b border-border">
                              <span className="text-muted-foreground">Burn Rate:</span>
                              <span className="font-medium text-foreground">₹45 L/month</span>
                            </div>
                            <div className="flex items-center justify-end text-xs text-amber-600">
                              <AlertTriangle className="w-3 h-3 mr-1" />
                              Medium (verify)
                            </div>
                          </div>
                          <div className="grid grid-cols-2 gap-x-4">
                            <div className="flex justify-between py-2">
                              <span className="text-muted-foreground">Runway:</span>
                              <span className="font-medium text-foreground">18 months</span>
                            </div>
                            <div className="flex items-center justify-end text-xs text-amber-600">
                              <AlertTriangle className="w-3 h-3 mr-1" />
                              Medium (verify)
                            </div>
                          </div>
                        </div>
                        <div className="flex gap-2 mt-4 pt-4 border-t border-border">
                          <Button size="sm" variant="default">
                            Accept All
                          </Button>
                          <Button size="sm" variant="outline" className="bg-transparent">
                            <Edit className="w-3 h-3 mr-1" />
                            Edit
                          </Button>
                          <Button size="sm" variant="outline" className="bg-transparent">
                            Request Source
                          </Button>
                        </div>
                      </div>

                      {/* Team Information */}
                      <div className="border rounded-lg p-4 bg-muted/30">
                        <div className="flex items-center justify-between mb-3">
                          <div className="flex items-center gap-2">
                            <Users className="w-5 h-5 text-cyan-600" />
                            <h3 className="font-semibold text-foreground">Team Information</h3>
                          </div>
                          <Badge className="bg-green-100 text-green-700 hover:bg-green-100">
                            Confidence: 96%
                          </Badge>
                        </div>
                        <div className="space-y-3 text-sm">
                          <div className="grid grid-cols-2 gap-x-4">
                            <div className="flex justify-between py-2 border-b border-border">
                              <span className="text-muted-foreground">Founders:</span>
                              <span className="font-medium text-foreground">
                                2 (Vikram CEO, Anita CTO)
                              </span>
                            </div>
                            <div className="flex items-center justify-end text-xs text-green-600">
                              <CheckCircle2 className="w-3 h-3 mr-1" />
                              High confidence
                            </div>
                          </div>
                          <div className="grid grid-cols-2 gap-x-4">
                            <div className="flex justify-between py-2 border-b border-border">
                              <span className="text-muted-foreground">Team Size:</span>
                              <span className="font-medium text-foreground">22 employees</span>
                            </div>
                            <div className="flex items-center justify-end text-xs text-green-600">
                              <CheckCircle2 className="w-3 h-3 mr-1" />
                              High confidence
                            </div>
                          </div>
                          <div className="grid grid-cols-2 gap-x-4">
                            <div className="flex justify-between py-2">
                              <span className="text-muted-foreground">Engineering %:</span>
                              <span className="font-medium text-foreground">60%</span>
                            </div>
                            <div className="flex items-center justify-end text-xs text-green-600">
                              <CheckCircle2 className="w-3 h-3 mr-1" />
                              High confidence
                            </div>
                          </div>
                        </div>
                        <div className="flex gap-2 mt-4 pt-4 border-t border-border">
                          <Button size="sm" variant="default">
                            Accept All
                          </Button>
                          <Button size="sm" variant="outline" className="bg-transparent">
                            <Edit className="w-3 h-3 mr-1" />
                            Edit
                          </Button>
                          <Button size="sm" variant="outline" className="bg-transparent">
                            Verify via LinkedIn
                          </Button>
                        </div>
                      </div>

                      {/* Action Buttons */}
                      <div className="flex flex-wrap gap-3 pt-4 border-t border-border">
                        <Button size="default">Accept All Extractions</Button>
                        <Button variant="outline" className="bg-transparent">
                          <FolderPlus className="w-4 h-4 mr-2" />
                          Export to Research
                        </Button>
                        <Button variant="outline" className="bg-transparent">
                          Request Founder Verification
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                )}
              </div>
            </div>
          </main>
        </div>
      </div>
    </ProtectedRoute>
  )
}
