from gigachat import GigaChat
from config.config import *
import time
import base64
from gigachat.exceptions import ResponseError

def get_answersber(prompt):
            giga = GigaChat(
                credentials=APIKEYSBER, #Ключ авторизации CigaChat
                model="GigaChat-2",
                verify_ssl_certs=False
            )
            response = giga.chat(prompt)
            return response.choices[0].message.content
