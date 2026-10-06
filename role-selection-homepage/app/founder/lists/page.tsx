"use client"

import { useState } from "react"
import Link from "next/link"
import { DashboardSidebar } from "@/components/dashboard/sidebar"
import { DashboardHeader } from "@/components/dashboard/header"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet"
import {
  Plus,
  Search,
  MoreHorizontal,
  GripVertical,
  Trash2,
  Edit2,
  Send,
  Eye,
  UserPlus,
  Download,
  Upload,
  Filter,
  ArrowUpDown,
  CheckCircle2,
  Clock,
  MessageSquare,
  Calendar,
  FileText,
  ExternalLink,
  Sparkles,
  Building2,
} from "lucide-react"
import { toast } from "sonner"

type InvestorStatus =
  | "not_started"
  | "researching"
  | "contacted"
  | "responded"
  | "meeting"
  | "term_sheet"
  | "closed"

interface Investor {
  id: string
  name: string
  firm: string
  type: string
  matchScore: number
  status: InvestorStatus
  priority: number
  nextStep: string
  lastContact?: string
  notes?: string
  interactions: number
  documentsShared: string[]
}

interface InvestorList {
  id: string
  name: string
  investors: Investor[]
  color: string
}

const statusConfig: Record<
  InvestorStatus,
  { label: string; color: string; icon: typeof Clock }
> = {
  not_started: { label: "Not Started", color: "bg-secondary", icon: Clock },
  researching: { label: "Researching", color: "bg-blue-500", icon: Search },
  contacted: { label: "Contacted", color: "bg-yellow-500", icon: Send },
  responded: { label: "Responded", color: "bg-purple-500", icon: MessageSquare },
  meeting: { label: "Meeting", color: "bg-orange-500", icon: Calendar },
  term_sheet: { label: "Term Sheet", color: "bg-green-500", icon: FileText },
  closed: { label: "Closed", color: "bg-primary", icon: CheckCircle2 },
}

const mockLists: InvestorList[] = [
  {
    id: "1",
    name: "Tier 1 VCs",
    color: "bg-blue-500",
    investors: [
      {
        id: "1",
        name: "Priya Mehta",
        firm: "Sequoia Capital",
        type: "VC",
        matchScore: 92,
        status: "contacted",
        priority: 1,
        nextStep: "Follow up on pitch deck",
        lastContact: "2 days ago",
        interactions: 3,
        documentsShared: ["Pitch Deck", "Financial Model"],
      },
      {
        id: "2",
        name: "John Chen",
        firm: "Accel",
        type: "VC",
        matchScore: 89,
        status: "meeting",
        priority: 2,
        nextStep: "Prep for partner meeting",
        lastContact: "1 day ago",
        interactions: 5,
        documentsShared: ["Pitch Deck", "Financial Model", "Customer References"],
      },
    ],
  },
  {
    id: "2",
    name: "Strategic Angels",
    color: "bg-purple-500",
    investors: [
      {
        id: "3",
        name: "Sarah Williams",
        firm: "Independent",
        type: "Angel",
        matchScore: 85,
        status: "not_started",
        priority: 3,
        nextStep: "Research background",
        interactions: 0,
        documentsShared: [],
      },
    ],
  },
]

