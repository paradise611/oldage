from crewai import LLM,Agent

llm = LLM(
    model="deepseek-chat",
    api_key="sk-f55e342ad4a744ddaf8460ca026d3bc1",
    base_url="https://api.deepseek.com"
)

print("LLM loaded successfully")
order_agent = Agent(
    role="Food Order Parser",
    goal="Extract restaurant name and food items from user speech",
    backstory="You understand food delivery requests",
    verbose=True,
    llm=llm
)