#!/usr/bin/env python3
"""
rag_query.py — Query the Desktop RAG index
Usage: python rag_query.py "your question here"
       python rag_query.py --list
       python rag_query.py --stats
       python rag_query.py -n 10 "question"
"""

import sys
import json
import argparse
import textwrap
from pathlib import Path

sys.stdout.reconfigure(encoding="utf-8", errors="replace")

import chromadb
from chromadb import Documents, EmbeddingFunction, Embeddings
from sentence_transformers import SentenceTransformer
import ollama


MODEL_NAME = "paraphrase-MiniLM-L3-v2"
COLLECTION_NAME = "desktop_files"
OLLAMA_MODEL = "llama3.2:3b"


class SentenceTransformerEmbeddingFunction(EmbeddingFunction):
    def __init__(self, model_name: str = MODEL_NAME):
        self.model = SentenceTransformer(model_name)

    def __call__(self, input: Documents) -> Embeddings:
        return self.model.encode(list(input)).tolist()


def get_collection():
    chroma_dir = Path("E:/opencode") / "rag_system" / "chroma_db"
    if not chroma_dir.exists():
        print("Index not found. Run rag_indexer.py first.")
        sys.exit(1)

    client = chromadb.PersistentClient(str(chroma_dir))
    embedding_fn = SentenceTransformerEmbeddingFunction()

    try:
        return client.get_collection(COLLECTION_NAME, embedding_function=embedding_fn)
    except ValueError:
        print("Collection not found. Run rag_indexer.py first.")
        sys.exit(1)


def show_stats():
    collection = get_collection()
    count = collection.count()
    print(f"Index Statistics")
    print(f"  Total chunks: {count}")

    results = collection.get(limit=100)
    if results["metadatas"]:
        sources = set(m["source"] for m in results["metadatas"])
        exts = {}
        for m in results["metadatas"]:
            ext = m.get("extension", "unknown")
            exts[ext] = exts.get(ext, 0) + 1
        print(f"  Unique files (sample): {len(sources)}")
        print(f"  File types (sample):   {exts}")


def list_files():
    collection = get_collection()
    results = collection.get(limit=10000)
    if not results["metadatas"]:
        print("No files indexed.")
        return

    sources = set()
    for m in results["metadatas"]:
        sources.add((m["source"], m["extension"]))

    print(f"Indexed files ({len(sources)} total):")
    for src, ext in sorted(sources):
        print(f"  [{ext}] {src}")


def query(query_text: str, n_results: int = 5):
    collection = get_collection()

    results = collection.query(
        query_texts=[query_text],
        n_results=n_results,
    )

    if not results["documents"] or not results["documents"][0]:
        print("No results found.")
        return

    print(f"Query: \"{query_text}\"")
    print(f"  Found {len(results['documents'][0])} relevant chunk(s)\n")

    for i, (doc, metadata, distance) in enumerate(zip(
        results["documents"][0],
        results["metadatas"][0],
        results["distances"][0],
    )):
        source = metadata.get("source", "?")
        chunk_idx = metadata.get("chunk_index", 0)
        total_chunks = metadata.get("total_chunks", 0)
        ext = metadata.get("extension", "?")

        # Skip very large SQL files (more noise than signal)
        if ext in (".sql", ".txt") and total_chunks > 500:
            continue

        print(f"--- Result #{i+1} (distance: {distance:.2f}) ---")
        print(f"  File:  {source}")
        print(f"  Chunk: {chunk_idx+1}/{total_chunks}")
        print()
        print(textwrap.fill(doc, width=100))
        print()


def ask(query_text: str, n_results: int = 8):
    collection = get_collection()

    results = collection.query(
        query_texts=[query_text],
        n_results=n_results,
    )

    if not results["documents"] or not results["documents"][0]:
        print("No relevant documents found.")
        return

    context_parts = []
    seen_sources = {}

    for doc, metadata, distance in zip(
        results["documents"][0],
        results["metadatas"][0],
        results["distances"][0],
    ):
        source = metadata.get("source", "?")
        ext = metadata.get("extension", "?")
        total_chunks = metadata.get("total_chunks", 0)

        if ext in (".sql", ".txt") and total_chunks > 500:
            continue

        context_parts.append(f"[From {source}]\n{doc}")
        seen_sources[source] = True

    context = "\n\n".join(context_parts)

    prompt = f"""You are an assistant helping an IT Project Manager answer questions about their project files.
Use the provided context to answer the question. If the context doesn't contain enough information,
say so. Always cite the filename when referencing information.

Context:
{context}

Question: {query_text}

Answer:"""

    print(f"Thinking... (using {OLLAMA_MODEL})")
    response = ollama.chat(
        model=OLLAMA_MODEL,
        messages=[{"role": "user", "content": prompt}],
        options={"temperature": 0.1},
    )

    print(f"\nAnswer:\n{response['message']['content']}\n")

    print("Sources:")
    for src in sorted(seen_sources.keys()):
        print(f"  - {src}")


def main():
    parser = argparse.ArgumentParser(description="Query the Desktop RAG index")
    parser.add_argument("query", nargs="*", help="Your question")
    parser.add_argument("-n", "--n-results", type=int, default=5, help="Number of results (default: 5)")
    parser.add_argument("--stats", action="store_true", help="Show index statistics")
    parser.add_argument("--list", action="store_true", help="List indexed files")
    parser.add_argument("--json", action="store_true", help="Output as JSON (for programmatic use)")
    parser.add_argument("--ask", action="store_true", help="Answer using local LLM (Ollama)")
    args = parser.parse_args()

    if args.stats:
        show_stats()
    elif args.list:
        list_files()
    elif args.ask and args.query:
        ask(" ".join(args.query), n_results=args.n_results)
    elif args.query:
        query(" ".join(args.query), n_results=args.n_results)
    else:
        parser.print_help()


if __name__ == "__main__":
    main()
