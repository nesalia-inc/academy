"use client"

import { useMemo } from "react"
import { useQueryState } from "nuqs"
import { parseAsString } from "nuqs"
import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  useReactTable,
} from "@tanstack/react-table"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Input } from "@/components/ui/input"
import { ColoredBadge } from "@/components/challenges/colored-badge"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { CheckCircle, Circle, Flame, Search } from "lucide-react"

type Challenge = {
  id: string
  name: string
  difficulty: "Easy" | "Medium" | "Hard"
  category: string
  status: "completed" | "in_progress" | "not_started"
}

const challenges: Challenge[] = [
  { id: "1", name: "Two Sum", difficulty: "Easy", category: "Arrays", status: "completed" },
  { id: "2", name: "Valid Parentheses", difficulty: "Medium", category: "Strings", status: "in_progress" },
  { id: "3", name: "Binary Tree Inorder", difficulty: "Easy", category: "Trees", status: "not_started" },
  { id: "4", name: "LRU Cache", difficulty: "Hard", category: "Arrays", status: "completed" },
  { id: "5", name: "Reverse Linked List", difficulty: "Easy", category: "Linked Lists", status: "in_progress" },
]

const categories = ["Arrays", "Strings", "Trees", "Linked Lists"] as const
const difficulties = ["Easy", "Medium", "Hard"] as const
type Difficulty = (typeof difficulties)[number]
type Category = (typeof categories)[number]

const StatusIcon = ({ status }: { status: Challenge["status"] }) => {
  switch (status) {
    case "completed":
      return <CheckCircle className="size-4 text-green-500" />
    case "in_progress":
      return <Flame className="size-4 text-orange-500" />
    case "not_started":
      return <Circle className="size-4 text-muted-foreground" />
  }
}

const columns: ColumnDef<Challenge>[] = [
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => <StatusIcon status={row.original.status} />,
  },
  {
    accessorKey: "name",
    header: "Name",
  },
  {
    accessorKey: "difficulty",
    header: "Difficulty",
    cell: ({ row }) => {
      const diff = row.original.difficulty
      const color = diff === "Easy" ? "green" : diff === "Medium" ? "orange" : "red"
      return <ColoredBadge color={color}>{diff}</ColoredBadge>
    },
  },
  {
    accessorKey: "category",
    header: "Category",
    cell: ({ row }) => {
      const cat = row.original.category
      const color = cat === "Arrays" ? "blue" : cat === "Strings" ? "purple" : cat === "Trees" ? "green" : "pink"
      return <ColoredBadge color={color}>{cat}</ColoredBadge>
    },
  },
]

export function ChallengeTable() {
  const [search, setSearch] = useQueryState(
    "q",
    parseAsString.withDefault("")
  )
  const [difficulty, setDifficulty] = useQueryState("difficulty")
  const [category, setCategory] = useQueryState("category")

  const handleDifficultyChange = (value: string) => {
    if (value === "all") {
      setDifficulty(null)
    } else {
      setDifficulty(value)
    }
  }

  const handleCategoryChange = (value: string) => {
    if (value === "all") {
      setCategory(null)
    } else {
      setCategory(value)
    }
  }

  const filteredChallenges = useMemo(() => {
    return challenges.filter((challenge) => {
      const matchesSearch =
        !search ||
        challenge.name.toLowerCase().includes(search.toLowerCase())
      const matchesDifficulty = !difficulty || challenge.difficulty === difficulty
      const matchesCategory = !category || challenge.category === category
      return matchesSearch && matchesDifficulty && matchesCategory
    })
  }, [search, difficulty, category])

  const table = useReactTable({
    data: filteredChallenges,
    columns,
    getCoreRowModel: getCoreRowModel(),
  })

  return (
    <div className="space-y-4">
      <div className="flex gap-4 flex-wrap">
        <div className="relative flex-1 min-w-[200px]">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
          <Input
            placeholder="Search challenges..."
            value={search || ""}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9"
          />
        </div>
        <Select value={difficulty ?? "all"} onValueChange={handleDifficultyChange}>
          <SelectTrigger className="w-[150px]">
            <SelectValue placeholder="Difficulty" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All difficulties</SelectItem>
            {difficulties.map((d) => (
              <SelectItem key={d} value={d}>
                {d}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Select value={category ?? "all"} onValueChange={handleCategoryChange}>
          <SelectTrigger className="w-[150px]">
            <SelectValue placeholder="Category" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All categories</SelectItem>
            {categories.map((c) => (
              <SelectItem key={c} value={c}>
                {c}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="border rounded-md">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <TableHead key={header.id}>
                    {header.isPlaceholder
                      ? null
                      : flexRender(header.column.columnDef.header, header.getContext())}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows.map((row) => (
              <TableRow key={row.id}>
                {row.getVisibleCells().map((cell) => (
                  <TableCell key={cell.id}>
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </TableCell>
                ))}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}