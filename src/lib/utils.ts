import { type TreeItem } from "@/types";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Converts a record of file paths and their contents into a tree structure suitable for rendering in a UI component.
 * @param files - An object where keys are file paths and values are file contents.
 * @returns An array of tree items, each representing a file or directory.
 * @example
 * Input: {"src/index.js": "console.log('Hello World');", "src/utils.js": "export function add(a, b) { return a + b; }"}
 * Output: [
 *   { id: "src", name: "src", type: "directory", children: [
 *     { id: "src/index.js", name: "index.js", type: "file", content: "console.log('Hello World');" },
 *    { id: "src/utils.js", name: "utils.js", type: "file", content: "export function add(a, b) { return a + b; }" }
 *  ] }
 */
export function convertFilesToTreeItems(files: {
  [path: string]: string;
}): TreeItem[] {
  interface TreeNode {
    [key: string]: TreeNode | null;
  }
  const tree: TreeNode = {};

  const sortedPaths = Object.keys(files).sort();

  for (const filePath of sortedPaths) {
    const parts = filePath.split("/");
    let current = tree;
    for (let i = 0; i < parts.length - 1; i++) {
      const part = parts[i];
      if (!current[part]) {
        current[part] = {};
      }
      current = current[part];
    }

    const fileName = parts[parts.length - 1];
    current[fileName] = null;
  }

  function convertNode(node: TreeNode, name?: string): TreeItem[] | TreeItem {
    const entries = Object.entries(node);
    if (entries.length === 0) {
      return name || "";
    }
    const children: TreeItem[] = [];

    for (const [key, value] of entries) {
      if (value === null) {
        // This is a file
        children.push(key);
      } else {
        // This is a directory
        const subtree = convertNode(value, key);
        if (Array.isArray(subtree)) {
          children.push([key, ...subtree]);
        } else {
          children.push([key, subtree]);
        }
      }
    }

    return children;
  }

  const result = convertNode(tree);
  return Array.isArray(result) ? result : [result];
}
