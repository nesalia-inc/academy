"use client"

import Link from "next/link"
import { Card, CardContent } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { CheckCircle, XCircle, Clock, Flame } from "lucide-react"

const submissions = [
  {
    id: "sub-1",
    status: "accepted" as const,
    language: "TypeScript",
    runtime: "52 ms",
    memory: "44.9 MB",
    submittedAt: "2 hours ago",
  },
  {
    id: "sub-2",
    status: "accepted" as const,
    language: "Python",
    runtime: "48 ms",
    memory: "42.1 MB",
    submittedAt: "1 day ago",
  },
  {
    id: "sub-3",
    status: "wrong_answer" as const,
    language: "TypeScript",
    runtime: "—",
    memory: "—",
    submittedAt: "2 days ago",
  },
  {
    id: "sub-4",
    status: "time_limit" as const,
    language: "Python",
    runtime: "—",
    memory: "—",
    submittedAt: "3 days ago",
  },
]

const StatusIcon = ({ status }: { status: (typeof submissions)[0]["status"] }) => {
  switch (status) {
    case "accepted":
      return <CheckCircle className="size-4 text-green-500" />
    case "wrong_answer":
      return <XCircle className="size-4 text-red-500" />
    case "time_limit":
      return <Clock className="size-4 text-orange-500" />
    default:
      return <Flame className="size-4 text-muted-foreground" />
  }
}

export default function SubmissionsPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold">My Submissions</h2>
        <Link
          href="/challenges/two-sum/submissions/new"
          className="px-4 py-2 bg-primary text-primary-foreground rounded-md text-sm font-medium hover:opacity-90"
        >
          New Submission
        </Link>
      </div>

      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Status</TableHead>
                <TableHead>Language</TableHead>
                <TableHead>Runtime</TableHead>
                <TableHead>Memory</TableHead>
                <TableHead>Submitted</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {submissions.map((submission) => (
                <TableRow key={submission.id}>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <StatusIcon status={submission.status} />
                      <span className="capitalize">{submission.status.replace("_", " ")}</span>
                    </div>
                  </TableCell>
                  <TableCell>{submission.language}</TableCell>
                  <TableCell>{submission.runtime}</TableCell>
                  <TableCell>{submission.memory}</TableCell>
                  <TableCell>{submission.submittedAt}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}
