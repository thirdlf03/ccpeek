---
name: notebooklm-query
description: "Access NotebookLM to ask questions and retrieve information. Specify a NotebookLM URL and query."
argument-hint: "<NotebookLM URL> <question or research topic>"
allowed-tools:
  - mcp__claude-in-chrome__tabs_context_mcp
  - mcp__claude-in-chrome__tabs_create_mcp
  - mcp__claude-in-chrome__navigate
  - mcp__claude-in-chrome__computer
  - mcp__claude-in-chrome__read_page
  - mcp__claude-in-chrome__find
  - mcp__claude-in-chrome__form_input
  - mcp__claude-in-chrome__javascript_tool
  - mcp__claude-in-chrome__get_page_text
  - Read
  - Glob
  - Grep
  - AskUserQuestion
---

Access a NotebookLM notebook, ask questions via chat, and retrieve information.

## Input

The user provides:
- **NotebookLM URL** (e.g., `https://notebooklm.google.com/notebook/xxxx`)
- **Question or research topic** (one or more)

If arguments are missing, use AskUserQuestion to clarify.

## Instructions

### Step 1: Get Browser Context

1. Use `tabs_context_mcp` to get tab info
2. If the specified URL is already open in a tab, use that tab
3. Otherwise, use `tabs_create_mcp` to create a new tab and `navigate` to the URL
4. Wait 5-10 seconds for the page to fully load

### Step 2: Verify Page Readiness

1. Take a `screenshot` to check the page state
2. Confirm the NotebookLM chat input field is visible
3. If login is required, notify the user and wait

### Step 3: Send Question

Craft an effective question from the user's research topic and send it to NotebookLM.

1. Use `find` to locate the chat input field
2. Use `form_input` to type the question text
3. Use `find` to locate the "Send" button and click the one near the chat input
   - Note: There may be multiple send buttons (source search and chat). Use the one closest to the chat input.
4. Wait 15-25 seconds (response generation takes time)

### Step 4: Retrieve Response

1. Take a `screenshot` to confirm the response is displayed
2. Use `javascript_tool` to extract the response text:
   ```javascript
   const chatArea = document.querySelector('[role="log"], [class*="chat"], [class*="conversation"]');
   if (chatArea) {
     const text = chatArea.innerText;
     const lastQ = text.lastIndexOf('<partial question text>');
     if (lastQ >= 0) text.substring(lastQ, lastQ + 5000);
   }
   ```
3. For long responses, adjust offset and retrieve in multiple passes
4. If an expand button (▼) appears at the end of the response, click it before re-extracting

### Step 5: Follow-up Questions (if needed)

- For broad research topics, send follow-up questions based on initial responses
- Repeat Steps 3-4
- Maximum 5 questions per skill execution

### Step 6: Organize Results

Present the retrieved information in this format:

```
## NotebookLM Research Results

### Source
- Notebook: [Title](URL)
- Sources: N items

### Q1: <question>
<response summary>

### Q2: <question>
<response summary>

### Key Takeaways
- Point 1
- Point 2
- ...
```

## Tips

- NotebookLM responses can be long; use `javascript_tool` with varying offsets for multiple retrieval passes
- Extract code examples and JSON accurately
- If NotebookLM is still generating (loading indicator), add extra wait time
- If chat history is long, the input field may scroll off-screen; scroll down before interacting

## Error Handling

- **Tab closed**: Re-fetch with `tabs_context_mcp` and re-access in a new tab
- **Login required**: Ask the user to log in manually, then resume
- **No response generated**: Wait an additional 15 seconds; if still empty, retry submission (max 2 retries)
- **Send button not found**: Use `read_page` to list interactive elements and identify the button
