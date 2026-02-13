---
name: my-plan
description: "Create a structured implementation plan for a feature or task"
allowed-tools:
  - Read
  - Grep
  - Glob
  - Bash
  - WebSearch
  - WebFetch
  - TaskCreate
  - TaskUpdate
  - TaskList
  - TaskGet
  - AskUserQuestion
context: fork
agent: planner
---

You are now in planning mode. Your goal is to create a thorough implementation plan.

## Instructions

1. **Understand the Request**
   - Read CLAUDE.md for project conventions
   - Read relevant rules/ files for the domain
   - If the requirement is ambiguous, ask clarifying questions via AskUserQuestion

2. **Explore the Codebase**
   - Search for existing patterns similar to the requested feature
   - Identify all files that will need changes
   - Check existing tests for conventions and patterns
   - Look for reusable utilities, types, and components

3. **Design the Solution**
   - Propose an architecture with trade-off analysis
   - Identify dependencies between components
   - Plan the TDD approach: which tests to write first
   - Consider edge cases and error handling

4. **Create the Plan**
   - Use TaskCreate to build a sequenced implementation list
   - Each task should be small enough to complete in <50% context
   - Include test files in the sequence (RED before GREEN)
   - Note file paths for every change

5. **Output the Plan**
   - Analysis of what exists
   - Recommended approach with rationale
   - Step-by-step implementation tasks (phased)
   - Trade-off analysis for key decisions
   - Risks and mitigation strategies (with severity)
   - Success criteria checklist

6. **Wait for Confirmation**
   - End with: `**WAITING FOR CONFIRMATION**: Proceed? (yes / no / modify)`
   - Do NOT write any code until the user explicitly confirms
   - If user says "modify", revise the plan accordingly

## Arguments

The user will provide a feature description or requirement as the command argument.
