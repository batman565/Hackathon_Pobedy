# Проект: Генератор художественных произведений ВОВ.

---

## 🛠 Технологии

- **Фронтенд**: Vite + React.js
- **Бэкенд**: FastAPI (Python)
- **Используемые API**:
  - [GigaChat](https://developers.sber.ru/docs/ru/gigachat/api/integration) (Сбер)
  - [Kandinsky](https://fusionbrain.ai)
  - [Gen-API](https://gen-api.ru/model/suno/api/)

---

## ⚙️ Предварительные требования

1. Установите:
   - Node.js ≥ 18.x
   - Python ≥ 3.10
2. Аккаунты и доступы:
   - [GigaChat API Key](https://developers.sber.ru)
   - [Kandinsky API Key](https://fusionbrain.ai/)
   - [Gen-API Key](https://gen-api.ru/model/suno/api/)

---

## 🚀 Установка

### 1. Клонируйте репозиторий

```bash
git clone https://github.com/batman565/Hackathon_Pobedy/
cd Hackathon_Pobedy
```

### 2. Установите зависимости из файла backend/requirements.txt

```bash
cd backend
pip install -r requirements.txt
```

### 3. Установить зависимости для frontend

```bash
cd frontend
npm install
```

### 4. Запустить сервер backend

```bash
cd backend
uvicorn main:app --host 127.0.0.1 --port 5000 --reload
```

### 5. Запустить сервер frontend

```bash
cd frontend
npm run dev -- --host 0.0.0.0 --port 3000
```

Перейдите в браузере на сайт по URL: http://localhost:3000/
