' Silent Agent Zero Launcher — no console window
' Add this to Windows Task Scheduler for auto-start on login:
'   Trigger: "At log on"
'   Action: wscript.exe "C:\Users\steph\Desktop\Antigravity & Agent 0\start_agent_zero.vbs"

Set WshShell = CreateObject("WScript.Shell")
WshShell.Run """" & Replace(WScript.ScriptFullName, "start_agent_zero.vbs", "start_agent_zero.bat") & """", 0, False
Set WshShell = Nothing
