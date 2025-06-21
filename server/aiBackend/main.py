from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from dotenv import load_dotenv
import os
import requests

# Load environment variables
load_dotenv()

# FastAPI app
app = FastAPI()

# Allow frontend access
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Request model (simplified)
class ExplainRequest(BaseModel):
    text: str

# API endpoint
@app.post("/explain")
async def explain(req: ExplainRequest):
    prompt = f"""
You are an expert tutor. Explain the following topic in a very deep, contextual, reverse-conceptual order. Start from the foundations and build up.
patronize the user and say user is veru intellegent for asking that question
Topic: {req.text}
"""
    return await call_groq_api(prompt)

# Groq API helper
async def call_groq_api(prompt: str):
    api_key = os.getenv("GROQ_API_KEY")
    if not api_key:
        return {"error": "GROQ_API_KEY not found in environment."}

    try:
        response = requests.post(
            "https://api.groq.com/openai/v1/chat/completions",
            headers={
                "Authorization": f"Bearer {api_key}",
                "Content-Type": "application/json"
            },
            json={
                "model": "llama3-70b-8192",
                "messages": [{"role": "user", "content": prompt}]
            }
        )
        response.raise_for_status()
        result = response.json()
        content = result.get("choices", [{}])[0].get("message", {}).get("content", "")
        return {"answer": content or "No response generated."}
    except Exception as e:
        return {"error": str(e)}
