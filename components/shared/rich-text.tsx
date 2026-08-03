import type { ReactNode } from "react"

import { cn } from "@/lib/utils"

function safeHref(value: string) {
  if (value.startsWith("/") || value.startsWith("#")) return value
  try {
    const url = new URL(value)
    return ["http:", "https:", "mailto:"].includes(url.protocol) ? value : null
  } catch {
    return null
  }
}

function inline(value: string): ReactNode[] {
  const tokens = value.split(/(\*\*[^*]+\*\*|`[^`]+`|\[[^\]]+\]\([^)]+\))/g)
  return tokens.map((token, index) => {
    if (token.startsWith("**") && token.endsWith("**")) {
      return <strong key={index}>{token.slice(2, -2)}</strong>
    }
    if (token.startsWith("`") && token.endsWith("`")) {
      return (
        <code key={index} className="rounded bg-current/8 px-1.5 py-0.5">
          {token.slice(1, -1)}
        </code>
      )
    }
    const link = token.match(/^\[([^\]]+)\]\(([^)]+)\)$/)
    if (link) {
      const href = safeHref(link[2])
      return href ? (
        <a
          key={index}
          href={href}
          rel={href.startsWith("http") ? "noreferrer" : undefined}
          className="font-semibold text-[#007d89] underline underline-offset-4 dark:text-[#65f2f1]"
        >
          {link[1]}
        </a>
      ) : (
        link[1]
      )
    }
    return token
  })
}

export function RichText({
  value,
  className,
}: {
  value: string
  className?: string
}) {
  const blocks = value.trim().split(/\n{2,}/)
  return (
    <div className={cn("space-y-6", className)}>
      {blocks.map((block, index) => {
        const lines = block.split("\n")
        if (block.startsWith("### ")) {
          return (
            <h3 key={index} className="text-2xl font-semibold">
              {inline(block.slice(4))}
            </h3>
          )
        }
        if (block.startsWith("## ")) {
          return (
            <h2 key={index} className="text-3xl font-semibold">
              {inline(block.slice(3))}
            </h2>
          )
        }
        if (lines.every((line) => line.startsWith("- "))) {
          return (
            <ul key={index} className="list-disc space-y-2 pl-6">
              {lines.map((line) => (
                <li key={line}>{inline(line.slice(2))}</li>
              ))}
            </ul>
          )
        }
        if (lines.every((line) => /^\d+\. /.test(line))) {
          return (
            <ol key={index} className="list-decimal space-y-2 pl-6">
              {lines.map((line) => (
                <li key={line}>{inline(line.replace(/^\d+\. /, ""))}</li>
              ))}
            </ol>
          )
        }
        if (lines.every((line) => line.startsWith("> "))) {
          return (
            <blockquote
              key={index}
              className="border-l-2 border-[#00a6b2] pl-5 text-xl italic"
            >
              {inline(lines.map((line) => line.slice(2)).join(" "))}
            </blockquote>
          )
        }
        return (
          <p key={index} className="whitespace-pre-line">
            {inline(block)}
          </p>
        )
      })}
    </div>
  )
}
