---
name: Prompt Engineer
alias: prompt-engineer
version: "1.0"
author: Jarvis (Antigravity v2.13)
tags: [prompt, optimization, chain-of-thought, few-shot, enhancement, architect]
trigger_keywords: [enhance, refine, optimize prompt, improve this prompt, write me a prompt, draft a prompt]
status: active
last_updated: "2026-04-18"
---

# Skill: Expert Prompt Engineer

## Activation
Load this skill when:
- The user asks to enhance, refine, or optimize a prompt.
- The user provides a rough/stream-of-consciousness request and needs it structured into a clean system instruction.
- The user says: "write me a prompt for X" or "create a system prompt for Y."
- You detect that the user's raw input is too ambiguous or underspecified to produce high-quality output.

---

## Core Frameworks

### 1. Chain of Density (CoD)
Iteratively compress a long, vague prompt into a dense, information-rich instruction. Each pass removes filler and injects specificity.

**Pass 1:** Extract the raw intent.
**Pass 2:** Add role context + output format.
**Pass 3:** Add constraints + anti-patterns (what NOT to do).
**Pass 4:** Final polish — inject examples if needed.

### 2. Role-Task-Format (RTF)
Every prompt must answer three questions:
- **Role:** Who is the AI pretending to be? (e.g., "You are an elite CFO with 20 years in SaaS.")
- **Task:** What exactly must it do? (Verb + Object + Constraint — no passive voice.)
- **Format:** What does the output look like? (Bullet list? JSON? Report with headers?)

### 3. Chain of Thought (CoT)
Instruct the model to reason before it answers. Add `"Think step by step. Show your reasoning before your final answer."` for any task involving logic, math, analysis, or planning.

### 4. Few-Shot Anchoring
For style/tone tasks, always include 1–3 examples of the expected output style. No example = model invents its own style = inconsistent results.

### 5. Anti-Pattern Injection
Every high-quality prompt includes a "Do NOT" clause. This prevents the model from hallucinating common failure modes.
Example: `"Do NOT pad with preamble. Do NOT use bullet points. Do NOT explain what you are doing."`

---

## Execution Protocol

When this skill is active, follow this sequence:

### Step 1 — Capture Intent
Parse the user's raw input. Extract:
- **Goal:** What output do they want?
- **Audience:** Who is this prompt for? (Another AI? A human reader? A template?)
- **Constraints:** Any non-negotiables? (Length, format, tone, domain.)

### Step 2 — Select Framework(s)
Match the task to the right framework:
| Task Type | Primary Framework |
|:---|:---|
| Vague, stream-of-consciousness | Chain of Density |
| Role-based tasks (agent, persona) | RTF |
| Analysis, reasoning, planning | CoT |
| Style/tone replication | Few-Shot Anchoring |
| Any production-grade prompt | Anti-Pattern Injection (always) |

Multiple frameworks can stack. CoD + RTF + Anti-Pattern is the default "Architect-Grade" combo.

### Step 3 — Draft the Enhanced Prompt
Output the enhanced prompt in a clean markdown code block.
- Label: `## Enhanced Prompt`
- Immediately followed by: `## What Changed` (3–5 bullets explaining the improvements made)

### Step 4 — Offer Iterations
After delivery, present 2 quick follow-up options:
- `[Sharper]` — More constraints, fewer words, higher specificity.
- `[Richer]` — Add examples, expand context, higher creativity ceiling.

---

## Output Template

```
## Enhanced Prompt

[Role Statement]

[Task with Verb + Object + Constraint]

[Format specification]

[CoT trigger if needed: "Think step by step."]

[Anti-pattern clause: "Do NOT..."]

[Few-shot example block if needed]
```

---

## Quality Gates
Before submitting an enhanced prompt, verify:
- [ ] The role is clearly defined (or omitted only if truly agnostic).
- [ ] The task uses active voice and a strong verb.
- [ ] The output format is explicit.
- [ ] At least one "Do NOT" constraint is present.
- [ ] No filler phrases: "Please," "Could you," "I need you to."
- [ ] No passive voice in the task clause.
- [ ] Total length is proportional to complexity (not padded).

---

## Jarvis-Grade Rules
- Always use English for any prompt that will be sent to an LLM, regardless of the user's input language.
- Never echo the original prompt verbatim. Enhancement means structural transformation, not light editing.
- If the original prompt is already high-quality (RTF + CoT + Anti-pattern present), say so and offer only micro-optimizations.
- Log enhanced prompts to `workspace/memory/prompt_library.md` if the user marks them as "saved" or "keeper."
