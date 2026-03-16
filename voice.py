
import os

os.environ["PATH"] += os.pathsep + r"D:\goole_download\ffmpeg-master-latest-win64-gpl\bin"

import whisper

model = whisper.load_model("base")

def speech_to_text(audio_path):

    result = model.transcribe(audio_path)

    return result["text"]