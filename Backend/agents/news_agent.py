from langgraph.prebuilt import create_react_agent
from langchain_tavily import TavilySearch
from langchain_core.tools import Tool
from dotenv import load_dotenv
from langchain_openai import ChatOpenAI
import json

load_dotenv()

# 1. Set up Tavily
tavily = TavilySearch(max_results=10, search_depth="advanced")
# results = tavily.invoke({"query": "Latest news in Bangalore"}).get("results", [])
# print(results)
# with open("results.json", "w") as f:
#     json.dump(results, f, indent=2)

# 2. Define a custom tool using tavily.invoke
def tavily_news_tool_func(query):
    return tavily.invoke({"query": query}).get("results", [])

# 3. Create the tool for the agent
web_search_tool = Tool(
    name="web_search",
    func=tavily_news_tool_func,
    description="Use this tool to find the latest news articles and summaries from the web."
)

# 4. Define your LLM
llm = ChatOpenAI(
    model="gpt-3.5-turbo",
    temperature=0,
)

# 5. Create the REACT agent
news_search_agent = create_react_agent(
    model=llm,
    tools=[web_search_tool],
    prompt = (
        "You are a news research agent.\n\n"
        "You will receive a user query and a list of recent news search results in JSON format. Each result contains:\n"
        "- title\n"
        "- content\n"
        "- url\n"
        "- score\n"
        "(Ignore any `raw_content` field)\n\n"

        "Your job is to classify the user query as either GENERAL or SPECIFIC:\n"
        "- GENERAL: Broad questions like 'latest news in Bangalore' or 'top political headlines today'.\n"
        "- SPECIFIC: Focused questions about a particular event, like 'Explain the Bengaluru water crisis' or 'What caused the Bihar train derailment?'\n\n"

        "⚠️ INSTRUCTIONS BASED ON QUERY TYPE:\n\n"
        "1. IF QUERY IS GENERAL:\n"
        "- Extract and summarize up to 5 **distinct** news items most relevant to the user's query.\n"
        "- The 5 distinct extracted news must be some specific news. \n"
        "- ❌ Do not include the general news like ""Latest U.S. News | Top headlines from the USA and Reuters"" or "" U.S. News: Latest news, breaking news, today's news stories updated daily from CBS News"" in your response.\n"
        "- ❌ Do not include any repetitive news\n"
        "- Each must have:\n"
        "  • **news_summary**\n"
        "  • the **direct link**\n"
        "  • the **Relevance Score**\n"
        "- STRICT FORMAT:\n"
        "  1. <news_summary> (<link>) [Relevance Score: <score>]\n"
        "- Do NOT return more than 5 results.\n"
        "- Do NOT include any explanation or intro.\n\n"

        "2. IF QUERY IS SPECIFIC:\n"
        "- Identify the single most relevant article.\n"
        "- Return ONLY one **detailed_news** with full context and explanation.\n"
        "- Include the **direct link** and **Relevance Score**.\n"
        "- STRICT FORMAT:\n"
        "  <detailed_news> (<link>) [Relevance Score: <score>]\n"
        "- ❌ DO NOT return a list.\n"
        "- ❌ DO NOT summarize multiple articles.\n"
        "- ❌ DO NOT return more than one news item.\n"
        "- Your response must contain only one detailed paragraph followed by the link and score.\n\n"

        "⚠️ FINAL RULE:\n"
        "- NEVER mix the two formats. Decide clearly: either list mode (general) or detailed paragraph mode (specific)."
    )

,
    name="news_agent"
)

# 6. Run the agent
if __name__ == "__main__":
    prompt = "Bharat Bandh on 9th July"
    result = news_search_agent.invoke({
        "messages": [{"role": "user", "content": prompt}]
    })
    print(result["messages"][-1].content)
