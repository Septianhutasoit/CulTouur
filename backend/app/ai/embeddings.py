from sentence_transformers import SentenceTransformer
from app.core.config import settings
import numpy as np
from typing import List

class EmbeddingManager:
    def __init__(self):
        self.model = None
        self.load_model()
    
    def load_model(self):
        """Load Sentence Transformer model"""
        print(f"Loading model: {settings.MODEL_NAME}")
        self.model = SentenceTransformer(settings.MODEL_NAME)
        print("Model loaded successfully!")
    
    def encode(self, texts: List[str]) -> np.ndarray:
        """Generate embeddings for texts"""
        if not self.model:
            raise ValueError("Model not loaded")
        return self.model.encode(texts)
    
    def encode_destination(self, destination) -> np.ndarray:
        """Generate embedding for a destination"""
        text = f"{destination.name} {destination.description} {destination.category} {destination.location}"
        return self.encode([text])[0]