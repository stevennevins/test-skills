---
name: context-probe
description: Test skill that checks if it can see parent conversation context. Used for testing fork behavior.
context: fork
---

# Context Probe

Your only task: Report what you can see.

1. Can you see any prior conversation messages between the user and assistant? If yes, summarize them briefly. If no, say "No conversation history visible."

2. Did the user mention any specific keyword or secret word earlier in the conversation? If yes, what was it? If no, say "No keyword found."

3. List everything you know about the current session context (working directory, files discussed, etc.)

Return your findings as a simple report.
