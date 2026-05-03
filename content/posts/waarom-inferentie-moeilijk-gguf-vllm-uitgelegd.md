---
title: "Waarom Inferentie Zo Moeilijk Is: Van GGUF tot vLLM Uitgelegd"
date: "2026-05-03"
category: "AI & Technologie"
excerpt: "Van mmap en quantization tot vLLM en SGLang: een uitgebreide gids over de complexiteit van LLM inferentie, loading strategieën en serving voor productie."
featuredImage: "/images/blog/waarom-inferentie-moeilijk-gguf-vllm-uitgelegd.png"
---

# Waarom Inferentie Zo Moeilijk Is: Van GGUF tot vLLM Uitgelegd

Je downloadt een groot taalmodel en verwacht dat het gewoon werkt. Maar de werkelijkheid is complexer: efficient inferentie draaien vereist diep begrip van loading, quantization en serving strategieën. Caleb neemt je mee door het volledige landschap.

## Het Fundamentele Probleem

Een modern LLM als Llama 3.1 70B heeft 70 miljard parameters. In FP32 (32-bit floating point) zijn dat **280 GB** aan data — meer dan het werkgeheugen van vrijwel elke GPU.

De uitdaging: hoe laad je dit model efficiënt, hoe reduceer je de geheugenvoetafdruk, en hoe bedien je meerdere gebruikers tegelijkertijd zonder performance te verliezen?

## Loading Strategieën

### Standard Loading
Het simpelste geval: laad het volledige model in GPU VRAM. Werkt alleen als je genoeg VRAM hebt.

### mmap (Memory-Mapped Files)
Een elegante oplossing: het model wordt niet volledig in RAM geladen, maar wordt **on-demand** gelezen van schijf via het operating system's virtual memory mechanisme.

**Voordelen:**
- Het OS bepaalt wat in RAM blijft (de meest gebruikte parameters)
- Meerdere processen kunnen hetzelfde model delen zonder extra geheugen
- Start vrijwel onmiddellijk — geen lange laadtijd

**Nadelen:**
- Afhankelijk van schijfsnelheid (NVMe essentieel)
- Kan langzamer zijn dan volledige RAM-loading voor hot paths

## Quantization: Kleiner Zonder Alles te Verliezen

Quantization reduceert de precisie van modelgewichten om geheugen te besparen.

### Standard Quantization
Reduceer van FP32 (4 bytes) naar FP16 (2 bytes) of INT8 (1 byte). Eenvoudig maar kan kwaliteit beïnvloeden.

**Vuistregel:** FP16 is vrijwel verliesvrij. INT8 is acceptabel voor de meeste taken.

### GGUF (GPT-Generated Unified Format)
Het format dat llama.cpp gebruikt. GGUF ondersteunt mixed-precision quantization — verschillende lagen van het model worden met verschillende precisie opgeslagen.

Kritieke lagen behouden hogere precisie. Minder kritieke lagen worden agressiever gekwantiseerd.

**Resultaat:** Een 7B model in Q4_K_M is ~4 GB in plaats van 28 GB, met minimaal kwaliteitsverlies.

### AWQ (Activation-aware Weight Quantization)
Slimmer dan standard quantization: AWQ analyseert welke gewichten het meest bijdragen aan de output en beschermt die met hogere precisie.

**Voordelen:**
- Betere kwaliteitsbehoud bij lage bit-widths
- Speciaal effectief voor 4-bit quantization
- Goede GPU-support

### EXL2 (ExLlama v2)
Een format voor maximale snelheid op NVIDIA GPUs, met adaptieve quantization per laag. EXL2 kan per laag een andere bit-breedte gebruiken en optimaliseert de toewijzing gebaseerd op impact op kwaliteit.

### FP8 en NVFP4
De nieuwste quantization formats voor moderne NVIDIA GPUs (H100, H200):

- **FP8**: Betere kwaliteit dan INT8 omdat floating point de numerieke range beter behoudt
- **NVFP4**: Uiterst gecomprimeerd met specifieke hardware-ondersteuning

## Inference Engines Vergelijken

### llama.cpp
- **Doelgroep:** Consumenterhardware, CPU-based inference
- **Sterkten:** Breed device support, mmap, CPU+GPU hybrid
- **Gebruik:** Lokaal draaien van modellen

### vLLM
- **Doelgroep:** Production serving op GPU clusters
- **Sterkten:** PagedAttention voor efficiënt KV-cache management, hoge throughput
- **Gebruik:** Backend van AI API services

### SGLang
- **Doelgroep:** Complex multi-step inference
- **Sterkten:** RadixAttention voor prefix caching, snelle structured output
- **Gebruik:** Agent-gebaseerde applicaties

### TensorRT-LLM
- **Doelgroep:** NVIDIA GPU inference, maximale performance
- **Sterkten:** Uiterst geoptimaliseerd voor NVIDIA hardware
- **Gebruik:** High-performance productie deployments

### TGI (Text Generation Inference)
- **Doelgroep:** Hugging Face ecosystem
- **Sterkten:** Eenvoudige deployment, goede compatibiliteit
- **Gebruik:** Snelle deployment van Hugging Face modellen

## Pre-fill vs. Decoding: De Twee Fases

### Pre-fill (Prompt Processing)
Het model verwerkt de volledige input prompt **in één keer**. Compute-intensief maar kan geparallelliseerd worden.

**Bottleneck:** GPU compute (FLOPS)

### Decoding (Token Generation)
Het model genereert **één token per stap**, inherent sequentieel.

**Bottleneck:** Memory bandwidth

Dit onderscheid is cruciaal voor serving: pre-fill kan gebatcht worden, decoding is moeilijker.

## Concurrency en Scheduling

**Continuous Batching:** Voeg nieuwe requests toe zodra vorige klaar zijn. Hogere GPU-utilization.

**PagedAttention (vLLM):** Beheer KV-cache als OS virtual memory. Elimineert fragmentatie.

**Prefix Caching (SGLang):** Cache KV-states van herhaalde prefixes. Elimineer herberekening.

## Conclusie

Er is geen universeel "beste" oplossing voor inferentie:

- **Lokaal gebruik:** llama.cpp met GGUF
- **High-throughput serving:** vLLM of SGLang
- **Maximum NVIDIA performance:** TensorRT-LLM
- **Agent applications:** SGLang

Naarmate modellen groter worden en inference democratischer, wordt dit kennisgebied steeds belangrijker — voor iedereen die serieus met AI werkt.

*De hardware en software voor inference verbeteren snel — maar begrip van de trade-offs blijft essentieel.*

---

*Deze blogpost is gebaseerd op een video van [Caleb Williams](https://www.youtube.com/@CalebWritesCode). [Bekijk de originele video](https://www.youtube.com/watch?v=B18zBnjZKmc).*
