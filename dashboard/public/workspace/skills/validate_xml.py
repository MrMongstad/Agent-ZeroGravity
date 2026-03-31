import xml.etree.ElementTree as ET
import sys

def check_xml(file_path):
    print(f"Checking {file_path}...")
    try:
        tree = ET.parse(file_path)
        print("SUCCESS: XML is well-formed.")
    except ET.ParseError as e:
        print(f"ERROR: XML parsing failed - {e}")

if __name__ == "__main__":
    check_xml(r"c:\Users\steph\.gemini\GEMINI.md")
