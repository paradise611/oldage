from crewai import Task
from agent import order_agent

order_task = Task(
    description="""
Understand the user's intention from the sentence:

{text}

Return JSON format:

{
 "intent": "",
 "platform": "",
 "restaurant": "",
 "items": []
}

intent can be:
- open_app
- order_food
""",
    agent=order_agent,
    expected_output="JSON result"
)