import { NextResponse } from 'next/server';
import fs from 'fs/promises';
import path from 'path';

export async function GET() {
  try {
    const rootPath = path.resolve(process.cwd(), '..'); // Assuming dashboard is in a subfolder of root
    const statePath = path.join(rootPath, 'workspace', 'state.json');
    const busPath = path.join(rootPath, 'workspace', 'gag_bus.json');

    const stateData = JSON.parse(await fs.readFile(statePath, 'utf8'));
    const busData = JSON.parse(await fs.readFile(busPath, 'utf8'));

    // Integrate Claude-Code Status
    const normalizedTasks = [
      { 
        id: "1", 
        agent: "Jarvis", 
        task: stateData.current_task || "Building EmpireHQ", 
        status: stateData.agent_status.jarvis === 'busy' ? 'Active' : 'Standby' 
      },
      { 
        id: "2", 
        agent: "Claude", 
        task: "Sub-Agent Interface Handshake", 
        status: "Active" 
      },
      { 
        id: "3", 
        agent: "Cline", 
        task: "Polling for commands", 
        status: stateData.agent_status.cline === 'busy' ? 'Active' : 'Standby' 
      }
    ];

    // Mock burn rates as per plan requirements
    const burnRates = {
      anthropic: 82, // Claude-Code usage
      google: 15,
      openai: 38,
      total_24h: "$18.75"
    };

    return NextResponse.json({
      tasks_24h: 142,
      cost_24h: "$18.75",
      nexus_sync: 99.8,
      chain_of_thought: [
        "Analyzing Obsidian Pivot deployment...",
        "Validating Material Depth [25px blur]",
        "Verifying Neural Bus integrity: OK",
        "Claude-Code handshake: COMPLETE"
      ],
      morning_report: {
        summary: "# Executive Intelligence: EmpireHQ Obsidian\n- **Design Pivot**: Obsidian & Holographic Material implemented.\n- **Claude-Code**: Active & optimized for vortex operations.\n- **Neural Nexus**: Sync integrity at 99.8%. No latency detected.",
        insights: [
          "Cross-agent coordination peaking",
          "Workspace index needs refresh",
          "Mercury 2.0 Floating UI active"
        ]
      },
      tasks: normalizedTasks,
      burn_rates: burnRates,
      mcp_status: [
        { name: "GitKraken", status: 'online' },
        { name: "StitchMCP", status: 'online' },
        { name: "Supabase", status: 'online' },
        { name: "GitHub", status: 'online' },
        { name: "Memory", status: 'online' },
        { name: "Chrome", status: 'online' },
      ],
      system_logs: [
        { timestamp: "01:25:22", message: "Obsidian Pivot initialized", type: "info" },
        { timestamp: "01:26:01", message: "Material Depth [25px] Blur: OK", type: "info" },
        { timestamp: "01:27:44", message: "Nexus Core online at 100%", type: "info" },
        { timestamp: "01:30:15", message: "REBOOTING: EmpireHQ Obsidian Edition", type: "warn" },
      ]
    });
  } catch (error) {
    console.error("State Fetch Error:", error);
    return NextResponse.json({ error: "Failed to sync system state" }, { status: 500 });
  }
}
