"use client"

import { useState } from "react"
import { useSearchParams } from "next/navigation"
import { Suspense } from "react"
import Loading from "./loading" // Import the Loading component
import {
  Check,
  ChevronDown,
  Loader2,
  X,
  Plus,
  Search,
  Bell,
  Settings,
  User,
  Mail,
  Calendar,
  Building2,
  TrendingUp,
  AlertCircle,
  Info,
  CheckCircle2,
  XCircle,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { Switch } from "@/components/ui/switch"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ThemeToggle } from "@/components/theme-toggle"

function DesignSystemPage() {
  const [toggleValue, setToggleValue] = useState(false)
  const [selectedTags, setSelectedTags] = useState(["SaaS", "B2B", "Series A"])
  const searchParams = useSearchParams()

  const removeTag = (tag: string) => {
    setSelectedTags(selectedTags.filter((t) => t !== tag))
  }

  return (
    <div className="min-h-screen bg-background p-8">
      <div className="mx-auto max-w-7xl space-y-12">
        {/* Header */}
        <div className="border-b border-border pb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-bold text-foreground">Volery 2.0 Design System</h1>
              <p className="mt-2 text-lg text-muted-foreground">
                Component library and visual guidelines for Anthill Ventures
              </p>
            </div>
            <ThemeToggle />
          </div>
        </div>

        {/* Color Palette */}
        <section className="space-y-6">
          <h2 className="text-2xl font-semibold text-foreground">Color Palette</h2>

          {/* Primary Blue */}
          <div className="space-y-3">
            <h3 className="text-sm font-medium text-muted-foreground uppercase tracking-wider">
              Primary - Blue
            </h3>
            <div className="grid grid-cols-10 gap-2">
              {[
                { shade: "50", hex: "#EFF6FF", text: "text-foreground" },
                { shade: "100", hex: "#DBEAFE", text: "text-foreground" },
                { shade: "200", hex: "#BFDBFE", text: "text-foreground" },
                { shade: "300", hex: "#93C5FD", text: "text-foreground" },
                { shade: "400", hex: "#60A5FA", text: "text-foreground" },
                { shade: "500", hex: "#3B82F6", text: "text-white" },
                { shade: "600", hex: "#2563EB", text: "text-white" },
                { shade: "700", hex: "#1D4ED8", text: "text-white" },
                { shade: "800", hex: "#1E40AF", text: "text-white" },
                { shade: "900", hex: "#1E3A8A", text: "text-white" },
              ].map((color) => (
                <div key={color.shade} className="space-y-1.5">
                  <div
                    className="h-16 rounded-lg shadow-sm border border-border/50"
                    style={{ backgroundColor: color.hex }}
                  />
                  <p className="text-xs font-medium text-foreground">{color.shade}</p>
                  <p className="text-xs text-muted-foreground font-mono">{color.hex}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Semantic Colors */}
          <div className="grid grid-cols-4 gap-6">
            {/* Success */}
            <div className="space-y-3">
              <h3 className="text-sm font-medium text-muted-foreground uppercase tracking-wider">
                Success
              </h3>
              <div className="space-y-2">
                <div className="h-12 rounded-lg bg-emerald-500 flex items-center justify-center">
                  <span className="text-white text-sm font-medium">#10B981</span>
                </div>
                <div className="h-8 rounded-lg bg-emerald-500/20 flex items-center justify-center">
                  <span className="text-emerald-400 text-xs">Light variant</span>
                </div>
              </div>
            </div>

            {/* Warning */}
            <div className="space-y-3">
              <h3 className="text-sm font-medium text-muted-foreground uppercase tracking-wider">
                Warning
              </h3>
              <div className="space-y-2">
                <div className="h-12 rounded-lg bg-amber-500 flex items-center justify-center">
                  <span className="text-white text-sm font-medium">#F59E0B</span>
                </div>
                <div className="h-8 rounded-lg bg-amber-500/20 flex items-center justify-center">
                  <span className="text-amber-400 text-xs">Light variant</span>
                </div>
              </div>
            </div>

            {/* Error */}
            <div className="space-y-3">
              <h3 className="text-sm font-medium text-muted-foreground uppercase tracking-wider">
                Error
              </h3>
              <div className="space-y-2">
                <div className="h-12 rounded-lg bg-red-500 flex items-center justify-center">
                  <span className="text-white text-sm font-medium">#EF4444</span>
                </div>
                <div className="h-8 rounded-lg bg-red-500/20 flex items-center justify-center">
                  <span className="text-red-400 text-xs">Light variant</span>
                </div>
              </div>
            </div>

            {/* Info */}
            <div className="space-y-3">
              <h3 className="text-sm font-medium text-muted-foreground uppercase tracking-wider">
                Info
              </h3>
              <div className="space-y-2">
                <div className="h-12 rounded-lg bg-blue-500 flex items-center justify-center">
                  <span className="text-white text-sm font-medium">#3B82F6</span>
                </div>
                <div className="h-8 rounded-lg bg-blue-500/20 flex items-center justify-center">
                  <span className="text-blue-400 text-xs">Light variant</span>
                </div>
              </div>
            </div>
          </div>

          {/* Pipeline Stage Colors */}
          <div className="space-y-3">
            <h3 className="text-sm font-medium text-muted-foreground uppercase tracking-wider">
              Pipeline Stage Colors
            </h3>
            <div className="flex flex-wrap gap-3">
              {[
                { name: "Intake", color: "bg-slate-500", textColor: "text-white" },
                { name: "Screening", color: "bg-blue-500", textColor: "text-white" },
                { name: "Due Diligence", color: "bg-amber-500", textColor: "text-white" },
                { name: "Decision", color: "bg-purple-500", textColor: "text-white" },
                { name: "Term Sheet", color: "bg-teal-500", textColor: "text-white" },
                { name: "Closed Won", color: "bg-emerald-500", textColor: "text-white" },
                { name: "Closed Lost", color: "bg-red-500", textColor: "text-white" },
              ].map((stage) => (
                <div
                  key={stage.name}
                  className={`px-4 py-2 rounded-lg ${stage.color} ${stage.textColor} text-sm font-medium`}
                >
                  {stage.name}
                </div>
              ))}
            </div>
          </div>

          {/* Neutrals */}
          <div className="space-y-3">
            <h3 className="text-sm font-medium text-muted-foreground uppercase tracking-wider">
              Neutrals
            </h3>
            <div className="grid grid-cols-11 gap-2">
              {[
                { shade: "White", hex: "#FFFFFF", bg: "bg-white", text: "text-foreground" },
                { shade: "50", hex: "#F9FAFB", bg: "bg-gray-50", text: "text-foreground" },
                { shade: "100", hex: "#F3F4F6", bg: "bg-gray-100", text: "text-foreground" },
                { shade: "200", hex: "#E5E7EB", bg: "bg-gray-200", text: "text-foreground" },
                { shade: "300", hex: "#D1D5DB", bg: "bg-gray-300", text: "text-foreground" },
                { shade: "400", hex: "#9CA3AF", bg: "bg-gray-400", text: "text-foreground" },
                { shade: "500", hex: "#6B7280", bg: "bg-gray-500", text: "text-white" },
                { shade: "600", hex: "#4B5563", bg: "bg-gray-600", text: "text-white" },
                { shade: "700", hex: "#374151", bg: "bg-gray-700", text: "text-white" },
                { shade: "800", hex: "#1F2937", bg: "bg-gray-800", text: "text-white" },
                { shade: "900", hex: "#111827", bg: "bg-gray-900", text: "text-white" },
              ].map((color) => (
                <div key={color.shade} className="space-y-1.5">
                  <div
                    className={`h-16 rounded-lg shadow-sm border border-border/50 ${color.bg}`}
                  />
                  <p className="text-xs font-medium text-foreground">{color.shade}</p>
                  <p className="text-xs text-muted-foreground font-mono">{color.hex}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Typography */}
        <section className="space-y-6">
          <h2 className="text-2xl font-semibold text-foreground">Typography</h2>
          <p className="text-muted-foreground">Font Family: Inter</p>

          <div className="grid grid-cols-2 gap-8">
            {/* Headings */}
            <div className="space-y-4">
              <h3 className="text-sm font-medium text-muted-foreground uppercase tracking-wider">
                Headings
              </h3>
              <div className="space-y-4 p-6 bg-card rounded-xl border border-border">
                <div className="flex items-baseline justify-between border-b border-border pb-3">
                  <span className="text-4xl font-bold text-foreground">Heading 1</span>
                  <span className="text-xs text-muted-foreground font-mono">36px / Bold</span>
                </div>
                <div className="flex items-baseline justify-between border-b border-border pb-3">
                  <span className="text-3xl font-semibold text-foreground">Heading 2</span>
                  <span className="text-xs text-muted-foreground font-mono">30px / Semibold</span>
                </div>
                <div className="flex items-baseline justify-between border-b border-border pb-3">
                  <span className="text-2xl font-semibold text-foreground">Heading 3</span>
                  <span className="text-xs text-muted-foreground font-mono">24px / Semibold</span>
                </div>
                <div className="flex items-baseline justify-between">
                  <span className="text-xl font-medium text-foreground">Heading 4</span>
                  <span className="text-xs text-muted-foreground font-mono">20px / Medium</span>
                </div>
              </div>
            </div>

            {/* Body Text */}
            <div className="space-y-4">
              <h3 className="text-sm font-medium text-muted-foreground uppercase tracking-wider">
                Body Text
              </h3>
              <div className="space-y-4 p-6 bg-card rounded-xl border border-border">
                <div className="flex items-baseline justify-between border-b border-border pb-3">
                  <span className="text-base text-foreground">Body Base - Regular</span>
                  <span className="text-xs text-muted-foreground font-mono">16px / 400</span>
                </div>
                <div className="flex items-baseline justify-between border-b border-border pb-3">
                  <span className="text-base font-medium text-foreground">Body Base - Medium</span>
                  <span className="text-xs text-muted-foreground font-mono">16px / 500</span>
                </div>
                <div className="flex items-baseline justify-between border-b border-border pb-3">
                  <span className="text-sm text-foreground">Body Small</span>
                  <span className="text-xs text-muted-foreground font-mono">14px / 400</span>
                </div>
                <div className="flex items-baseline justify-between border-b border-border pb-3">
                  <span className="text-sm font-medium text-foreground">Body Small - Medium</span>
                  <span className="text-xs text-muted-foreground font-mono">14px / 500</span>
                </div>
                <div className="flex items-baseline justify-between">
                  <span className="text-xs text-foreground">Caption / XS</span>
                  <span className="text-xs text-muted-foreground font-mono">12px / 400</span>
                </div>
              </div>
            </div>

            {/* Font Weights */}
            <div className="space-y-4">
              <h3 className="text-sm font-medium text-muted-foreground uppercase tracking-wider">
                Font Weights
              </h3>
              <div className="space-y-3 p-6 bg-card rounded-xl border border-border">
                <div className="flex items-center justify-between">
                  <span className="text-lg font-normal text-foreground">Regular</span>
                  <span className="text-xs text-muted-foreground font-mono">400</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-lg font-medium text-foreground">Medium</span>
                  <span className="text-xs text-muted-foreground font-mono">500</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-lg font-semibold text-foreground">Semibold</span>
                  <span className="text-xs text-muted-foreground font-mono">600</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-lg font-bold text-foreground">Bold</span>
                  <span className="text-xs text-muted-foreground font-mono">700</span>
                </div>
              </div>
            </div>

            {/* Text Colors */}
            <div className="space-y-4">
              <h3 className="text-sm font-medium text-muted-foreground uppercase tracking-wider">
                Text Colors
              </h3>
              <div className="space-y-3 p-6 bg-card rounded-xl border border-border">
                <div className="flex items-center justify-between">
                  <span className="text-foreground">Foreground (Primary)</span>
                  <span className="text-xs text-muted-foreground font-mono">--foreground</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">Muted Foreground</span>
                  <span className="text-xs text-muted-foreground font-mono">--muted-foreground</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-primary">Primary</span>
                  <span className="text-xs text-muted-foreground font-mono">--primary</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-destructive">Destructive</span>
                  <span className="text-xs text-muted-foreground font-mono">--destructive</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Button Components */}
        <section className="space-y-6">
          <h2 className="text-2xl font-semibold text-foreground">Button Components</h2>

          {/* Button Variants */}
          <div className="space-y-4">
            <h3 className="text-sm font-medium text-muted-foreground uppercase tracking-wider">
              Variants
            </h3>
            <div className="flex flex-wrap items-center gap-4 p-6 bg-card rounded-xl border border-border">
              <div className="space-y-2 text-center">
                <Button className="bg-blue-600 hover:bg-blue-700 text-white">Primary</Button>
                <p className="text-xs text-muted-foreground">Primary</p>
              </div>
              <div className="space-y-2 text-center">
                <Button variant="secondary">Secondary</Button>
                <p className="text-xs text-muted-foreground">Secondary</p>
              </div>
              <div className="space-y-2 text-center">
                <Button variant="outline">Outline</Button>
                <p className="text-xs text-muted-foreground">Outline</p>
              </div>
              <div className="space-y-2 text-center">
                <Button variant="ghost">Ghost</Button>
                <p className="text-xs text-muted-foreground">Ghost</p>
              </div>
              <div className="space-y-2 text-center">
                <Button variant="destructive">Danger</Button>
                <p className="text-xs text-muted-foreground">Danger</p>
              </div>
              <div className="space-y-2 text-center">
                <Button variant="link" className="text-blue-500">Link</Button>
                <p className="text-xs text-muted-foreground">Link</p>
              </div>
            </div>
          </div>

          {/* Button Sizes */}
          <div className="space-y-4">
            <h3 className="text-sm font-medium text-muted-foreground uppercase tracking-wider">
              Sizes
            </h3>
            <div className="flex flex-wrap items-end gap-4 p-6 bg-card rounded-xl border border-border">
              <div className="space-y-2 text-center">
                <Button size="sm" className="bg-blue-600 hover:bg-blue-700 text-white">Small</Button>
                <p className="text-xs text-muted-foreground">Small</p>
              </div>
              <div className="space-y-2 text-center">
                <Button size="default" className="bg-blue-600 hover:bg-blue-700 text-white">Medium</Button>
                <p className="text-xs text-muted-foreground">Medium (Default)</p>
              </div>
              <div className="space-y-2 text-center">
                <Button size="lg" className="bg-blue-600 hover:bg-blue-700 text-white">Large</Button>
                <p className="text-xs text-muted-foreground">Large</p>
              </div>
              <div className="space-y-2 text-center">
                <Button size="icon" className="bg-blue-600 hover:bg-blue-700 text-white">
                  <Plus className="h-4 w-4" />
                </Button>
                <p className="text-xs text-muted-foreground">Icon</p>
              </div>
            </div>
          </div>

          {/* Button States */}
          <div className="space-y-4">
            <h3 className="text-sm font-medium text-muted-foreground uppercase tracking-wider">
              States
            </h3>
            <div className="flex flex-wrap items-center gap-4 p-6 bg-card rounded-xl border border-border">
              <div className="space-y-2 text-center">
                <Button className="bg-blue-600 hover:bg-blue-700 text-white">Default</Button>
                <p className="text-xs text-muted-foreground">Default</p>
              </div>
              <div className="space-y-2 text-center">
                <Button className="bg-blue-700 text-white">Hover</Button>
                <p className="text-xs text-muted-foreground">Hover</p>
              </div>
              <div className="space-y-2 text-center">
                <Button className="bg-blue-800 text-white">Active</Button>
                <p className="text-xs text-muted-foreground">Active</p>
              </div>
              <div className="space-y-2 text-center">
                <Button disabled className="bg-blue-600 text-white">Disabled</Button>
                <p className="text-xs text-muted-foreground">Disabled</p>
              </div>
              <div className="space-y-2 text-center">
                <Button disabled className="bg-blue-600 text-white">
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Loading
                </Button>
                <p className="text-xs text-muted-foreground">Loading</p>
              </div>
            </div>
          </div>

          {/* Icon Buttons */}
          <div className="space-y-4">
            <h3 className="text-sm font-medium text-muted-foreground uppercase tracking-wider">
              With Icons
            </h3>
            <div className="flex flex-wrap items-center gap-4 p-6 bg-card rounded-xl border border-border">
              <Button className="bg-blue-600 hover:bg-blue-700 text-white">
                <Plus className="mr-2 h-4 w-4" />
                Add Deal
              </Button>
              <Button variant="outline">
                <Search className="mr-2 h-4 w-4" />
                Search
              </Button>
              <Button variant="secondary">
                <Bell className="mr-2 h-4 w-4" />
                Notifications
              </Button>
              <Button variant="ghost">
                <Settings className="mr-2 h-4 w-4" />
                Settings
              </Button>
            </div>
          </div>
        </section>

        {/* Form Elements */}
        <section className="space-y-6">
          <h2 className="text-2xl font-semibold text-foreground">Form Elements</h2>

          <div className="grid grid-cols-2 gap-8">
            {/* Text Inputs */}
            <div className="space-y-4">
              <h3 className="text-sm font-medium text-muted-foreground uppercase tracking-wider">
                Text Input
              </h3>
              <div className="space-y-6 p-6 bg-card rounded-xl border border-border">
                {/* Default */}
                <div className="space-y-2">
                  <Label htmlFor="default">Company Name</Label>
                  <Input id="default" placeholder="Enter company name..." />
                  <p className="text-xs text-muted-foreground">Helper text goes here</p>
                </div>

                {/* With Icon */}
                <div className="space-y-2">
                  <Label htmlFor="with-icon">Search</Label>
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                    <Input id="with-icon" className="pl-10" placeholder="Search startups..." />
                  </div>
                </div>

                {/* Error State */}
                <div className="space-y-2">
                  <Label htmlFor="error" className="text-destructive">Email Address</Label>
                  <Input
                    id="error"
                    className="border-destructive focus-visible:ring-destructive"
                    placeholder="Enter email..."
                    defaultValue="invalid-email"
                  />
                  <p className="text-xs text-destructive flex items-center gap-1">
                    <AlertCircle className="h-3 w-3" />
                    Please enter a valid email address
                  </p>
                </div>

                {/* Disabled */}
                <div className="space-y-2">
                  <Label htmlFor="disabled" className="text-muted-foreground">Disabled Input</Label>
                  <Input id="disabled" disabled placeholder="Cannot edit..." />
                </div>
              </div>
            </div>

            {/* Select & Dropdowns */}
            <div className="space-y-4">
              <h3 className="text-sm font-medium text-muted-foreground uppercase tracking-wider">
                Select / Dropdown
              </h3>
              <div className="space-y-6 p-6 bg-card rounded-xl border border-border">
                {/* Default Select */}
                <div className="space-y-2">
                  <Label>Pipeline Stage</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Select stage..." />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="intake">Intake</SelectItem>
                      <SelectItem value="screening">Screening</SelectItem>
                      <SelectItem value="due-diligence">Due Diligence</SelectItem>
                      <SelectItem value="decision">Decision</SelectItem>
                      <SelectItem value="term-sheet">Term Sheet</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* With Value */}
                <div className="space-y-2">
                  <Label>Sector</Label>
                  <Select defaultValue="saas">
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="saas">SaaS</SelectItem>
                      <SelectItem value="fintech">FinTech</SelectItem>
                      <SelectItem value="healthtech">HealthTech</SelectItem>
                      <SelectItem value="edtech">EdTech</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Multi-select with Tags */}
                <div className="space-y-2">
                  <Label>Tags</Label>
                  <div className="flex flex-wrap gap-2 p-3 bg-secondary/50 rounded-lg border border-input min-h-[42px]">
                    {selectedTags.map((tag) => (
                      <span
                        key={tag}
                        className="inline-flex items-center gap-1 px-2 py-1 bg-blue-500/20 text-blue-400 text-xs rounded-md"
                      >
                        {tag}
                        <button
                          onClick={() => removeTag(tag)}
                          className="hover:text-blue-300"
                        >
                          <X className="h-3 w-3" />
                        </button>
                      </span>
                    ))}
                    <input
                      type="text"
                      placeholder="Add tag..."
                      className="flex-1 bg-transparent text-sm outline-none min-w-[80px] text-foreground placeholder:text-muted-foreground"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Checkbox & Radio */}
            <div className="space-y-4">
              <h3 className="text-sm font-medium text-muted-foreground uppercase tracking-wider">
                Checkbox & Radio
              </h3>
              <div className="space-y-6 p-6 bg-card rounded-xl border border-border">
                {/* Checkboxes */}
                <div className="space-y-3">
                  <Label className="text-sm font-medium">Investment Preferences</Label>
                  <div className="space-y-2">
                    <div className="flex items-center space-x-2">
                      <Checkbox id="seed" defaultChecked />
                      <label htmlFor="seed" className="text-sm text-foreground">Seed Stage</label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox id="series-a" defaultChecked />
                      <label htmlFor="series-a" className="text-sm text-foreground">Series A</label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox id="series-b" />
                      <label htmlFor="series-b" className="text-sm text-foreground">Series B</label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox id="disabled-check" disabled />
                      <label htmlFor="disabled-check" className="text-sm text-muted-foreground">Disabled</label>
                    </div>
                  </div>
                </div>

                {/* Radio Buttons */}
                <div className="space-y-3">
                  <Label className="text-sm font-medium">Deal Type</Label>
                  <div className="space-y-2">
                    <div className="flex items-center space-x-2">
                      <input type="radio" name="deal-type" id="lead" defaultChecked className="h-4 w-4 accent-blue-500" />
                      <label htmlFor="lead" className="text-sm text-foreground">Lead Investor</label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <input type="radio" name="deal-type" id="follow" className="h-4 w-4 accent-blue-500" />
                      <label htmlFor="follow" className="text-sm text-foreground">Follow-on</label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <input type="radio" name="deal-type" id="syndicate" className="h-4 w-4 accent-blue-500" />
                      <label htmlFor="syndicate" className="text-sm text-foreground">Syndicate</label>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Toggle Switches */}
            <div className="space-y-4">
              <h3 className="text-sm font-medium text-muted-foreground uppercase tracking-wider">
                Toggle Switch
              </h3>
              <div className="space-y-6 p-6 bg-card rounded-xl border border-border">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Email Notifications</Label>
                    <p className="text-xs text-muted-foreground">Receive deal updates via email</p>
                  </div>
                  <Switch checked={toggleValue} onCheckedChange={setToggleValue} />
                </div>
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Auto-matching</Label>
                    <p className="text-xs text-muted-foreground">Enable AI-powered investor matching</p>
                  </div>
                  <Switch defaultChecked />
                </div>
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label className="text-muted-foreground">Disabled Toggle</Label>
                    <p className="text-xs text-muted-foreground">This feature is unavailable</p>
                  </div>
                  <Switch disabled />
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Data Display Components */}
        <section className="space-y-6">
          <h2 className="text-2xl font-semibold text-foreground">Data Display Components</h2>

          <div className="grid grid-cols-2 gap-8">
            {/* Badges */}
            <div className="space-y-4">
              <h3 className="text-sm font-medium text-muted-foreground uppercase tracking-wider">
                Badge / Tag Variants
              </h3>
              <div className="space-y-6 p-6 bg-card rounded-xl border border-border">
                {/* Status Badges */}
                <div className="space-y-3">
                  <p className="text-xs text-muted-foreground">Pipeline Status</p>
                  <div className="flex flex-wrap gap-2">
                    <Badge className="bg-slate-500/20 text-slate-300 hover:bg-slate-500/30">Intake</Badge>
                    <Badge className="bg-blue-500/20 text-blue-400 hover:bg-blue-500/30">Screening</Badge>
                    <Badge className="bg-amber-500/20 text-amber-400 hover:bg-amber-500/30">Due Diligence</Badge>
                    <Badge className="bg-purple-500/20 text-purple-400 hover:bg-purple-500/30">Decision</Badge>
                    <Badge className="bg-teal-500/20 text-teal-400 hover:bg-teal-500/30">Term Sheet</Badge>
                    <Badge className="bg-emerald-500/20 text-emerald-400 hover:bg-emerald-500/30">Closed Won</Badge>
                    <Badge className="bg-red-500/20 text-red-400 hover:bg-red-500/30">Closed Lost</Badge>
                  </div>
                </div>

                {/* Semantic Badges */}
                <div className="space-y-3">
                  <p className="text-xs text-muted-foreground">Semantic Status</p>
                  <div className="flex flex-wrap gap-2">
                    <Badge className="bg-emerald-500/20 text-emerald-400">
                      <CheckCircle2 className="mr-1 h-3 w-3" />
                      Active
                    </Badge>
                    <Badge className="bg-amber-500/20 text-amber-400">
                      <AlertCircle className="mr-1 h-3 w-3" />
                      Pending
                    </Badge>
                    <Badge className="bg-red-500/20 text-red-400">
                      <XCircle className="mr-1 h-3 w-3" />
                      Rejected
                    </Badge>
                    <Badge className="bg-blue-500/20 text-blue-400">
                      <Info className="mr-1 h-3 w-3" />
                      Info
                    </Badge>
                  </div>
                </div>

                {/* Category Tags */}
                <div className="space-y-3">
                  <p className="text-xs text-muted-foreground">Category Tags</p>
                  <div className="flex flex-wrap gap-2">
                    <Badge variant="outline">SaaS</Badge>
                    <Badge variant="outline">B2B</Badge>
                    <Badge variant="outline">Series A</Badge>
                    <Badge variant="outline">FinTech</Badge>
                    <Badge variant="outline">AI/ML</Badge>
                  </div>
                </div>
              </div>
            </div>

            {/* Avatars */}
            <div className="space-y-4">
              <h3 className="text-sm font-medium text-muted-foreground uppercase tracking-wider">
                Avatar
              </h3>
              <div className="space-y-6 p-6 bg-card rounded-xl border border-border">
                {/* Sizes */}
                <div className="space-y-3">
                  <p className="text-xs text-muted-foreground">Sizes</p>
                  <div className="flex items-end gap-4">
                    <div className="text-center space-y-2">
                      <Avatar className="h-8 w-8">
                        <AvatarFallback className="bg-blue-500/20 text-blue-400 text-xs">SM</AvatarFallback>
                      </Avatar>
                      <p className="text-xs text-muted-foreground">Small</p>
                    </div>
                    <div className="text-center space-y-2">
                      <Avatar className="h-10 w-10">
                        <AvatarFallback className="bg-blue-500/20 text-blue-400 text-sm">MD</AvatarFallback>
                      </Avatar>
                      <p className="text-xs text-muted-foreground">Medium</p>
                    </div>
                    <div className="text-center space-y-2">
                      <Avatar className="h-12 w-12">
                        <AvatarFallback className="bg-blue-500/20 text-blue-400">LG</AvatarFallback>
                      </Avatar>
                      <p className="text-xs text-muted-foreground">Large</p>
                    </div>
                    <div className="text-center space-y-2">
                      <Avatar className="h-16 w-16">
                        <AvatarFallback className="bg-blue-500/20 text-blue-400 text-lg">XL</AvatarFallback>
                      </Avatar>
                      <p className="text-xs text-muted-foreground">X-Large</p>
                    </div>
                  </div>
                </div>

                {/* With Initials */}
                <div className="space-y-3">
                  <p className="text-xs text-muted-foreground">With Initials</p>
                  <div className="flex gap-3">
                    <Avatar>
                      <AvatarFallback className="bg-blue-500/20 text-blue-400">AK</AvatarFallback>
                    </Avatar>
                    <Avatar>
                      <AvatarFallback className="bg-emerald-500/20 text-emerald-400">JD</AvatarFallback>
                    </Avatar>
                    <Avatar>
                      <AvatarFallback className="bg-purple-500/20 text-purple-400">SR</AvatarFallback>
                    </Avatar>
                    <Avatar>
                      <AvatarFallback className="bg-amber-500/20 text-amber-400">MK</AvatarFallback>
                    </Avatar>
                  </div>
                </div>

                {/* Avatar Group */}
                <div className="space-y-3">
                  <p className="text-xs text-muted-foreground">Avatar Group</p>
                  <div className="flex -space-x-3">
                    <Avatar className="border-2 border-card">
                      <AvatarFallback className="bg-blue-500/20 text-blue-400">AK</AvatarFallback>
                    </Avatar>
                    <Avatar className="border-2 border-card">
                      <AvatarFallback className="bg-emerald-500/20 text-emerald-400">JD</AvatarFallback>
                    </Avatar>
                    <Avatar className="border-2 border-card">
                      <AvatarFallback className="bg-purple-500/20 text-purple-400">SR</AvatarFallback>
                    </Avatar>
                    <Avatar className="border-2 border-card">
                      <AvatarFallback className="bg-secondary text-muted-foreground text-xs">+5</AvatarFallback>
                    </Avatar>
                  </div>
                </div>
              </div>
            </div>

            {/* Cards */}
            <div className="space-y-4">
              <h3 className="text-sm font-medium text-muted-foreground uppercase tracking-wider">
                Card Component
              </h3>
              <div className="space-y-4">
                <Card>
                  <CardHeader className="pb-3">
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-3">
                        <div className="h-10 w-10 rounded-lg bg-blue-500/20 flex items-center justify-center">
                          <Building2 className="h-5 w-5 text-blue-400" />
                        </div>
                        <div>
                          <CardTitle className="text-base">TechFlow AI</CardTitle>
                          <CardDescription>AI-powered workflow automation</CardDescription>
                        </div>
                      </div>
                      <Badge className="bg-blue-500/20 text-blue-400">Screening</Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center gap-6 text-sm">
                      <div>
                        <p className="text-muted-foreground">Valuation</p>
                        <p className="font-medium text-foreground">$12M</p>
                      </div>
                      <div>
                        <p className="text-muted-foreground">Raising</p>
                        <p className="font-medium text-foreground">$2.5M</p>
                      </div>
                      <div>
                        <p className="text-muted-foreground">Sector</p>
                        <p className="font-medium text-foreground">SaaS</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>

            {/* Table Row */}
            <div className="space-y-4">
              <h3 className="text-sm font-medium text-muted-foreground uppercase tracking-wider">
                Table Row Styles
              </h3>
              <div className="bg-card rounded-xl border border-border overflow-hidden">
                {/* Header */}
                <div className="grid grid-cols-4 gap-4 px-4 py-3 bg-secondary/50 border-b border-border text-xs font-medium text-muted-foreground uppercase tracking-wider">
                  <span>Company</span>
                  <span>Stage</span>
                  <span>Value</span>
                  <span>Updated</span>
                </div>
                {/* Rows */}
                <div className="divide-y divide-border">
                  <div className="grid grid-cols-4 gap-4 px-4 py-3 hover:bg-secondary/30 transition-colors">
                    <div className="flex items-center gap-2">
                      <Avatar className="h-8 w-8">
                        <AvatarFallback className="bg-blue-500/20 text-blue-400 text-xs">TF</AvatarFallback>
                      </Avatar>
                      <span className="font-medium text-foreground">TechFlow</span>
                    </div>
                    <Badge className="bg-blue-500/20 text-blue-400 w-fit">Screening</Badge>
                    <span className="text-foreground">$2.5M</span>
                    <span className="text-muted-foreground">2h ago</span>
                  </div>
                  <div className="grid grid-cols-4 gap-4 px-4 py-3 hover:bg-secondary/30 transition-colors">
                    <div className="flex items-center gap-2">
                      <Avatar className="h-8 w-8">
                        <AvatarFallback className="bg-emerald-500/20 text-emerald-400 text-xs">GF</AvatarFallback>
                      </Avatar>
                      <span className="font-medium text-foreground">GreenFin</span>
                    </div>
                    <Badge className="bg-amber-500/20 text-amber-400 w-fit">Due Diligence</Badge>
                    <span className="text-foreground">$5M</span>
                    <span className="text-muted-foreground">1d ago</span>
                  </div>
                  <div className="grid grid-cols-4 gap-4 px-4 py-3 hover:bg-secondary/30 transition-colors bg-blue-500/5">
                    <div className="flex items-center gap-2">
                      <Avatar className="h-8 w-8">
                        <AvatarFallback className="bg-purple-500/20 text-purple-400 text-xs">NX</AvatarFallback>
                      </Avatar>
                      <span className="font-medium text-foreground">NexGen</span>
                    </div>
                    <Badge className="bg-teal-500/20 text-teal-400 w-fit">Term Sheet</Badge>
                    <span className="text-foreground">$8M</span>
                    <span className="text-muted-foreground">3d ago</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Footer */}
        <footer className="border-t border-border pt-8 text-center">
          <p className="text-sm text-muted-foreground">
            Volery 2.0 Design System &middot; Anthill Ventures &middot; Version 1.0
          </p>
        </footer>
      </div>
    </div>
  )
}

export default function DesignSystemPageWrapper() {
  return (
    <Suspense fallback={<Loading />}>
      <DesignSystemPage />
    </Suspense>
  )
}
