from crewai import Crew
from tasks import order_task
from voice import speech_to_text
from browser import search_restaurant
from browser import open_meituan
import json

# 1 语音识别
text = speech_to_text("audio/voice1.m4a")

print("识别语音:", text)

# 2 CrewAI解析订单
crew = Crew(
    agents=[order_task.agent],
    tasks=[order_task],
    verbose=True
)

result = crew.kickoff(inputs={"text": text})

print("AI解析结果:", result)

# 3 解析JSON
try:

    order = json.loads(result)

    intent = order["intent"]

    if intent == "open_app":

        open_meituan()

    elif intent == "order_food":

        restaurant = order["restaurant"]

        search_restaurant(restaurant)

except:

    print("解析失败")