export default function TargetInvestorListPage() {
  const [lists, setLists] = useState<InvestorList[]>(mockLists)
  const [selectedList, setSelectedList] = useState<string>(lists[0]?.id || "")
  const [selectedInvestors, setSelectedInvestors] = useState<string[]>([])
  const [showCreateList, setShowCreateList] = useState(false)
  const [showAddInvestor, setShowAddInvestor] = useState(false)
  const [newListName, setNewListName] = useState("")
  const [detailInvestor, setDetailInvestor] = useState<Investor | null>(null)
  const [searchQuery, setSearchQuery] = useState("")

  const currentList = lists.find((l) => l.id === selectedList)
  const filteredInvestors = currentList?.investors.filter((inv) =>
    inv.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    inv.firm.toLowerCase().includes(searchQuery.toLowerCase())
  ) || []

  const handleCreateList = () => {
    if (!newListName.trim()) return
    const newList: InvestorList = {
      id: Date.now().toString(),
      name: newListName,
      investors: [],
      color: "bg-green-500",
    }
    setLists([...lists, newList])
    setSelectedList(newList.id)
    setNewListName("")
    setShowCreateList(false)
    toast.success(`List "${newListName}" created!`)
  }

  const handleBulkAction = (action: string) => {
    if (selectedInvestors.length === 0) {
      toast.error("Please select investors first")
      return
    }
    
    switch(action) {
      case "delete":
        toast.success(`Removed ${selectedInvestors.length} investors`)
        setSelectedInvestors([])
        break
      case "move":
        toast.success(`Moved ${selectedInvestors.length} investors`)
        setSelectedInvestors([])
        break
      case "contact":
        toast.success(`Added ${selectedInvestors.length} investors to outreach`)
        setSelectedInvestors([])
        break
    }
  }

  return (
    <div className="flex flex-col h-screen bg-background">
      <DashboardHeader />
      <div className="flex flex-1 overflow-hidden">
        <DashboardSidebar />
        <main className="flex-1 overflow-y-auto p-6">
          {/* Page Header */}
          <div className="mb-6">
            <div className="flex items-center justify-between mb-2">
              <div>
                <h1 className="text-3xl font-bold tracking-tight text-foreground">Target Investor Lists</h1>
                <p className="text-muted-foreground">
                  Manage and prioritize your investor outreach
                </p>
              </div>
              <div className="flex gap-2">
                <Button variant="outline" className="gap-2 bg-transparent">
                  <Upload className="w-4 h-4" />
                  Import CSV
                </Button>
                <Dialog open={showCreateList} onOpenChange={setShowCreateList}>
                  <DialogTrigger asChild>
                    <Button className="gap-2">
                      <Plus className="w-4 h-4" />
                      New List
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Create New List</DialogTitle>
                      <DialogDescription>
                        Create a new curated list to organize your target investors
                      </DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4 py-4">
                      <div>
                        <Label htmlFor="listName">List Name</Label>
                        <Input
                          id="listName"
                          placeholder="e.g., Tier 1 VCs, Strategic Angels"
                          value={newListName}
                          onChange={(e) => setNewListName(e.target.value)}
                        />
                      </div>
                    </div>
                    <DialogFooter>
                      <Button variant="outline" onClick={() => setShowCreateList(false)}>
                        Cancel
                      </Button>
                      <Button onClick={handleCreateList}>Create List</Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
              </div>
            </div>
          </div>

          {/* List Tabs */}
          <Tabs value={selectedList} onValueChange={setSelectedList} className="mb-6">
            <TabsList className="bg-secondary/50">
              {lists.map((list) => (
                <TabsTrigger key={list.id} value={list.id} className="gap-2">
                  <div className={`w-2 h-2 rounded-full ${list.color}`} />
                  {list.name}
                  <Badge variant="secondary" className="ml-1">
                    {list.investors.length}
                  </Badge>
                </TabsTrigger>
              ))}
            </TabsList>
          </Tabs>

          {/* Controls */}
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-2 flex-1 max-w-md">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  placeholder="Search investors..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
              <Button variant="outline" size="icon" className="bg-transparent">
                <Filter className="w-4 h-4" />
              </Button>
            </div>

            {selectedInvestors.length > 0 && (
              <div className="flex items-center gap-2">
                <span className="text-sm text-muted-foreground">
                  {selectedInvestors.length} selected
                </span>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="outline" size="sm" className="bg-transparent">
                      Bulk Actions
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem onClick={() => handleBulkAction("contact")}>
                      <Send className="w-4 h-4 mr-2" />
                      Add to Outreach
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => handleBulkAction("move")}>
                      <ArrowUpDown className="w-4 h-4 mr-2" />
                      Move to List
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={() => handleBulkAction("delete")} className="text-destructive">
                      <Trash2 className="w-4 h-4 mr-2" />
                      Remove from List
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            )}

            <Button className="gap-2" onClick={() => setShowAddInvestor(true)}>
              <UserPlus className="w-4 h-4" />
              Add Investor
            </Button>
          </div>

          {/* Investor Table */}
          <Card>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-12">
                    <Checkbox
                      checked={selectedInvestors.length === filteredInvestors.length}
                      onCheckedChange={(checked) => {
                        if (checked) {
                          setSelectedInvestors(filteredInvestors.map((i) => i.id))
                        } else {
                          setSelectedInvestors([])
                        }
                      }}
                    />
                  </TableHead>
                  <TableHead className="w-12">
                    <GripVertical className="w-4 h-4 text-muted-foreground" />
                  </TableHead>
                  <TableHead>Priority</TableHead>
                  <TableHead>Investor</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Match</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Next Step</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredInvestors.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={9} className="text-center py-12">
                      <div className="flex flex-col items-center gap-2">
                        <Building2 className="w-12 h-12 text-muted-foreground" />
                        <p className="text-muted-foreground">No investors in this list yet</p>
                        <Button variant="outline" onClick={() => setShowAddInvestor(true)}>
                          Add Your First Investor
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredInvestors.map((investor) => {
                    const StatusIcon = statusConfig[investor.status].icon
                    return (
                      <TableRow key={investor.id}>
                        <TableCell>
                          <Checkbox
                            checked={selectedInvestors.includes(investor.id)}
                            onCheckedChange={(checked) => {
                              if (checked) {
                                setSelectedInvestors([...selectedInvestors, investor.id])
                              } else {
                                setSelectedInvestors(selectedInvestors.filter((id) => id !== investor.id))
                              }
                            }}
                          />
                        </TableCell>
                        <TableCell>
                          <GripVertical className="w-4 h-4 text-muted-foreground cursor-grab" />
                        </TableCell>
                        <TableCell>
                          <Badge variant="outline">{investor.priority}</Badge>
                        </TableCell>
                        <TableCell>
                          <button
                            onClick={() => setDetailInvestor(investor)}
                            className="flex items-center gap-3 hover:opacity-80 transition-opacity"
                          >
                            <Avatar className="w-8 h-8">
                              <AvatarFallback className="text-xs">
                                {investor.name
                                  .split(" ")
                                  .map((n) => n[0])
                                  .join("")}
                              </AvatarFallback>
                            </Avatar>
                            <div className="text-left">
                              <div className="font-medium">{investor.name}</div>
                              <div className="text-sm text-muted-foreground">{investor.firm}</div>
                            </div>
                          </button>
                        </TableCell>
                        <TableCell>
                          <Badge variant="secondary">{investor.type}</Badge>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <Sparkles className="w-4 h-4 text-yellow-500" />
                            <span className="font-semibold">{investor.matchScore}%</span>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge
                            variant="secondary"
                            className={`${statusConfig[investor.status].color} text-white`}
                          >
                            <StatusIcon className="w-3 h-3 mr-1" />
                            {statusConfig[investor.status].label}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <div className="text-sm">
                            <div>{investor.nextStep}</div>
                            {investor.lastContact && (
                              <div className="text-muted-foreground text-xs">
                                Last contact: {investor.lastContact}
                              </div>
                            )}
                          </div>
                        </TableCell>
                        <TableCell className="text-right">
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="icon">
                                <MoreHorizontal className="w-4 h-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem onClick={() => setDetailInvestor(investor)}>
                                <Eye className="w-4 h-4 mr-2" />
                                View Details
                              </DropdownMenuItem>
                              <DropdownMenuItem>
                                <Send className="w-4 h-4 mr-2" />
                                Start Outreach
                              </DropdownMenuItem>
                              <DropdownMenuItem>
                                <Edit2 className="w-4 h-4 mr-2" />
                                Edit
                              </DropdownMenuItem>
                              <DropdownMenuSeparator />
                              <DropdownMenuItem className="text-destructive">
                                <Trash2 className="w-4 h-4 mr-2" />
                                Remove
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </TableCell>
                      </TableRow>
                    )
                  })
                )}
              </TableBody>
            </Table>
          </Card>
        </main>
      </div>

      {/* Investor Detail Slide-out */}
      <Sheet open={!!detailInvestor} onOpenChange={() => setDetailInvestor(null)}>
        <SheetContent className="w-full sm:max-w-2xl overflow-y-auto">
          {detailInvestor && (
            <>
              <SheetHeader>
                <div className="flex items-start gap-4 mb-4">
                  <Avatar className="w-16 h-16">
                    <AvatarFallback>
                      {detailInvestor.name
                        .split(" ")
                        .map((n) => n[0])
                        .join("")}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <SheetTitle className="text-2xl">{detailInvestor.name}</SheetTitle>
                    <SheetDescription className="text-base">{detailInvestor.firm}</SheetDescription>
                    <div className="flex items-center gap-2 mt-2">
                      <Badge variant="secondary">{detailInvestor.type}</Badge>
                      <Badge
                        variant="secondary"
                        className={`${statusConfig[detailInvestor.status].color} text-white`}
                      >
                        {statusConfig[detailInvestor.status].label}
                      </Badge>
                      <div className="flex items-center gap-1 text-sm">
                        <Sparkles className="w-4 h-4 text-yellow-500" />
                        <span className="font-semibold">{detailInvestor.matchScore}% Match</span>
                      </div>
                    </div>
                  </div>
                </div>
              </SheetHeader>

              <div className="space-y-6 mt-6">
                {/* Quick Actions */}
                <div className="flex gap-2">
                  <Button className="flex-1 gap-2">
                    <Send className="w-4 h-4" />
                    Start Outreach
                  </Button>
                  <Button variant="outline" className="flex-1 gap-2 bg-transparent" asChild>
                    <Link href="#" target="_blank">
                      <ExternalLink className="w-4 h-4" />
                      LinkedIn
                    </Link>
                  </Button>
                </div>

                {/* Next Steps */}
                <Card>
                  <CardHeader>
                    <CardTitle className="text-base">Next Steps</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      <Input
                        defaultValue={detailInvestor.nextStep}
                        placeholder="What's the next action?"
                      />
                      {detailInvestor.lastContact && (
                        <p className="text-sm text-muted-foreground">
                          Last contact: {detailInvestor.lastContact}
                        </p>
                      )}
                    </div>
                  </CardContent>
                </Card>

                {/* Interaction History */}
                <Card>
                  <CardHeader>
                    <CardTitle className="text-base">Interaction History</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div className="flex items-start gap-3 text-sm">
                        <div className="w-8 h-8 rounded-full bg-green-500/10 text-green-500 flex items-center justify-center flex-shrink-0">
                          <MessageSquare className="w-4 h-4" />
                        </div>
                        <div className="flex-1">
                          <div className="font-medium">Email sent</div>
                          <div className="text-muted-foreground">Pitch deck shared - 2 days ago</div>
                        </div>
                      </div>
                      <div className="flex items-start gap-3 text-sm">
                        <div className="w-8 h-8 rounded-full bg-blue-500/10 text-blue-500 flex items-center justify-center flex-shrink-0">
                          <Eye className="w-4 h-4" />
                        </div>
                        <div className="flex-1">
                          <div className="font-medium">Document viewed</div>
                          <div className="text-muted-foreground">Opened pitch deck - 1 day ago</div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Documents Shared */}
                <Card>
                  <CardHeader>
                    <CardTitle className="text-base">Documents Shared</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      {detailInvestor.documentsShared.length === 0 ? (
                        <p className="text-sm text-muted-foreground">No documents shared yet</p>
                      ) : (
                        detailInvestor.documentsShared.map((doc) => (
                          <div
                            key={doc}
                            className="flex items-center gap-2 p-2 rounded-lg border text-sm"
                          >
                            <FileText className="w-4 h-4 text-muted-foreground" />
                            <span>{doc}</span>
                          </div>
                        ))
                      )}
                    </div>
                  </CardContent>
                </Card>

                {/* Notes */}
                <Card>
                  <CardHeader>
                    <CardTitle className="text-base">Notes</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <Textarea
                      placeholder="Add notes about this investor..."
                      rows={4}
                      defaultValue={detailInvestor.notes}
                    />
                    <Button size="sm" className="mt-2">
                      Save Notes
                    </Button>
                  </CardContent>
                </Card>
              </div>
            </>
          )}
        </SheetContent>
      </Sheet>

      {/* Add Investor Dialog */}
      <Dialog open={showAddInvestor} onOpenChange={setShowAddInvestor}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add Investor to List</DialogTitle>
            <DialogDescription>
              Search from your matches or add manually
            </DialogDescription>
          </DialogHeader>
          <Tabs defaultValue="search">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="search">From Matches</TabsTrigger>
              <TabsTrigger value="manual">Manual Entry</TabsTrigger>
            </TabsList>
            <TabsContent value="search" className="space-y-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input placeholder="Search investor matches..." className="pl-10" />
              </div>
              <div className="space-y-2 max-h-64 overflow-y-auto">
                {[
                  { name: "Alex Thompson", firm: "Lightspeed Ventures", match: 88 },
                  { name: "Maya Patel", firm: "Greylock Partners", match: 86 },
                ].map((inv) => (
                  <div
                    key={inv.name}
                    className="flex items-center justify-between p-3 border rounded-lg hover:bg-secondary/50 cursor-pointer"
                  >
                    <div className="flex items-center gap-3">
                      <Avatar className="w-10 h-10">
                        <AvatarFallback>
                          {inv.name
                            .split(" ")
                            .map((n) => n[0])
                            .join("")}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <div className="font-medium">{inv.name}</div>
                        <div className="text-sm text-muted-foreground">{inv.firm}</div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge variant="secondary">{inv.match}% Match</Badge>
                      <Button size="sm">Add</Button>
                    </div>
                  </div>
                ))}
              </div>
            </TabsContent>
            <TabsContent value="manual" className="space-y-4">
              <div className="space-y-4">
                <div>
                  <Label>Investor Name</Label>
                  <Input placeholder="Full name" />
                </div>
                <div>
                  <Label>Firm/Organization</Label>
                  <Input placeholder="Company name" />
                </div>
                <div>
                  <Label>Type</Label>
                  <Input placeholder="VC, Angel, Family Office, etc." />
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setShowAddInvestor(false)}>
                  Cancel
                </Button>
                <Button onClick={() => {
                  toast.success("Investor added to list")
                  setShowAddInvestor(false)
                }}>
                  Add Investor
                </Button>
              </DialogFooter>
            </TabsContent>
          </Tabs>
        </DialogContent>
      </Dialog>
    </div>
  )
}
