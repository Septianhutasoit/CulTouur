from transformers import pipeline
import torch

class SentimentAnalyzer:
    def __init__(self):
        self.model_name = "nlptown/bert-base-multilingual-uncased-sentiment"
        self.analyzer = None
        self.load_model()

    def load_model(self):
        print(f"🔄 Loading Sentiment AI: {self.model_name}...")
        try:
            # Gunakan pipeline sentiment-analysis yang sudah optimal
            self.analyzer = pipeline(
                "sentiment-analysis", 
                model=self.model_name,
                device=-1 # Paksa gunakan CPU untuk menghemat RAM laptop
            )
            print("✅ Sentiment AI Ready!")
        except Exception as e:
            print(f"❌ Gagal load Sentiment AI: {e}")

    def get_score(self, text: str) -> float:
        """
        Mengubah output model (1-5 stars) menjadi skor -1.0 s/d 1.0
        """
        if not self.analyzer:
            return 0.0
            
        try:
            result = self.analyzer(text[:512])[0] # Maksimal 512 karakter
            label = result['label'] # Contoh: "1 star" atau "5 stars"
            
            # Konversi label ke angka -1.0 s/d 1.0
            star_map = {
                "1 star": -1.0,
                "2 stars": -0.5,
                "3 stars": 0.0,
                "4 stars": 0.5,
                "5 stars": 1.0
            }
            return star_map.get(label, 0.0)
        except Exception:
            return 0.0

sentiment_ai = SentimentAnalyzer()