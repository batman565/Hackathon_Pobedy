import time
import requests


class SunoAI:
    def __init__(self, APIKEY):
        self.APIKEY = APIKEY
        self.url = "https://api.gen-api.ru/api/v1/networks/suno"
        self.headers = {'Content-Type': 'application/json',
                        'Accept': 'application/json',
                        'Authorization': f'Bearer {self.APIKEY}'} # Ключ от API https://gen-api.ru/model/suno/api
        
    def generate(self, prompt):
        data = {"title": "Великая отечественная война",
                "tags": prompt}
        response = requests.post(self.url, headers=self.headers, json=data)
        return response.json()
    
    def check_generation(self, request_id):
        flag = True
        while flag == True:
            response = requests.get(f"https://api.gen-api.ru/api/v1/request/get/{request_id}", headers=self.headers, json={"translate_input": False})
            print(f" суно апи выдало ответ: {response.json()}")
            if 'result' in response.json():
                flag = False
                res = []
                res.append(response.json()["result"][0])
                res.append(response.json()['result'][1])
                return res
        time.sleep(15)