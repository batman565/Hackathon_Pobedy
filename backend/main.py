import base64
from io import BytesIO
import os
import fastapi
from fastapi import Depends, HTTPException, File
from fastapi.responses import StreamingResponse
from pydantic import BaseModel
from requests import request
import requests
from api.kandinskiyapi import FusionBrainAPI
from api.sunoai import SunoAI
from config.config import APIKEYSUNO, api_key, secret_key
from api.berta import modelberta
from api.sberapi import get_answersber
from fastapi.middleware.cors import CORSMiddleware


prompt_text = "Ты создаешь художественные текста из воспоминаний участников Великой Отечественной Войны по эмоциям. Представь, что ты художественный писатель. Напиши по воспоминанию небольшой художественный текст. Ни в коем случае не искажай исторические факты. Выведи только название твоего текста и сам текст без форматирования!"
prompt_image = "Ты создаешь промпты для генерации военных изображений Великой Отечественной Войны из воспоминаний людей по эмоциям. Формат:Сцена + Настроение. Правила: 1) Историческая достоверность, фото может быть только связано с Великой Отечественной Войны. 2) Добавляй погоду/время суток 3) Описание сплошным текстом, 2-3 предложения максимум (САМОЕ ГЛАВНОЕ ОГРАНИЧЕНИЕ) 4) Никакой жесткости и агрессии, 18+ запрещено!. Выведи только ОДИН промпт."
prompt_music = "Ты создаешь промпты для генерации музыки из воспоминаний участников Великой Отечественной Войны по эмоциям. Выведи только подходящие тэги максимум 200 символов, кратко описывающие какая должна быть музыка."
app = fastapi.FastAPI()
imageapi = FusionBrainAPI('https://api-key.fusionbrain.ai/', api_key, secret_key)
musicai = SunoAI(APIKEY=APIKEYSUNO)

class TextRequest(BaseModel):
    prompt: str

app.add_middleware(CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],)

@app.post("/api/generate/image")
async def generate_image(request: TextRequest):
    resp = modelberta(request.prompt, top_k = 5)
    response = get_answersber(prompt = str(resp) + " " + prompt_image + " " + request.prompt)

    if len(response) >= 800:
        response = response[:799]
    print(response)
    pipeline_id = imageapi.get_pipeline()
    uuid = imageapi.generate(response, pipeline_id)
    file = imageapi.check_generation(uuid)
    image_bytes = base64.b64decode(file)
    return StreamingResponse(
            BytesIO(image_bytes),
            media_type="image/png",
            headers={"Content-Disposition": "attachment; filename=generated_image.png"}
        )


@app.post("/api/generate/text")
async def generate_text(request: TextRequest):
    print(request.prompt)
    resp = modelberta(request.prompt, top_k = 5)
    response = get_answersber(prompt = str(resp) + " " + prompt_text + " " + request.prompt)
    return response


@app.post("/api/generate/music")
async def generate_music(request: TextRequest):
    resp = modelberta(request.prompt, top_k = 5)
    response = get_answersber(prompt = str(resp) + " " + prompt_music + " " + request.prompt)
    print(response)
    response = response[:199]
    respon = musicai.generate(response)
    return musicai.check_generation(respon["request_id"])