# Semantic search
curl "http://localhost:8000/api/v1/search?q=tempat wisata budaya di samosir&limit=3"

# Response
{
  "query": "tempat wisata budaya di samosir",
  "total": 3,
  "results": [
    {
      "destination": {
        "id": 3,
        "name": "Museum Batak Tomok",
        "category": "budaya",
        "description": "Museum sejarah dan budaya Batak di Pulau Samosir",
        "location": "Samosir",
        "rating": 4.5
      },
      "score": 0.89
    }
  ]
}

cultour/
│
├── backend/                      # FastAPI Backend
│   ├── app/
│   │   ├── ai/                   # AI & ML Services
│   │   │   ├── embeddings.py     # Sentence Transformers
│   │   │   ├── faiss_index.py    # Vector search index
│   │   │   └── search.py         # Search service
│   │   ├── api/                  # REST API endpoints
│   │   │   └── v1/
│   │   │       └── endpoints/
│   │   │           └── search.py
│   │   ├── core/                 # Core configuration
│   │   │   └── config.py         # Settings management
│   │   ├── db/                   # Database layer
│   │   ├── models/               # SQLAlchemy models
│   │   ├── schemas/              # Pydantic schemas
│   │   │   └── destination.py
│   │   └── main.py               # FastAPI entry point
│   ├── requirements.txt          # Python dependencies
│   ├── Dockerfile                # Backend container
│   └── .env                      # Environment variables
│
├── frontend/                     # Next.js Frontend
│   ├── src/
│   │   ├── app/                  # App router pages
│   │   │   ├── layout.tsx        # Root layout
│   │   │   ├── page.tsx          # Home page
│   │   │   └── globals.css       # Global styles
│   │   ├── components/           # Reusable components
│   │   ├── services/             # API integration
│   │   ├── lib/                  # Utility functions
│   │   └── types/                # TypeScript types
│   ├── public/                   # Static assets
│   ├── package.json              # Node dependencies
│   └── next.config.ts            # Next.js config
│
├── dataset/                      # Tourism data
│   ├── destinations.csv          # Main destinations
│   ├── cultures.csv              # Cultural info
│   ├── culinary.csv              # Food & dining
│   └── events.csv                # Events calendar
│
├── docker/                       # Docker configs
├── database/                     # SQL schemas
├── docs/                         # Documentation
├── docker-compose.yml            # Multi-container setup
├── .gitignore                    # Git ignore rules
└── README.md                     # This file
