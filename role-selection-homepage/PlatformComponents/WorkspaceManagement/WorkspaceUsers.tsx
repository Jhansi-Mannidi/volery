"use client"

import { useMemo, useState } from "react"
import {
  Columns3,
  Download,
  LayoutGrid,
  Search,
  TableIcon,
  UserPlus,
} from "lucide-react"
import { Button } from "@/ShadcnComponents/ui/button"
import { Card, CardContent } from "@/ShadcnComponents/ui/card"
import { Input } from "@/ShadcnComponents/ui/input"
import { Badge } from "@/ShadcnComponents/ui/badge"
import { Avatar, AvatarFallback } from "@/ShadcnComponents/ui/avatar"
import { Checkbox } from "@/ShadcnComponents/ui/checkbox"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/ShadcnComponents/ui/table"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/ShadcnComponents/ui/dropdown-menu"
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/ShadcnComponents/ui/dialog"
import { Label } from "@/ShadcnComponents/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/ShadcnComponents/ui/select"
import { cn } from "@/lib/utils"
import { initialsOf } from "@/Components/Profile/OrgProfile/OrgProfile.util"

type MemberRole = "admin" | "partner" | "associate" | "analyst" | "readonly"
type MemberStatus = "active" | "pending" | "disabled"

interface TeamMember {
  id: string
  name: string
  email: string
  role: MemberRole
  status: MemberStatus
  lastActive: string
  isOwner?: boolean
}

const initialMembers: TeamMember[] = [
  { id: "1", name: "Priya Sharma", email: "priya@anthillventures.com", role: "admin", status: "active", lastActive: "Just now", isOwner: true },
  { id: "2", name: "Rahul Mehta", email: "rahul@anthillventures.com", role: "partner", status: "active", lastActive: "2 hours ago" },
  { id: "3", name: "Sasi Kumar", email: "sasi@voltuswave.com", role: "admin", status: "active", lastActive: "Yesterday" },
  { id: "4", name: "Ananya Iyer", email: "ananya@anthillventures.com", role: "associate", status: "active", lastActive: "3 days ago" },
  { id: "5", name: "Vikram Patel", email: "vikram@anthillventures.com", role: "analyst", status: "pending", lastActive: "Never" },
  { id: "6", name: "Neha Kapoor", email: "neha@anthillventures.com", role: "readonly", status: "disabled", lastActive: "2 weeks ago" },
]

const roleLabel: Record<MemberRole, string> = {
  admin: "Admin",
  partner: "Partner",
  associate: "Investment Assoc.",
  analyst: "Analyst",
  readonly: "Read Only",
}

