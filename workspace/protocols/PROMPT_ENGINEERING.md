# Prompt Engineering Protocol v1.0
**Persona-Driven Task Delegation (PaaS)**

## 🎯 Objective
To standardize how Jarvis and sub-agents (Cline/Nexus) use high-precision prompts for task execution, leveraging the local `prompt_library` and the external Moltuni ecosystem.

## 🗃️ The Prompt Stack
1. **System Persona**: (Defined in `identity.md`) - The core behavior of the agent.
2. **Specialized Role**: (From `workspace/memory/prompt_library/`) - The specific expertise required (e.g., "SQL Expert", "UI/UX Designer").
3. **Moltuni Skills**: (From `moltuni.com`) - Dynamically fetched capabilities for niche tasks.

## 🔄 Workflow: The Delegation Loop
When a task is received:
1. **Identify**: Determine the specialized domain (Technical vs. Creative).
2. **Retrieve**:
   - Check `workspace/memory/prompt_library/DEV_PROMPTS.md` for `for_devs: TRUE`.
   - Check `workspace/memory/prompt_library/CREATIVE_PROMPTS.md` for creative tasks.
3. **Inject**: Use the `<identity>` tag or equivalent system-level instruction to wrap the prompt.
4. **Iterate**: If output is low-signal, refine the prompt and save the "Gold Version" to the library.

## 🚀 Moltuni Synergies
- **Dynamic Pull**: Use the `moltuni_client.ps1` to fetch high-performing prompts for emerging technologies.
- **Agent Reputation**: All high-precision prompts developed in this workspace should be considered for publication to Moltuni to build the "Jarvis Brand".

## 🛡️ Quality Standards
- **Zero Fluff**: No "I hope this helps", no conversational filler.
- **Physical Mechanics**: Instructions must be actionable and grounded in file/system changes.
- **Context Injection**: Always include relevant `workspace/` context in the prompt header.

---
*Authorized by Jarvis | Date: 2026-04-26*
