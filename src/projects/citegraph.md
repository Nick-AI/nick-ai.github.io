---
title: CiteGraph
summary: On-device ML pipeline for automated academic reference extraction.
category: Tools
order: 2
tech:
  - MLX
  - QLoRA
  - FastAPI
  - Pydantic
---

An end-to-end ML pipeline for automated academic reference extraction, running entirely on-device. Fine-tuned a 4-bit quantized Gemma model via QLoRA on Apple Silicon (MLX) to perform structured metadata extraction, reference parsing, and semantic tagging from raw PDF text.

Features a multi-model consensus labeling pipeline using the Gemini API to generate high-quality training data, Pydantic-validated JSON output, custom evaluation metrics, and a FastAPI REST API for integration with tools like Obsidian and Zotero. Supports 128k-token context through 4-bit KV-cache quantization.