export default function WorkspaceUsers() {
  const [members, setMembers] = useState(initialMembers)
  const [searchTerm, setSearchTerm] = useState("")
  const [viewType, setViewType] = useState<"list" | "grid">("list")
  const [inviteOpen, setInviteOpen] = useState(false)
  const [inviteEmail, setInviteEmail] = useState("")
  const [inviteRole, setInviteRole] = useState<MemberRole>("associate")
  const [visibleColumns, setVisibleColumns] = useState({
    email: true,
    role: true,
    status: true,
    lastActive: true,
  })

  const filtered = useMemo(() => {
    const q = searchTerm.trim().toLowerCase()
    if (!q) return members
    return members.filter(
      (member) =>
        member.name.toLowerCase().includes(q) || member.email.toLowerCase().includes(q)
    )
  }, [members, searchTerm])

  const total = members.length
  const active = members.filter((member) => member.status === "active").length

  const handleInvite = () => {
    if (!inviteEmail.includes("@")) return
    setMembers((prev) => [
      ...prev,
      {
        id: String(prev.length + 1),
        name: inviteEmail.split("@")[0],
        email: inviteEmail,
        role: inviteRole,
        status: "pending",
        lastActive: "Never",
      },
    ])
    setInviteEmail("")
    setInviteOpen(false)
  }

  return (
    <div className="h-full overflow-y-auto bg-transparent p-6">
      <h1 className="mb-1 text-[18px] font-semibold tracking-tight">Workspace Users</h1>
      <p className="mb-5 text-[13px] text-muted-foreground">
        Manage who can access this Volery workspace, assign roles, and invite teammates.
      </p>

      <div className="mb-5 grid grid-cols-1 gap-3 md:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardContent className="p-4">
            <p className="text-[11px] font-medium tracking-wide text-muted-foreground uppercase">Total Users</p>
            <p className="mt-1 text-2xl font-semibold text-foreground">{total}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <p className="text-[11px] font-medium tracking-wide text-muted-foreground uppercase">Active Users</p>
            <p className="mt-1 text-2xl font-semibold text-foreground">{active}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <p className="text-[11px] font-medium tracking-wide text-muted-foreground uppercase">Pending Invites</p>
            <p className="mt-1 text-2xl font-semibold text-foreground">
              {members.filter((member) => member.status === "pending").length}
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <div className="relative w-full max-w-sm">
          <Search className="pointer-events-none absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search users"
            className="pl-10"
          />
        </div>
        <div className="flex items-center gap-2">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm">
                <Columns3 className="mr-2 h-4 w-4" />
                Columns
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              {(Object.keys(visibleColumns) as Array<keyof typeof visibleColumns>).map((column) => (
                <DropdownMenuItem
                  key={column}
                  onSelect={(event) => event.preventDefault()}
                  onClick={() =>
                    setVisibleColumns((prev) => ({ ...prev, [column]: !prev[column] }))
                  }
                >
                  <Checkbox checked={visibleColumns[column]} className="mr-2" />
                  {column === "lastActive" ? "Last Active" : column[0].toUpperCase() + column.slice(1)}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
          <Button variant="outline" size="sm">
            <Download className="mr-2 h-4 w-4" />
            Export
          </Button>
          <Button size="sm" onClick={() => setInviteOpen(true)}>
            <UserPlus className="mr-2 h-4 w-4" />
            Import Users
          </Button>
          <div className="flex overflow-hidden rounded-md border">
            <Button
              variant={viewType === "list" ? "secondary" : "ghost"}
              size="icon"
              className="h-8 w-8 rounded-none"
              onClick={() => setViewType("list")}
            >
              <TableIcon className="h-4 w-4" />
            </Button>
            <Button
              variant={viewType === "grid" ? "secondary" : "ghost"}
              size="icon"
              className="h-8 w-8 rounded-none"
              onClick={() => setViewType("grid")}
            >
              <LayoutGrid className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>

      {viewType === "list" ? (
        <div className="overflow-hidden rounded-lg border bg-card">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                {visibleColumns.email && <TableHead>Email</TableHead>}
                {visibleColumns.role && <TableHead>Role</TableHead>}
                {visibleColumns.status && <TableHead>Status</TableHead>}
                {visibleColumns.lastActive && <TableHead>Last Active</TableHead>}
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.map((member) => (
                <TableRow key={member.id}>
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <Avatar className="h-8 w-8">
                        <AvatarFallback className="text-[11px]">{initialsOf(member.name)}</AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="text-sm font-medium">{member.name}</p>
                        {member.isOwner && <p className="text-[11px] text-muted-foreground">Owner</p>}
                      </div>
                    </div>
                  </TableCell>
                  {visibleColumns.email && <TableCell className="text-sm">{member.email}</TableCell>}
                  {visibleColumns.role && (
                    <TableCell>
                      <Badge variant="secondary">{roleLabel[member.role]}</Badge>
                    </TableCell>
                  )}
                  {visibleColumns.status && (
                    <TableCell>
                      <span
                        className={cn(
                          "inline-flex rounded-full px-2 py-0.5 text-[11px] font-medium",
                          member.status === "active" && "bg-emerald-50 text-emerald-700",
                          member.status === "pending" && "bg-amber-50 text-amber-700",
                          member.status === "disabled" && "bg-red-50 text-red-700"
                        )}
                      >
                        {member.status}
                      </span>
                    </TableCell>
                  )}
                  {visibleColumns.lastActive && (
                    <TableCell className="text-sm text-muted-foreground">{member.lastActive}</TableCell>
                  )}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((member) => (
            <Card key={member.id}>
              <CardContent className="flex items-center gap-3 p-4">
                <Avatar className="h-10 w-10">
                  <AvatarFallback>{initialsOf(member.name)}</AvatarFallback>
                </Avatar>
                <div className="min-w-0">
                  <p className="truncate text-sm font-medium">{member.name}</p>
                  <p className="truncate text-xs text-muted-foreground">{member.email}</p>
                  <p className="mt-1 text-xs">{roleLabel[member.role]}</p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      <Dialog open={inviteOpen} onOpenChange={setInviteOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Import / invite user</DialogTitle>
          </DialogHeader>
          <div className="space-y-3">
            <div>
              <Label htmlFor="invite-email">Email</Label>
              <Input
                id="invite-email"
                value={inviteEmail}
                onChange={(e) => setInviteEmail(e.target.value)}
                placeholder="name@anthillventures.com"
              />
            </div>
            <div>
              <Label>Role</Label>
              <Select value={inviteRole} onValueChange={(value) => setInviteRole(value as MemberRole)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {Object.entries(roleLabel).map(([id, label]) => (
                    <SelectItem key={id} value={id}>
                      {label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setInviteOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleInvite}>Invite</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
