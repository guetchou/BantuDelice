from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI()

# Autoriser le frontend (à restreindre en prod)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.post("/chat")
async def chat(request: Request):
    data = await request.json()
    user_message = data.get("message", "")
    # Logique FAQ/IA à améliorer ici
    if "horaire" in user_message.lower():
        return {"response": "Nous sommes ouverts de 8h à 20h, 7j/7."}
    return {"response": f"Vous avez dit : {user_message}"} 