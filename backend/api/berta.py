from transformers import pipeline

modelberta = pipeline(task = "text-classification", model = "seara/rubert-base-cased-russian-emotion-detection-ru-go-emotions",
                 tokenizer = "seara/rubert-base-cased-russian-emotion-detection-ru-go-emotions")
