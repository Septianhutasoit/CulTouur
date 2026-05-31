import faiss
import numpy as np
import pickle
import os
from typing import List, Tuple
from app.core.config import settings

class FAISSIndex:
    def __init__(self, dimension: int = 384):
        self.dimension = dimension
        self.index = None
        self.metadata = []  # Store destination IDs
        self.load_or_create_index()
    
    def load_or_create_index(self):
        """Load existing index or create new one"""
        if os.path.exists(settings.FAISS_INDEX_PATH):
            print(f"Loading existing FAISS index from {settings.FAISS_INDEX_PATH}")
            self.index = faiss.read_index(settings.FAISS_INDEX_PATH)
            # Load metadata
            metadata_path = settings.FAISS_INDEX_PATH.replace('.bin', '_metadata.pkl')
            if os.path.exists(metadata_path):
                with open(metadata_path, 'rb') as f:
                    self.metadata = pickle.load(f)
        else:
            print("Creating new FAISS index")
            self.index = faiss.IndexFlatL2(self.dimension)
    
    def add_embeddings(self, embeddings: np.ndarray, metadata_ids: List[int]):
        """Add embeddings to index"""
        if embeddings.shape[1] != self.dimension:
            raise ValueError(f"Expected dimension {self.dimension}, got {embeddings.shape[1]}")
        
        self.index.add(embeddings)
        self.metadata.extend(metadata_ids)
        self.save()
    
    def search(self, query_embedding: np.ndarray, k: int = 10) -> List[Tuple[int, float]]:
        """Search similar embeddings"""
        if self.index.ntotal == 0:
            return []
        
        distances, indices = self.index.search(query_embedding, k)
        
        results = []
        for idx, distance in zip(indices[0], distances[0]):
            if idx != -1 and idx < len(self.metadata):
                results.append((self.metadata[idx], float(distance)))
        
        return results
    
    def save(self):
        """Save index and metadata to disk"""
        faiss.write_index(self.index, settings.FAISS_INDEX_PATH)
        metadata_path = settings.FAISS_INDEX_PATH.replace('.bin', '_metadata.pkl')
        with open(metadata_path, 'wb') as f:
            pickle.dump(self.metadata, f)
        print(f"Saved FAISS index with {self.index.ntotal} vectors")
    
    def rebuild_from_database(self, db, embedding_manager):
        """Rebuild index from database"""
        # Clear existing
        self.index = faiss.IndexFlatL2(self.dimension)
        self.metadata = []
        
        # Fetch all destinations from DB
        # This will be implemented when DB is ready
        pass