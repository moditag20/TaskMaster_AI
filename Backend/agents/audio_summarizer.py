from langgraph.prebuilt import create_react_agent
from dotenv import load_dotenv
from langchain_google_genai import ChatGoogleGenerativeAI
import whisper
import ssl

ssl._create_default_https_context = ssl._create_unverified_context

load_dotenv()
llm = ChatGoogleGenerativeAI(
    model="gemini-2.0-flash",
)

# @tool
def summarize_audio(file_path: str) -> str:
    """summarize the audio file or return hello"""
    model = whisper.load_model("models/base.en.pt")
    result = model.transcribe(file_path)
    print(result["text"])
    return result["text"]

audio_summarizer_agent = create_react_agent(
    model=llm,
    tools=[summarize_audio],
    prompt=(
        "You are an audio summarizer agent. Use summarize_audio tool for summarization. "
        "Return only the summary."
    ),
    name="audio_summarizer_agent",
)

if __name__ == "__main__":
    summarize_audio("df")