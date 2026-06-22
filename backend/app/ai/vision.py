import torch
from PIL import Image
from sentence_transformers import SentenceTransformer, util
import numpy as np
import os

class VisionManager:
    def __init__(self):
        # MODEL CLIP: Bisa mengerti Gambar dan Teks dalam satu ruang vektor
        self.model_name = 'clip-ViT-B-32'
        self.model = None
        self.load_model()


    # Tempat Menyimpan Embeding foto cth
    self.sample_embedings = None
    self.sample_labels()

def load_model(self):
        print(f"🔄 Loading Vistara Lens (CLIP Model): {self.model_name}...")
        self.model = SentenceTransformer(self.model_name)
        print("✅ Vistara Lens Model Ready!")

def encode_image(self, image_path_or_obj):
        """Mengubah gambar menjadi vektor angka"""
        img = Image.open(image_path_or_obj).convert('RGB')
        return self.model.encode(img)

def train_samples(self, base_path="dataset/vision_samples"):
        """Fungsi untuk memproses semua foto contoh yang kalian kumpulkan"""
        if not os.path.exists(base_path):
            print(f"⚠️ Folder {base_path} belum ada. Lewati indexing vision.")
            return

        all_embeddings = []
        labels = []
        
        # Loop setiap folder kategori (ulos_ragihotang, rumah_bolon, dll)
        for category in os.listdir(base_path):
            cat_path = os.path.join(base_path, category)
            if os.path.isdir(cat_path):
                for img_file in os.listdir(cat_path):
                    if img_file.endswith(('.jpg', '.png', '.jpeg')):
                        img_path = os.path.join(cat_path, img_file)
                        emb = self.encode_image(img_path)
                        all_embeddings.append(emb)
                        labels.append(category) # Label diambil dari nama folder
        
        if all_embeddings:
            self.sample_embeddings = torch.tensor(np.array(all_embeddings))
            self.sample_labels = labels
            print(f"✅ Vistara Lens berhasil mempelajari {len(labels)} foto contoh.")

async def identify(self, upload_file):
        """Membandingkan foto upload user dengan foto contoh di dataset"""
        if self.sample_embeddings is None:
            return {"error": "AI belum mempelajari foto contoh (dataset kosong)"}

        # 1. Encode foto yang diupload user
        query_emb = self.encode_image(upload_file)
        
        # 2. Hitung kemiripan (Cosine Similarity) dengan semua foto contoh
        hits = util.semantic_search(query_emb, self.sample_embeddings, top_k=1)[0]
        
        best_hit = hits[0]
        label = self.sample_labels[best_hit['corpus_id']]
        score = best_hit['score']

        return {
            "label": label.replace("_", " ").title(),
            "confidence": round(float(score), 4),
            "original_id": label
        }

vision_manager = VisionManager()