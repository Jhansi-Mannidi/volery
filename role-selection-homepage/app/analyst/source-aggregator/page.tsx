'use client'

import { useState } from 'react'
import { DashboardHeader } from '@/components/dashboard/header'
import { DashboardSidebar } from '@/components/dashboard/sidebar'
import { ProtectedRoute } from '@/components/auth/protected-route'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import {
  Plus,
  RefreshCw,
  Download,
  FileText,
  FileSpreadsheet,
  File,
  Link2,
  Newspaper,
  Database,
  Eye,
  RotateCw,
  Clock,
  CheckCircle2,
  Grid3X3,
  List,
  Table as TableIcon,
  Sparkles,
  ExternalLink,
} from 'lucide-react'

// Mock data for documents
const mockDocuments = [
  {
    id: 1,
    name: 'Pitch Deck v3',
    type: 'PDF',
    size: '2.4 MB',
    uploadedDate: 'Jan 20',
    status: 'analyzed',
    icon: FileText,
  },
  {
    id: 2,
    name: 'Financial Model',
    type: 'XLSX',
    size: '1.2 MB',
    uploadedDate: 'Jan 18',
    status: 'analyzed',
    icon: FileSpreadsheet,
  },
  {
    id: 3,
    name: 'Cap Table',
    type: 'PDF',
    size: '450 KB',
    uploadedDate: 'Jan 22',
    status: 'processing',
    icon: FileText,
  },
  {
    id: 4,
    name: 'Term Sheet',
    type: 'PDF',
    size: '380 KB',
    uploadedDate: 'Jan 15',
    status: 'analyzed',
    icon: FileText,
  },
  {
    id: 5,
    name: 'Business Plan',
    type: 'DOCX',
    size: '1.8 MB',
    uploadedDate: 'Jan 12',
    status: 'analyzed',
    icon: File,
  },
]

// Mock data for external links
const mockExternalLinks = [
  {
    id: 1,
    name: 'Crunchbase',
    description: 'Company Profile',
    lastSync: '2h ago',
    autoUpdate: true,
    icon: '🏢',
  },
  {
    id: 2,
    name: 'LinkedIn Company',
    description: '22 employees',
    lastSync: '1d ago',
    autoUpdate: true,
    icon: '💼',
  },
  {
    id: 3,
    name: 'Website',
    description: 'techcorp-ai.com',
    lastSync: '1d ago',
    autoUpdate: true,
    icon: '🌐',
  },
  {
    id: 4,
    name: 'GitHub',
    description: '5 repositories',
    lastSync: '12h ago',
    autoUpdate: true,
    icon: '💻',
  },
  {
    id: 5,
    name: 'Twitter',
    description: '@TechCorpAI',
    lastSync: '6h ago',
    autoUpdate: true,
    icon: '🐦',
  },
]

// Mock data for news articles
const mockNews = [
  {
    id: 1,
    title: 'TechCorp AI raises $5M Seed round',
    source: 'Economic Times',
    date: 'Jan 15',
  },
  {
    id: 2,
    title: 'Top 10 Fintech Startups to Watch',
    source: 'YourStory',
    date: 'Jan 10',
  },
  {
    id: 3,
    title: 'AI in Financial Services',
    source: 'LiveMint (mentions TechCorp)',
    date: 'Dec 28',
  },
  {
    id: 4,
    title: 'Bangalore Startup Ecosystem Report',
    source: 'Inc42',
    date: 'Dec 15',
  },
]

// Mock data for Data APIs
const mockDataAPIs = [
  {
    id: 1,
    name: 'Tracxn',
    description: 'Startup Database',
    status: 'connected',
    lastPull: '1h ago',
    icon: '📊',
  },
  {
    id: 2,
    name: 'PitchBook',
    description: 'Financial Data',
    status: 'connected',
    lastPull: '3h ago',
    icon: '📈',
  },
]

