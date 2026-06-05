import { ColoredBadge } from "@/components/challenges/colored-badge"

export default function DescriptionPage() {
  return (
    <div className="space-y-6">
      {/* Problem Statement */}
      <section className="space-y-4">
        <h2 className="text-lg font-semibold">Problem</h2>
        <p className="text-sm leading-relaxed">
          Given an array of integers <code className="bg-muted px-1 py-0.5 rounded text-xs">nums</code>{" "}
          and an integer <code className="bg-muted px-1 py-0.5 rounded text-xs">target</code>, return
          indices of the two numbers such that they add up to{" "}
          <code className="bg-muted px-1 py-0.5 rounded text-xs">target</code>.
        </p>
        <p className="text-sm leading-relaxed">
          You may assume that each input would have <strong>exactly one solution</strong>, and you may
          not use the same element twice.
        </p>
      </section>

      {/* Divider */}
      <div className="border-t" />

      {/* Examples */}
      <section className="space-y-4">
        <h2 className="text-lg font-semibold">Examples</h2>
        <div className="space-y-4">
          <div>
            <p className="text-sm font-medium mb-2">Example 1:</p>
            <pre className="bg-muted p-3 rounded-md text-sm">
{`Input: nums = [2,7,11,15], target = 9
Output: [0,1]
Explanation: Because nums[0] + nums[1] == 9, we return [0, 1].`}
            </pre>
          </div>
          <div>
            <p className="text-sm font-medium mb-2">Example 2:</p>
            <pre className="bg-muted p-3 rounded-md text-sm">
{`Input: nums = [3,2,4], target = 6
Output: [1,2]`}
            </pre>
          </div>
        </div>
      </section>

      {/* Divider */}
      <div className="border-t" />

      {/* Constraints */}
      <section className="space-y-4">
        <h2 className="text-lg font-semibold">Constraints</h2>
        <ul className="text-sm space-y-1 list-disc list-inside text-muted-foreground">
          <li>2 &lt;= nums.length &lt;= 10^4</li>
          <li>-10^9 &lt;= nums[i] &lt;= 10^9</li>
          <li>-10^9 &lt;= target &lt;= 10^9</li>
          <li>Only one valid answer exists.</li>
        </ul>
      </section>

      {/* Divider */}
      <div className="border-t" />

      {/* Hints */}
      <section className="space-y-4">
        <h2 className="text-lg font-semibold">Hints</h2>
        <ul className="text-sm space-y-2 list-disc list-inside text-muted-foreground">
          <li>A brute force approach would be O(n²)</li>
          <li>Can you use a hash table to achieve O(n)?</li>
        </ul>
      </section>
    </div>
  )
}
