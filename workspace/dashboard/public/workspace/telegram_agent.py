import os
import sys
import json
import asyncio
import aiofiles
import nest_asyncio
from dotenv import load_dotenv
from telegram import Update
from telegram.ext import ApplicationBuilder, CommandHandler, MessageHandler, filters, ContextTypes
from google import genai
from google.genai import types

# 1. Enforce Unified Workspace - Mount root .env and Memory Bus
workspace_root = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
env_path = os.path.join(workspace_root, ".env")
bus_path = os.path.join(workspace_root, "workspace", "gag_bus.json")
load_dotenv(dotenv_path=env_path)

# 2. Extract Keys
TELEGRAM_TOKEN = os.environ.get("TELEGRAM_BOT_TOKEN")
GEMINI_API_KEY = os.environ.get("GEMINI_API_KEY")

if not TELEGRAM_TOKEN or TELEGRAM_TOKEN == "YOUR_BOTFATHER_TOKEN_HERE":
    print("CRITICAL PAUSE: TELEGRAM_BOT_TOKEN is missing or invalid in the root .env.")
    sys.exit(1)

if not GEMINI_API_KEY:
    print("CRITICAL PAUSE: GEMINI_API_KEY is missing in the root .env.")
    sys.exit(1)

# 3. Initialize AI Client 
os.environ.pop("GOOGLE_API_KEY", None)
ai_client = genai.Client(api_key=GEMINI_API_KEY)
AI_MODEL = "gemini-2.5-flash"

nest_asyncio.apply()

# --- BUS MUTATORS ---

async def push_to_jarvis_bus(message: str, username: str):
    """Write an incoming task to the JSON Memory Bus."""
    try:
        async with aiofiles.open(bus_path, mode='r', encoding='utf-8') as f:
            data = json.loads(await f.read())
            
        data.setdefault("telegram_to_jarvis", []).append({
            "sender": username,
            "task": message,
            "status": "pending"
        })
        
        async with aiofiles.open(bus_path, mode='w', encoding='utf-8') as f:
            await f.write(json.dumps(data, indent=2))
        return True
    except Exception as e:
        print(f"Bus Error: {e}")
        return False

async def poll_jarvis_outbox(context: ContextTypes.DEFAULT_TYPE):
    """Background Daemon: Scans gag_bus.json every 5 seconds for messages from Jarvis to the Phone."""
    chat_id = context.job.chat_id
    while True:
        try:
            async with aiofiles.open(bus_path, mode='r', encoding='utf-8') as f:
                data = json.loads(await f.read())
            
            # If Jarvis wrote something to me
            if data.get("jarvis_to_telegram", []):
                outbox = data["jarvis_to_telegram"]
                for msg in outbox:
                    if msg.get("status") == "pending_transmission":
                        await context.bot.send_message(chat_id=chat_id, text=f"🤖 [JARVIS UPLINK]: {msg['payload']}")
                        msg["status"] = "delivered"
                
                # Overwrite and clear pending status
                async with aiofiles.open(bus_path, mode='w', encoding='utf-8') as f:
                    await f.write(json.dumps(data, indent=2))

        except Exception as e:
            pass # Suppress read collision errors during simultaneous IDE/Bot I/O

        await asyncio.sleep(5) # Poll every 5 seconds

# --- TELEGRAM HANDLERS ---

async def start(update: Update, context: ContextTypes.DEFAULT_TYPE) -> None:
    """Boot sequence triggered by /start"""
    print(f"[{update.effective_user.username}] Initialized the uplink.")
    await update.message.reply_text("Antigravity Unified Workspace Uplink Active.\n\nType normally to talk to Gemini.\nType /jarvis [task] to send a command to the IDE Agent.")
    
    # Start the daemon polling the memory bus for this user
    context.job_queue.run_once(poll_jarvis_outbox, 1, chat_id=update.effective_chat.id)

async def jarvis_intercept(update: Update, context: ContextTypes.DEFAULT_TYPE) -> None:
    """Intercepts /jarvis commands and pushes them to the local IDE Memory Bus instead of native Gemini."""
    if not context.args:
        await update.message.reply_text("Usage: /jarvis [task description]")
        return
        
    task_payload = " ".join(context.args)
    username = update.effective_user.username
    
    print(f"[Intercepted Task -> Jarvis]: {task_payload}")
    success = await push_to_jarvis_bus(task_payload, username)
    
    if success:
        await update.message.reply_text(f"📥 Task routed to Jarvis Memory Bus. The IDE will process this on the next cycle.")
    else:
        await update.message.reply_text(f"⚠️ Failed to write to Workspace Bus.")

async def handle_message(update: Update, context: ContextTypes.DEFAULT_TYPE) -> None:
    """Process standard text and pipe to native Gemini."""
    user_input = update.message.text
    username = update.effective_user.username
    print(f"[{username}] >> {user_input}")
    
    await context.bot.send_chat_action(chat_id=update.effective_chat.id, action='typing')
    
    try:
        response = ai_client.models.generate_content(
            model=AI_MODEL,
            contents=user_input,
            config=types.GenerateContentConfig()
        )
        reply_text = response.text if response.text else "Null output from the model."
    except Exception as e:
        reply_text = f"⚠️ Inference failure: {str(e)}"
        
    print(f"[Gemini] << {reply_text[:50]}...")
    await update.message.reply_text(reply_text)

def main() -> None:
    """Launch the autonomous asynchronous loop."""
    print("Starting Antigravity Telegram Node (with IDE Memory Bus)...")
    app = ApplicationBuilder().token(TELEGRAM_TOKEN).build()

    app.add_handler(CommandHandler("start", start))
    app.add_handler(CommandHandler("jarvis", jarvis_intercept)) # The IDE bridge
    app.add_handler(MessageHandler(filters.TEXT & ~filters.COMMAND, handle_message)) # Native LLM
    
    print("Listening for incoming streams on Telegram...")
    app.run_polling()

if __name__ == "__main__":
    main()
