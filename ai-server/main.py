from fastapi import FastAPI
from pydantic import BaseModel
from transformers import pipeline

app = FastAPI()

generator = pipeline(
    "text-generation",
    model="distilgpt2"
)

class Message(BaseModel):
    text: str

@app.post("/suggest-reply")
def suggest_reply(data: Message):

    prompt = f"""
    User message: {data.text}

    Generate a short casual reply:
    """

    result = generator(
        prompt,
        max_length=50,
        num_return_sequences=3,
        truncation=True
    )

    replies = []

    for item in result:

        generated = (
            item["generated_text"]
            .replace(prompt, "")
            .strip()
        )

        if generated not in replies:
            replies.append(generated)

    return {
        "suggestions": replies
    }