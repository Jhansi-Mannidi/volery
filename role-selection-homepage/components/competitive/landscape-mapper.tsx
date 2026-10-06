'use client'

import { useState } from 'react'
import {
  ScatterChart,
  Scatter,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from 'recharts'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import {
  Download,
  Share2,
  Plus,
  Sparkles,
  BarChart3,
  Grid3X3,
  Table as TableIcon,
} from 'lucide-react'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'

// Mock data for competitive positioning (Market Share vs Product Maturity)
const competitiveData = [
  {
    name: 'TechCorp AI',
    x: 60, // Product Maturity (0-100)
    y: 55, // Market Share (0-100)
    revenue: 30,
    isTarget: true,
    color: '#06B6D4',
  },
  {
    name: 'Competitor A',
    x: 85,
    y: 80,
    revenue: 50,
    isTarget: false,
    color: '#EF4444',
  },
  {
    name: 'Competitor B',
    x: 65,
    y: 70,
    revenue: 25,
    isTarget: false,
    color: '#F97316',
  },
  {
    name: 'Competitor C',
    x: 78,
    y: 65,
    revenue: 15,
    isTarget: false,
    color: '#EF4444',
  },
  {
    name: 'Competitor D',
    x: 72,
    y: 50,
    revenue: 12,
    isTarget: false,
    color: '#EC4899',
  },
  {
    name: 'Startup X',
    x: 30,
    y: 25,
    revenue: 5,
    isTarget: false,
    color: '#8B5CF6',
  },
  {
    name: 'Startup Y',
    x: 40,
    y: 20,
    revenue: 3,
    isTarget: false,
    color: '#A78BFA',
  },
]

const competitors = [
  {
    id: 1,
    name: 'Competitor A',
    tagline: 'Market Leader',
    revenue: '$50M',
    funding: '$120M',
    employees: 500,
    strengths: ['Brand recognition', 'Distribution', 'Market presence'],
    vs: [
      { label: 'Weaker AI/ML', value: -1 },
      { label: 'More customers', value: 1 },
    ],
  },
  {
    id: 2,
    name: 'Competitor B',
    tagline: 'Fast Growing',
    revenue: '$25M',
    funding: '$45M',
    employees: 200,
    strengths: ['Tech innovation', 'Product UX', 'Developer friendly'],
    vs: [
      { label: 'Similar product', value: 0 },
      { label: 'Less funding', value: -1 },
    ],
  },
  {
    id: 3,
    name: 'Competitor C',
    tagline: 'Enterprise Focus',
    revenue: '$15M',
    funding: '$30M',
    employees: 100,
    strengths: ['Enterprise sales', 'Security certs', 'Compliance'],
    vs: [
      { label: 'Better enterprise', value: 1 },
      { label: 'Slower growth', value: -1 },
    ],
  },
]

const featureComparison = [
  {
    feature: 'AI/ML Capability',
    techcorp: 5,
    compA: 3,
    compB: 4,
    compC: 3,
    avg: 3.75,
  },
  {
    feature: 'Pricing Value',
    techcorp: 4,
    compA: 2,
    compB: 3,
    compC: 3,
    avg: 2.75,
  },
  {
    feature: 'Enterprise Ready',
    techcorp: 4,
    compA: 5,
    compB: 3,
    compC: 5,
    avg: 4.25,
  },
  {
    feature: 'API Integration',
    techcorp: 5,
    compA: 3,
    compB: 4,
    compC: 4,
    avg: 4.0,
  },
  {
    feature: 'Customer Support',
    techcorp: 4,
    compA: 5,
    compB: 3,
    compC: 4,
    avg: 4.0,
  },
  {
    feature: 'Mobile App',
    techcorp: 1,
    compA: 1,
    compB: 0,
    compC: 1,
    avg: 0.75,
  },
  {
    feature: 'Multi-language',
    techcorp: 2,
    compA: 3,
    compB: 1,
    compC: 2,
    avg: 2.0,
  },
]

const StarRating = ({ value }: { value: number }) => (
  <div className="flex gap-0.5">
    {[1, 2, 3, 4, 5].map((star) => (
      <span
        key={star}
        className={star <= value ? 'text-yellow-400' : 'text-gray-300'}
      >
        ★
      </span>
    ))}
  </div>
)

export function CompetitiveLandscapeMapper() {
  const [viewMode, setViewMode] = useState<'bubble' | 'quadrant' | 'table'>(
    'bubble'
  )

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload[0]) {
      const data = payload[0].payload
      return (
        <div className="bg-white border border-border rounded-lg p-3 shadow-lg">
          <p className="font-semibold text-sm text-foreground">{data.name}</p>
          <div className="space-y-1 mt-1 text-xs text-muted-foreground">
            <p>Product Maturity: {data.x}</p>
            <p>Market Share: {data.y}</p>
            <p className="font-medium text-foreground">Revenue: ${data.revenue}M</p>
          </div>
        </div>
      )
    }
    return null
  }

  return (
    <div className="space-y-6">
      {/* Competitive Positioning Matrix */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <BarChart3 className="w-5 h-5 text-cyan-600" />
              Competitive Positioning Matrix
            </CardTitle>
            <CardDescription>
              Market positioning across key dimensions
            </CardDescription>
          </div>
          <Button
            variant="outline"
            size="sm"
            className="bg-transparent"
          >
            Customize Axes
          </Button>
        </CardHeader>
        <CardContent>
          {/* Chart with background grid areas */}
          <div className="relative">
            <ResponsiveContainer width="100%" height={500}>
              <ScatterChart
                margin={{ top: 20, right: 60, bottom: 120, left: 100 }}
                data={competitiveData}
              >
                <CartesianGrid 
                  strokeDasharray="4 4" 
                  stroke="hsl(var(--border))" 
                  vertical={true}
                  horizontal={true}
                />
                <XAxis
                  dataKey="x"
                  type="number"
                  name="Product Maturity"
                  label={{
                    value: 'Product Maturity →',
                    position: 'bottom',
                    offset: 60,
                    fontSize: 13,
                    fontWeight: 600,
                    fill: 'hsl(var(--foreground))',
                  }}
                  stroke="hsl(var(--foreground))"
                  tick={{ fontSize: 12, fill: 'hsl(var(--muted-foreground))' }}
                  domain={[0, 100]}
                  ticks={[0, 25, 50, 75, 100]}
                />
                <YAxis
                  dataKey="y"
                  type="number"
                  name="Market Share"
                  label={{
                    value: 'Market Share',
                    angle: -90,
                    position: 'insideLeft',
                    offset: 20,
                    fontSize: 13,
                    fontWeight: 600,
                    fill: 'hsl(var(--foreground))',
                  }}
                  stroke="hsl(var(--foreground))"
                  tick={{ fontSize: 12, fill: 'hsl(var(--muted-foreground))' }}
                  domain={[0, 100]}
                  ticks={[0, 25, 50, 75, 100]}
                />
                <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(0,0,0,0.05)' }} />
                <Legend 
                  wrapperStyle={{ paddingTop: '40px', fontSize: '13px', display: 'none' }}
                  verticalAlign="bottom"
                  height={30}
                />
                <Scatter
                  name="★ TechCorp AI (Target)"
                  data={competitiveData.filter((d) => d.isTarget)}
                  fill="#06B6D4"
                  shape="star"
                  fillOpacity={0.9}
                />
                <Scatter
                  name="● Competitors"
                  data={competitiveData.filter((d) => !d.isTarget)}
                  fill="#EF4444"
                  shape="circle"
                  fillOpacity={0.8}
                />
              </ScatterChart>
            </ResponsiveContainer>
          </div>
          
          {/* Custom Legend Below Chart */}
          <div className="mt-8 pt-6 border-t border-border space-y-4">
            <div className="flex flex-wrap items-center gap-6">
              <div className="flex items-center gap-2">
                <div className="w-5 h-5 flex items-center justify-center text-lg">★</div>
                <span className="text-sm font-medium text-foreground">TechCorp AI (Target)</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-5 h-5 rounded-full bg-red-500 opacity-80"></div>
                <span className="text-sm font-medium text-foreground">Competitors</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="flex items-center gap-1">
                  <div className="w-3 h-3 rounded-full bg-gray-300"></div>
                  <div className="w-5 h-5 rounded-full bg-gray-300"></div>
                  <div className="w-7 h-7 rounded-full bg-gray-300"></div>
                </div>
                <span className="text-sm font-medium text-foreground">Bubble Size = Revenue</span>
              </div>
            </div>
            <div className="grid grid-cols-3 gap-4 mb-4">
              <div className="p-3 bg-cyan-50 rounded-lg">
                <p className="text-xs font-semibold text-cyan-900 mb-1">High Maturity & Share</p>
                <p className="text-xs text-cyan-700">Market leaders with established positions</p>
              </div>
              <div className="p-3 bg-amber-50 rounded-lg">
                <p className="text-xs font-semibold text-amber-900 mb-1">Growing Players</p>
                <p className="text-xs text-amber-700">Developing maturity with growing market share</p>
              </div>
              <div className="p-3 bg-purple-50 rounded-lg">
                <p className="text-xs font-semibold text-purple-900 mb-1">Early Stage</p>
                <p className="text-xs text-purple-700">New entrants with emerging presence</p>
              </div>
            </div>
            <div className="flex items-center border border-border rounded-lg p-1 bg-muted/30 w-fit">
              {[
                { label: 'Bubble Chart', mode: 'bubble', icon: BarChart3 },
                { label: 'Quadrant', mode: 'quadrant', icon: Grid3X3 },
                { label: 'Table', mode: 'table', icon: TableIcon },
              ].map(({ label, mode, icon: Icon }) => (
                <Button
                  key={mode}
                  variant={viewMode === mode ? 'default' : 'ghost'}
                  size="sm"
                  className="h-8 px-3 gap-1.5 rounded-md"
                  onClick={() => setViewMode(mode as 'bubble' | 'quadrant' | 'table')}
                  aria-label={label}
                >
                  <Icon className="w-4 h-4 shrink-0" />
                  {label}
                </Button>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Competitor Cards */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle className="text-lg">Competitors ({competitors.length})</CardTitle>
            <CardDescription>
              Detailed analysis of market competitors
            </CardDescription>
          </div>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              className="gap-1 bg-transparent"
            >
              <Plus className="w-4 h-4" />
              Add
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="gap-1 bg-transparent"
            >
              <Sparkles className="w-4 h-4" />
              AI: Find More
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {competitors.map((competitor) => (
              <div
                key={competitor.id}
                className="border border-border rounded-lg p-4 hover:shadow-lg hover:border-cyan-300 transition-all hover:bg-gradient-to-br hover:from-cyan-50/30 hover:to-transparent"
              >
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <h4 className="font-semibold text-sm text-foreground">{competitor.name}</h4>
                    <p className="text-xs text-cyan-600 font-medium mt-0.5">
                      {competitor.tagline}
                    </p>
                  </div>
                  <div className="text-2xl">🏢</div>
                </div>

                <div className="space-y-2 mb-4 text-sm border-b border-border pb-4">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Revenue:</span>
                    <span className="font-medium text-foreground">{competitor.revenue}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Funding:</span>
                    <span className="font-medium text-foreground">{competitor.funding}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Team:</span>
                    <span className="font-medium text-foreground">{competitor.employees}</span>
                  </div>
                </div>

                <div className="mb-4">
                  <p className="text-xs font-semibold text-muted-foreground mb-2 uppercase tracking-wide">
                    Key Strengths
                  </p>
                  <ul className="text-xs space-y-1">
                    {competitor.strengths.map((strength, idx) => (
                      <li key={idx} className="text-muted-foreground flex items-start gap-2">
                        <span className="text-cyan-600 mt-0.5">•</span>
                        <span>{strength}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="space-y-2 pt-3 border-t border-border">
                  {competitor.vs.map((item, idx) => (
                    <div key={idx} className="flex items-center justify-between text-xs">
                      <span className="text-muted-foreground">{item.label}</span>
                      <span className={`font-semibold ${
                        item.value > 0 ? 'text-green-600' : item.value < 0 ? 'text-red-600' : 'text-gray-500'
                      }`}>
                        {item.value > 0 ? '+' : ''}{item.value === 0 ? '=' : item.value}
                      </span>
                    </div>
                  ))}
                </div>

                <Button
                  variant="outline"
                  size="sm"
                  className="w-full bg-transparent text-xs"
                >
                  View Full Profile
                </Button>
              </div>
            ))}
          </div>
          <Button variant="outline" className="w-full bg-transparent">
            Load More Competitors
          </Button>
        </CardContent>
      </Card>

      {/* Feature Comparison Table */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <TableIcon className="w-5 h-5 text-cyan-600" />
              Feature Comparison
            </CardTitle>
            <CardDescription>
              Head-to-head feature analysis across competitors
            </CardDescription>
          </div>
          <Button
            variant="outline"
            size="sm"
            className="gap-1 bg-transparent"
          >
            <Download className="w-4 h-4" />
            Export
          </Button>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-32">Feature</TableHead>
                  <TableHead>TechCorp AI</TableHead>
                  <TableHead>Competitor A</TableHead>
                  <TableHead>Competitor B</TableHead>
                  <TableHead>Competitor C</TableHead>
                  <TableHead>Industry Avg</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {featureComparison.map((row, idx) => (
                  <TableRow key={idx}>
                    <TableCell className="font-medium text-sm">
                      {row.feature}
                    </TableCell>
                    <TableCell>
                      <StarRating value={row.techcorp} />
                    </TableCell>
                    <TableCell>
                      <StarRating value={row.compA} />
                    </TableCell>
                    <TableCell>
                      <StarRating value={row.compB} />
                    </TableCell>
                    <TableCell>
                      <StarRating value={row.compC} />
                    </TableCell>
                    <TableCell>
                      <StarRating value={Math.round(row.avg)} />
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
          <div className="flex gap-2 mt-4 pt-4 border-t border-border">
            <Button
              variant="outline"
              size="sm"
              className="gap-1 bg-transparent"
            >
              <Plus className="w-4 h-4" />
              Add Feature Row
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="gap-1 bg-transparent"
            >
              <Sparkles className="w-4 h-4" />
              AI: Suggest Features
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
