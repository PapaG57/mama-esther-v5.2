# Directives de Collaboration AI

## Stratégie Micro-Économique

1. **Rôle de Gemini (Gratuit) :**
   - Analyse du besoin et de l'architecture.
   - Rédaction de prompts chirurgicaux et très cadrés.
   - Pré-découpage des tâches en sous-étapes simples.
   - **Ne doit pas modifier les fichiers directement ; son rôle est de préparer les prompts pour DeepSeek.**

2. **Rôle de DeepSeek (Exécution / Payant) :**
   - Exécution directe du code complexe via Aider (`deepseek/deepseek-chat`).
   - Aucune hésitation ni bavardage, modification directe des fichiers cibles.

## Règles pour Aider (Optimisation des Crédits)

- Ne charger dans le contexte que les fichiers strictement nécessaires (`/add`).
- Utiliser des prompts concis, sans formules de politesse superflues.
- Privilégier des interventions ciblées pour éviter la réécriture de gros blocs.
