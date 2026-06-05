import { create } from "zustand"

export interface File {
  id: string
  name: string
  path: string
  content: string
  language: string
}

interface ChallengeEditorState {
  files: File[]
  activeFileId: string | null
  openFileIds: string[]
  setActiveFile: (id: string) => void
  updateFileContent: (id: string, content: string) => void
  openFile: (id: string) => void
  closeFile: (id: string) => void
  addFile: (file: File) => void
}

const defaultFiles: File[] = [
  // Root files
  {
    id: "readme",
    name: "README.md",
    path: "/README.md",
    content: `# Two Sum

A classic algorithm problem from LeetCode.

## Problem
Given an array of integers, return indices of the two numbers that add up to target.`,
    language: "markdown",
  },
  {
    id: "solution",
    name: "solution.ts",
    path: "/src/solution.ts",
    content: `function twoSum(nums: number[], target: number): number[] {
  // Your code here

  return [];
}`,
    language: "typescript",
  },
  {
    id: "test",
    name: "solution.test.ts",
    path: "/src/solution.test.ts",
    content: `import { twoSum } from './solution';

describe('twoSum', () => {
  test('basic case', () => {
    expect(twoSum([2, 7, 11, 15], 9)).toEqual([0, 1]);
  });
});`,
    language: "typescript",
  },
  {
    id: "types",
    name: "types.ts",
    path: "/src/types.ts",
    content: `export interface TestCase {
  input: number[];
  target: number;
  expected: number[];
}

export type Result = 'accepted' | 'wrong_answer' | 'time_limit' | 'error';`,
    language: "typescript",
  },
  {
    id: "helpers",
    name: "helpers.ts",
    path: "/src/utils/helpers.ts",
    content: `export function createMapFromArray<T>(arr: T[], keyFn: (item: T) => string | number): Map<string | number, T> {
  return new Map(arr.map((item) => [keyFn(item), item]));
}`,
    language: "typescript",
  },
  {
    id: "config",
    name: "config.json",
    path: "/config.json",
    content: `{
  "name": "two-sum",
  "difficulty": "easy",
  "tags": ["array", "hash-table"],
  "timeLimit": 2000
}`,
    language: "json",
  },
]

export const useChallengeEditorStore = create<ChallengeEditorState>((set) => ({
  files: defaultFiles,
  activeFileId: "solution",
  openFileIds: ["solution"],

  setActiveFile: (id) =>
    set((state) => ({
      activeFileId: id,
      openFileIds: state.openFileIds.includes(id)
        ? state.openFileIds
        : [...state.openFileIds, id],
    })),

  updateFileContent: (id, content) =>
    set((state) => ({
      files: state.files.map((file) =>
        file.id === id ? { ...file, content } : file
      ),
    })),

  openFile: (id) =>
    set((state) => ({
      activeFileId: id,
      openFileIds: state.openFileIds.includes(id)
        ? state.openFileIds
        : [...state.openFileIds, id],
    })),

  closeFile: (id) =>
    set((state) => {
      const newOpenFiles = state.openFileIds.filter((fileId) => fileId !== id)
      const newActiveId =
        state.activeFileId === id
          ? newOpenFiles[newOpenFiles.length - 1] ?? null
          : state.activeFileId

      return {
        openFileIds: newOpenFiles,
        activeFileId: newActiveId,
      }
    }),

  addFile: (file) =>
    set((state) => ({
      files: [...state.files, file],
      activeFileId: file.id,
      openFileIds: [...state.openFileIds, file.id],
    })),
}))
