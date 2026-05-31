<div align="center">
  
  <img src="https://readme-typing-svg.demolab.com?font=Plus+Jakarta+Sans&weight=700&size=40&duration=3000&pause=500&color=2D6A4F&center=true&vCenter=true&random=false&width=500&height=70&lines=CulTour;AI+Cultural+Tourism+Assistant" alt="CulTour Title" />
  
  <p align="center">
    <strong>🤖 Chatbot Cerdas Berbasis NLP untuk Rekomendasi Personal Wisata Budaya Danau Toba</strong>
  </p>

  <p align="center">
    <a href="#✨-features">Features</a> •
    <a href="#🏗️-tech-stack">Tech Stack</a> •
    <a href="#🚀-quick-start">Quick Start</a> •
    <a href="#📁-project-structure">Structure</a> •
    <a href="#🔧-api-endpoints">API</a> •
    <a href="#👥-team">Team</a>
  </p>

  <p align="center">
    <img src="https://img.shields.io/badge/Python-3.10+-3776AB?style=for-the-badge&logo=python&logoColor=white" />
    <img src="https://img.shields.io/badge/FastAPI-0.136+-009688?style=for-the-badge&logo=fastapi&logoColor=white" />
    <img src="https://img.shields.io/badge/Next.js-14+-000000?style=for-the-badge&logo=next.js&logoColor=white" />
    <img src="https://img.shields.io/badge/TypeScript-5.0+-3178C6?style=for-the-badge&logo=typescript&logoColor=white" />
    <img src="https://img.shields.io/badge/Sentence_Transformers-2.2+-FFD700?style=for-the-badge&logo=huggingface&logoColor=black" />
    <img src="https://img.shields.io/badge/FAISS-1.7+-EA6B6B?style=for-the-badge&logo=facebook&logoColor=white" />
    <img src="https://img.shields.io/badge/PostgreSQL-15+-4169E1?style=for-the-badge&logo=postgresql&logoColor=white" />
    <img src="https://img.shields.io/badge/Docker-24.0+-2496ED?style=for-the-badge&logo=docker&logoColor=white" />
  </p>

  <p align="center">
    <img src="https://img.shields.io/badge/Status-Development-2E7D32?style=for-the-badge" />
    <img src="https://img.shields.io/badge/GEMASTIK-2026-FF6B35?style=for-the-badge" />
  </p>

</div>

---

## 📖 Overview

**CulTour** adalah sistem rekomendasi wisata cerdas berbasis **Natural Language Processing (NLP)** yang dirancang khusus untuk membantu wisatawan menjelajahi kekayaan **Budaya Danau Toba**. Dengan memanfaatkan teknologi **Semantic Search** dan **Retrieval-Augmented Generation (RAG)** , CulTour dapat memahami pertanyaan natural user dan memberikan rekomendasi personal yang relevan.

### 🎯 Problem Statement
Wisatawan sering kesulitan menemukan informasi wisata budaya yang relevan karena:
- ❌ Pencarian tradisional hanya berbasis keyword matching
- ❌ Informasi tersebar di berbagai platform
- ❌ Kurangnya rekomendasi yang dipersonalisasi
- ❌ Bahasa deskripsi yang tidak konsisten

### 💡 Our Solution
CulTour hadir dengan pendekatan **AI-First** yang mengubah cara wisatawan menemukan destinasi budaya melalui:

<div align="center">
  <table>
    <tr>
      <td align="center"><b>🔍 Semantic Search</b><br/>Memahami konteks & makna</td>
      <td align="center"><b>🧠 Vector Embeddings</b><br/>Representasi cerdas destinasi</td>
      <td align="center"><b>🎯 RAG Pipeline</b><br/>Generasi rekomendasi akurat</td>
      <td align="center"><b>⚡ Real-time</b><br/>Respons cepat & interaktif</td>
    </tr>
  </table>
</div>

---

## ✨ Features

| Feature | Description | Status |
|---------|-------------|--------|
| 🤖 **AI-Powered Chatbot** | Natural language understanding untuk query wisata | 🚧 In Progress |
| 🔍 **Semantic Search** | Pencarian berbasis makna, bukan keyword | ✅ Completed |
| 📍 **Destination Database** | 100+ destinasi Danau Toba | ✅ Completed |
| 🎭 **Cultural Events** | Informasi event budaya terkini | ✅ Completed |
| 🍜 **Culinary Guide** | Rekomendasi kuliner khas Batak | ✅ Completed |
| 📸 **Photo Recognition** | Identifikasi destinasi dari gambar | 🚧 Planned |
| 📱 **Mobile Responsive** | Akses dari berbagai device | 🚧 In Progress |
| 🌐 **Multi-language** | Support Bahasa Indonesia & English | 🚧 Planned |
| 📊 **Admin Dashboard** | Manajemen konten destinasi | 🚧 Planned |
| 💾 **Trip Planner** | Rencana perjalanan personal | 🚧 Planned |

---

## 🏗️ Tech Stack

### Backend Core
```mermaid
graph LR
    A[FastAPI] --> B[Sentence Transformers]
    B --> C[FAISS]
    C --> D[PostgreSQL]
    A --> E[Pydantic]
    A --> F[Uvicorn]