export default function SourceAggregatorPage() {
  const [viewMode, setViewMode] = useState<'grid' | 'list' | 'table'>('grid')
  const [activeTab, setActiveTab] = useState('all')
  
  const totalSources = mockDocuments.length + mockExternalLinks.length + mockNews.length + mockDataAPIs.length

  return (
    <ProtectedRoute>
      <div className="flex flex-col h-screen bg-background">
        <DashboardHeader title="Source Aggregation" />
        <div className="flex flex-1 overflow-hidden">
          <DashboardSidebar />
          <main className="flex-1 overflow-auto">
            <div className="p-4 md:p-6">
              <div className="max-w-[1600px] mx-auto space-y-6">
                {/* Page Title */}
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                  <div>
                    <h1 className="text-3xl font-bold text-foreground flex items-center gap-2">
                      <Link2 className="w-8 h-8 text-cyan-600" />
                      Source Aggregation
                    </h1>
                    <p className="text-sm text-muted-foreground mt-1">
                      Company: <span className="font-medium text-foreground">TechCorp AI</span> • {totalSources} sources linked
                    </p>
                  </div>
                  <div className="flex gap-2 flex-wrap">
                    <Button variant="outline" size="sm" className="gap-1 bg-transparent">
                      <RefreshCw className="w-4 h-4" />
                      Refresh All
                    </Button>
                    <Button variant="outline" size="sm" className="gap-1 bg-transparent">
                      <Download className="w-4 h-4" />
                      Export
                    </Button>
                    <Button size="sm" className="gap-1">
                      <Plus className="w-4 h-4" />
                      Add Source
                    </Button>
                  </div>
                </div>

                {/* Tabs for Source Categories */}
                <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                  <TabsList className="grid w-full grid-cols-5 lg:w-auto lg:inline-grid">
                    <TabsTrigger value="all">All Sources ({totalSources})</TabsTrigger>
                    <TabsTrigger value="documents">Documents ({mockDocuments.length})</TabsTrigger>
                    <TabsTrigger value="links">External Links ({mockExternalLinks.length})</TabsTrigger>
                    <TabsTrigger value="news">News ({mockNews.length})</TabsTrigger>
                    <TabsTrigger value="apis">Data APIs ({mockDataAPIs.length})</TabsTrigger>
                  </TabsList>

                  {/* All Sources Tab */}
                  <TabsContent value="all" className="space-y-6 mt-6">
                    {/* Documents Section */}
                    <div>
                      <h4 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide mb-3 flex items-center gap-2">
                        <FileText className="w-4 h-4" />
                        Documents ({mockDocuments.length})
                      </h4>
                      
                      {/* Grid View */}
                      {viewMode === 'grid' && (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                          {mockDocuments.slice(0, 3).map((doc) => {
                            const Icon = doc.icon
                            return (
                              <Card key={doc.id} className="hover:shadow-lg transition-shadow">
                                <CardContent className="p-4">
                                  <div className="flex items-start gap-3">
                                    <div className="p-2 bg-cyan-50 rounded-lg">
                                      <Icon className="w-5 h-5 text-cyan-600" />
                                    </div>
                                    <div className="flex-1 min-w-0">
                                      <h5 className="font-semibold text-sm text-foreground truncate">{doc.name}</h5>
                                      <p className="text-xs text-muted-foreground">
                                        {doc.type} • {doc.size}
                                      </p>
                                      <p className="text-xs text-muted-foreground mt-1">
                                        Uploaded: {doc.uploadedDate}
                                      </p>
                                      {doc.status === 'analyzed' && (
                                        <Badge variant="secondary" className="mt-2 text-xs gap-1">
                                          <Sparkles className="w-3 h-3" />
                                          AI Analyzed
                                        </Badge>
                                      )}
                                      {doc.status === 'processing' && (
                                        <Badge variant="outline" className="mt-2 text-xs gap-1">
                                          <Clock className="w-3 h-3" />
                                          Processing
                                        </Badge>
                                      )}
                                    </div>
                                  </div>
                                  <div className="flex gap-2 mt-3">
                                    <Button variant="outline" size="sm" className="flex-1 bg-transparent">
                                      <Eye className="w-3 h-3 mr-1" />
                                      View
                                    </Button>
                                    <Button variant="outline" size="sm" className="flex-1 bg-transparent">
                                      <Sparkles className="w-3 h-3 mr-1" />
                                      Analyze
                                    </Button>
                                  </div>
                                </CardContent>
                              </Card>
                            )
                          })}
                        </div>
                      )}

                      {/* List View */}
                      {viewMode === 'list' && (
                        <div className="space-y-2">
                          {mockDocuments.slice(0, 3).map((doc) => {
                            const Icon = doc.icon
                            return (
                              <Card key={doc.id} className="hover:shadow-md transition-shadow">
                                <CardContent className="p-4">
                                  <div className="flex items-center gap-4">
                                    <div className="p-2 bg-cyan-50 rounded-lg">
                                      <Icon className="w-5 h-5 text-cyan-600" />
                                    </div>
                                    <div className="flex-1">
                                      <h5 className="font-semibold text-sm text-foreground">{doc.name}</h5>
                                      <p className="text-xs text-muted-foreground">
                                        {doc.type} • {doc.size} • Uploaded: {doc.uploadedDate}
                                      </p>
                                    </div>
                                    <div className="flex items-center gap-2">
                                      {doc.status === 'analyzed' && (
                                        <Badge variant="secondary" className="text-xs gap-1">
                                          <Sparkles className="w-3 h-3" />
                                          AI Analyzed
                                        </Badge>
                                      )}
                                      {doc.status === 'processing' && (
                                        <Badge variant="outline" className="text-xs gap-1">
                                          <Clock className="w-3 h-3" />
                                          Processing
                                        </Badge>
                                      )}
                                      <Button variant="outline" size="sm" className="bg-transparent">
                                        <Eye className="w-3 h-3 mr-1" />
                                        View
                                      </Button>
                                      <Button variant="outline" size="sm" className="bg-transparent">
                                        <Sparkles className="w-3 h-3 mr-1" />
                                        Analyze
                                      </Button>
                                    </div>
                                  </div>
                                </CardContent>
                              </Card>
                            )
                          })}
                        </div>
                      )}

                      {/* Table View */}
                      {viewMode === 'table' && (
                        <div className="border rounded-lg overflow-hidden">
                          <table className="w-full">
                            <thead className="bg-muted/50">
                              <tr className="border-b">
                                <th className="text-left px-4 py-3 text-xs font-semibold text-muted-foreground">Name</th>
                                <th className="text-left px-4 py-3 text-xs font-semibold text-muted-foreground">Type</th>
                                <th className="text-left px-4 py-3 text-xs font-semibold text-muted-foreground">Size</th>
                                <th className="text-left px-4 py-3 text-xs font-semibold text-muted-foreground">Uploaded</th>
                                <th className="text-left px-4 py-3 text-xs font-semibold text-muted-foreground">Status</th>
                                <th className="text-right px-4 py-3 text-xs font-semibold text-muted-foreground">Actions</th>
                              </tr>
                            </thead>
                            <tbody>
                              {mockDocuments.slice(0, 3).map((doc) => {
                                const Icon = doc.icon
                                return (
                                  <tr key={doc.id} className="border-b hover:bg-muted/30 transition-colors">
                                    <td className="px-4 py-3">
                                      <div className="flex items-center gap-2">
                                        <Icon className="w-4 h-4 text-cyan-600" />
                                        <span className="text-sm font-medium">{doc.name}</span>
                                      </div>
                                    </td>
                                    <td className="px-4 py-3 text-sm text-muted-foreground">{doc.type}</td>
                                    <td className="px-4 py-3 text-sm text-muted-foreground">{doc.size}</td>
                                    <td className="px-4 py-3 text-sm text-muted-foreground">{doc.uploadedDate}</td>
                                    <td className="px-4 py-3">
                                      {doc.status === 'analyzed' && (
                                        <Badge variant="secondary" className="text-xs gap-1">
                                          <Sparkles className="w-3 h-3" />
                                          AI Analyzed
                                        </Badge>
                                      )}
                                      {doc.status === 'processing' && (
                                        <Badge variant="outline" className="text-xs gap-1">
                                          <Clock className="w-3 h-3" />
                                          Processing
                                        </Badge>
                                      )}
                                    </td>
                                    <td className="px-4 py-3">
                                      <div className="flex justify-end gap-1">
                                        <Button variant="ghost" size="sm">
                                          <Eye className="w-3 h-3" />
                                        </Button>
                                        <Button variant="ghost" size="sm">
                                          <Sparkles className="w-3 h-3" />
                                        </Button>
                                      </div>
                                    </td>
                                  </tr>
                                )
                              })}
                            </tbody>
                          </table>
                        </div>
                      )}
                      
                      {mockDocuments.length > 3 && (
                        <Button variant="link" className="mt-2 text-sm">
                          Show {mockDocuments.length - 3} more documents...
                        </Button>
                      )}
                    </div>

                    {/* External Links Section */}
                    <div>
                      <h4 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide mb-3 flex items-center gap-2">
                        <Link2 className="w-4 h-4" />
                        External Links ({mockExternalLinks.length})
                      </h4>
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {mockExternalLinks.slice(0, 3).map((link) => (
                          <Card key={link.id} className="hover:shadow-lg transition-shadow">
                            <CardContent className="p-4">
                              <div className="flex items-start gap-3">
                                <div className="text-2xl">{link.icon}</div>
                                <div className="flex-1 min-w-0">
                                  <h5 className="font-semibold text-sm text-foreground">{link.name}</h5>
                                  <p className="text-xs text-muted-foreground">{link.description}</p>
                                  <p className="text-xs text-muted-foreground mt-1">
                                    Last sync: {link.lastSync}
                                  </p>
                                  {link.autoUpdate && (
                                    <Badge variant="secondary" className="mt-2 text-xs gap-1">
                                      <CheckCircle2 className="w-3 h-3" />
                                      Auto-updating
                                    </Badge>
                                  )}
                                </div>
                              </div>
                              <div className="flex gap-2 mt-3">
                                <Button variant="outline" size="sm" className="flex-1 bg-transparent">
                                  <Eye className="w-3 h-3 mr-1" />
                                  View
                                </Button>
                                <Button variant="outline" size="sm" className="flex-1 bg-transparent">
                                  <RotateCw className="w-3 h-3 mr-1" />
                                  Refresh
                                </Button>
                              </div>
                            </CardContent>
                          </Card>
                        ))}
                      </div>
                      {mockExternalLinks.length > 3 && (
                        <Button variant="link" className="mt-2 text-sm">
                          Show {mockExternalLinks.length - 3} more links...
                        </Button>
                      )}
                    </div>

                    {/* News & Media Section */}
                    <div>
                      <h4 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide mb-3 flex items-center gap-2">
                        <Newspaper className="w-4 h-4" />
                        News & Media ({mockNews.length})
                      </h4>
                      <Card>
                        <CardContent className="p-4">
                          <div className="space-y-3">
                            {mockNews.map((article) => (
                              <div
                                key={article.id}
                                className="flex items-start justify-between gap-4 pb-3 border-b border-border last:border-0 last:pb-0 hover:bg-muted/30 p-2 rounded transition-colors"
                              >
                                <div className="flex items-start gap-3 flex-1">
                                  <Newspaper className="w-4 h-4 text-cyan-600 mt-0.5" />
                                  <div className="flex-1 min-w-0">
                                    <p className="text-sm font-medium text-foreground">{article.title}</p>
                                    <p className="text-xs text-muted-foreground mt-0.5">{article.source}</p>
                                  </div>
                                </div>
                                <span className="text-xs text-muted-foreground whitespace-nowrap">{article.date}</span>
                              </div>
                            ))}
                            <Button variant="outline" size="sm" className="w-full mt-2 bg-transparent">
                              <Plus className="w-3 h-3 mr-1" />
                              Add News Article
                            </Button>
                          </div>
                        </CardContent>
                      </Card>
                    </div>

                    {/* Data APIs Section */}
                    <div>
                      <h4 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide mb-3 flex items-center gap-2">
                        <Database className="w-4 h-4" />
                        Data APIs ({mockDataAPIs.length})
                      </h4>
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {mockDataAPIs.map((api) => (
                          <Card key={api.id} className="hover:shadow-lg transition-shadow">
                            <CardContent className="p-4">
                              <div className="flex items-start gap-3">
                                <div className="text-2xl">{api.icon}</div>
                                <div className="flex-1 min-w-0">
                                  <h5 className="font-semibold text-sm text-foreground">{api.name}</h5>
                                  <p className="text-xs text-muted-foreground">{api.description}</p>
                                  <Badge variant="secondary" className="mt-2 text-xs gap-1">
                                    <CheckCircle2 className="w-3 h-3" />
                                    API Connected
                                  </Badge>
                                  <p className="text-xs text-muted-foreground mt-2">
                                    Last pull: {api.lastPull}
                                  </p>
                                </div>
                              </div>
                              <div className="flex gap-2 mt-3">
                                <Button variant="outline" size="sm" className="flex-1 bg-transparent">
                                  <Eye className="w-3 h-3 mr-1" />
                                  View Data
                                </Button>
                                <Button variant="outline" size="sm" className="flex-1 bg-transparent">
                                  <RefreshCw className="w-3 h-3 mr-1" />
                                  Sync
                                </Button>
                              </div>
                            </CardContent>
                          </Card>
                        ))}
                      </div>
                    </div>
                  </TabsContent>

                  {/* Documents Only Tab */}
                  <TabsContent value="documents" className="space-y-6 mt-6">
                    <div className="flex items-center justify-between">
                      <h3 className="text-lg font-semibold text-foreground">Documents ({mockDocuments.length})</h3>
                      <div className="flex gap-1">
                        <Button
                          variant={viewMode === 'grid' ? 'default' : 'outline'}
                          size="sm"
                          onClick={() => setViewMode('grid')}
                          className={viewMode === 'grid' ? '' : 'bg-transparent'}
                        >
                          <Grid3X3 className="w-4 h-4" />
                        </Button>
                        <Button
                          variant={viewMode === 'list' ? 'default' : 'outline'}
                          size="sm"
                          onClick={() => setViewMode('list')}
                          className={viewMode === 'list' ? '' : 'bg-transparent'}
                        >
                          <List className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      {mockDocuments.map((doc) => {
                        const Icon = doc.icon
                        return (
                          <Card key={doc.id} className="hover:shadow-lg transition-shadow">
                            <CardContent className="p-4">
                              <div className="flex items-start gap-3">
                                <div className="p-2 bg-cyan-50 rounded-lg">
                                  <Icon className="w-5 h-5 text-cyan-600" />
                                </div>
                                <div className="flex-1 min-w-0">
                                  <h5 className="font-semibold text-sm text-foreground truncate">{doc.name}</h5>
                                  <p className="text-xs text-muted-foreground">
                                    {doc.type} • {doc.size}
                                  </p>
                                  <p className="text-xs text-muted-foreground mt-1">
                                    Uploaded: {doc.uploadedDate}
                                  </p>
                                  {doc.status === 'analyzed' && (
                                    <Badge variant="secondary" className="mt-2 text-xs gap-1">
                                      <Sparkles className="w-3 h-3" />
                                      AI Analyzed
                                    </Badge>
                                  )}
                                  {doc.status === 'processing' && (
                                    <Badge variant="outline" className="mt-2 text-xs gap-1">
                                      <Clock className="w-3 h-3" />
                                      Processing
                                    </Badge>
                                  )}
                                </div>
                              </div>
                              <div className="flex gap-2 mt-3">
                                <Button variant="outline" size="sm" className="flex-1 bg-transparent">
                                  <Eye className="w-3 h-3 mr-1" />
                                  View
                                </Button>
                                <Button variant="outline" size="sm" className="flex-1 bg-transparent">
                                  <Sparkles className="w-3 h-3 mr-1" />
                                  Analyze
                                </Button>
                              </div>
                            </CardContent>
                          </Card>
                        )
                      })}
                    </div>
                  </TabsContent>

                  {/* External Links Only Tab */}
                  <TabsContent value="links" className="space-y-6 mt-6">
                    <h3 className="text-lg font-semibold text-foreground">External Links ({mockExternalLinks.length})</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      {mockExternalLinks.map((link) => (
                        <Card key={link.id} className="hover:shadow-lg transition-shadow">
                          <CardContent className="p-4">
                            <div className="flex items-start gap-3">
                              <div className="text-2xl">{link.icon}</div>
                              <div className="flex-1 min-w-0">
                                <h5 className="font-semibold text-sm text-foreground">{link.name}</h5>
                                <p className="text-xs text-muted-foreground">{link.description}</p>
                                <p className="text-xs text-muted-foreground mt-1">
                                  Last sync: {link.lastSync}
                                </p>
                                {link.autoUpdate && (
                                  <Badge variant="secondary" className="mt-2 text-xs gap-1">
                                    <CheckCircle2 className="w-3 h-3" />
                                    Auto-updating
                                  </Badge>
                                )}
                              </div>
                            </div>
                            <div className="flex gap-2 mt-3">
                              <Button variant="outline" size="sm" className="flex-1 bg-transparent">
                                <Eye className="w-3 h-3 mr-1" />
                                View
                              </Button>
                              <Button variant="outline" size="sm" className="flex-1 bg-transparent">
                                <RotateCw className="w-3 h-3 mr-1" />
                                Refresh
                              </Button>
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  </TabsContent>

                  {/* News Only Tab */}
                  <TabsContent value="news" className="space-y-6 mt-6">
                    <h3 className="text-lg font-semibold text-foreground">News & Media ({mockNews.length})</h3>
                    <Card>
                      <CardContent className="p-4">
                        <div className="space-y-3">
                          {mockNews.map((article) => (
                            <div
                              key={article.id}
                              className="flex items-start justify-between gap-4 pb-3 border-b border-border last:border-0 last:pb-0 hover:bg-muted/30 p-2 rounded transition-colors"
                            >
                              <div className="flex items-start gap-3 flex-1">
                                <Newspaper className="w-4 h-4 text-cyan-600 mt-0.5" />
                                <div className="flex-1 min-w-0">
                                  <p className="text-sm font-medium text-foreground">{article.title}</p>
                                  <p className="text-xs text-muted-foreground mt-0.5">{article.source}</p>
                                </div>
                              </div>
                              <span className="text-xs text-muted-foreground whitespace-nowrap">{article.date}</span>
                            </div>
                          ))}
                          <Button variant="outline" size="sm" className="w-full mt-2 bg-transparent">
                            <Plus className="w-3 h-3 mr-1" />
                            Add News Article
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  </TabsContent>

                  {/* Data APIs Only Tab */}
                  <TabsContent value="apis" className="space-y-6 mt-6">
                    <h3 className="text-lg font-semibold text-foreground">Data APIs ({mockDataAPIs.length})</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      {mockDataAPIs.map((api) => (
                        <Card key={api.id} className="hover:shadow-lg transition-shadow">
                          <CardContent className="p-4">
                            <div className="flex items-start gap-3">
                              <div className="text-2xl">{api.icon}</div>
                              <div className="flex-1 min-w-0">
                                <h5 className="font-semibold text-sm text-foreground">{api.name}</h5>
                                <p className="text-xs text-muted-foreground">{api.description}</p>
                                <Badge variant="secondary" className="mt-2 text-xs gap-1">
                                  <CheckCircle2 className="w-3 h-3" />
                                  API Connected
                                </Badge>
                                <p className="text-xs text-muted-foreground mt-2">
                                  Last pull: {api.lastPull}
                                </p>
                              </div>
                            </div>
                            <div className="flex gap-2 mt-3">
                              <Button variant="outline" size="sm" className="flex-1 bg-transparent">
                                <Eye className="w-3 h-3 mr-1" />
                                View Data
                              </Button>
                              <Button variant="outline" size="sm" className="flex-1 bg-transparent">
                                <RefreshCw className="w-3 h-3 mr-1" />
                                Sync
                              </Button>
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  </TabsContent>
                </Tabs>
              </div>
            </div>
          </main>
        </div>
      </div>
    </ProtectedRoute>
  )
}
