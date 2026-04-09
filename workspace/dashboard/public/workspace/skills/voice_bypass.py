import keyboard
import sounddevice as sd
import numpy as np
import whisper
import pyperclip
import pyautogui
import tempfile
import soundfile as sf
import os
import time
import sys

# Configuration
HOTKEY = 'left ctrl'  # Hold Left Ctrl to record, release to transcribe
SAMPLE_RATE = 16000
MODEL_SIZE = "base"

print(f"[JARVIS] Loading local Whisper ({MODEL_SIZE}) model in the background. Standby...")
import warnings
warnings.filterwarnings("ignore")
model = whisper.load_model(MODEL_SIZE)
print(f"[JARVIS] Armed and operational. Hold [{HOTKEY.upper()}] to dictate. Release to inject text.")

is_recording = False
audio_data = []

def callback(indata, frames, time, status):
    if is_recording:
        audio_data.append(indata.copy())

def start_recording(e):
    global is_recording, audio_data
    if not is_recording:
        is_recording = True
        audio_data = []
        print("[JARVIS] Listening...", end="\r")

def stop_recording(e):
    global is_recording, audio_data
    if is_recording:
        is_recording = False
        print("[JARVIS] Transcribing...          ", end="\r")
        
        if len(audio_data) == 0:
            return

        # Flatten audio data and ensure 1D float32 for Whisper
        recording = np.concatenate(audio_data, axis=0).flatten().astype(np.float32)
        peak_volume = np.max(np.abs(recording))
        print(f"[JARVIS] Peak volume detected: {peak_volume:.4f} (If 0.0000, mic is dead/wrong default)")
        
        try:
            # Transcribe directly from RAM (Bypasses FFmpeg requirement)
            result = model.transcribe(recording, fp16=False)
            text = result['text'].strip()
            
            if text:
                print(f"[JARVIS] Injected: {text}")
                # Save current clipboard
                old_clipboard = pyperclip.paste()
                
                # Copy new text and paste it via simulated keystroke
                pyperclip.copy(text)
                time.sleep(0.1)
                pyautogui.hotkey('ctrl', 'v')
                time.sleep(0.1)
                
                # Restore clipboard
                pyperclip.copy(old_clipboard)
            else:
                print("[JARVIS] No audible dictation detected.")
        finally:
            print(f"[JARVIS] Armed. Hold [{HOTKEY.upper()}] to dictate.   ")

# Set up audio stream (Forcing Device 1: Realtek High Definition Mic Array based on query diagnostics)
stream = sd.InputStream(device=1, samplerate=SAMPLE_RATE, channels=1, callback=callback)
stream.start()

# Bind hotkeys
keyboard.on_press_key(HOTKEY, start_recording)
keyboard.on_release_key(HOTKEY, stop_recording)

try:
    keyboard.wait()
except KeyboardInterrupt:
    print("\n[JARVIS] Shutting down.")
    stream.stop()
    stream.close()
    sys.exit(0)
