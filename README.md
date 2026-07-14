<!-- <img width="90" height="90" alt="THORFIN2" src="https://github.com/user-attachments/assets/eff6e6c6-854f-4a55-a62c-f1a8c8959e36" /> -->

 # RepoQuery
 
**The AI Knowledge Engine for GitHub Teams**


> *RepoQuery is a full-stack AI SaaS that turns GitHub repositories, commits, and meetings into a single intelligent knowledge system for development teams.*

---

 # Architectural Overview 
 
<img width="3873" height="2861" alt="Architecture" src="https://github.com/user-attachments/assets/3e44b881-3a20-4fef-8cb0-9cfa6e97a609" />






 
---

##  Overview

**RepoQuery** is an AI-powered GitHub collaboration platform designed to **capture, structure, and surface team knowledge** that is normally lost across commits, pull requests, and meetings.


Modern development teams suffer from:
- Context switching between GitHub, meetings, and documentation  
- Poor onboarding due to lack of summarized project knowledge  
- Lost decisions buried in meeting recordings  
- No persistent memory of discussions and code evolution  

**RepoQuery solves this by acting as a shared “AI brain” for your repository.**
<img width="1905" height="912" alt="image" src="https://github.com/user-attachments/assets/a5914447-bc90-4829-b4c9-798b2e1fd3d9" />

---
> Note: This project was originally developed under the name "Prometheus", inspired by Prometheus as a symbol of knowledge, innovation, and human progress. After becoming aware of the Prometheus monitoring ecosystem during later production-system studies, the project was renamed to "RepoQuery" to avoid naming ambiguity in professional contexts.
##  What Problem Does RepoQuery Solve?

###  The Problem
- GitHub commits are noisy and hard to follow over time
- Meeting decisions are forgotten or never documented
- New team members struggle to understand project context
- AI chat tools lack **project-specific memory**
- Knowledge is scattered across tools

###  The Solution
RepoQuery centralizes all technical knowledge into one AI-driven system:
- Commits are automatically summarized
- Meetings are transcribed and converted into actionable issues
- An AI assistant understands your entire repository via RAG
- Team members can ask context-aware questions anytime
- All AI interactions are saved and reusable

---

##  Key Features

###  GitHub Repository Intelligence (RAG)
- Repository ingestion & indexing
- Code embeddings stored with pgvector
- Retrieval-Augmented Generation for accurate answers

###  Commit Summarization
- Automatic commit summaries using LLMs
- Clear project history & decision tracking

###  AI-Powered Meeting Analysis
- Upload recorded meetings
- AssemblyAI transcribes audio
- Extracts issues, topics & summaries

###  Team Collaboration
- Invite members to projects
- Shared AI context across teams

###  Credits & Billing
- Stripe-powered billing
- Usage-based AI credits
- Secure webhooks

---
## Screenshots 
### Authentication (using Clerk)
The authentication flow is powered by Clerk, enabling secure multi-tenant authentication with session management. Users must authenticate before accessing any project, ensuring that all repository data, AI interactions, and usage credits are strictly scoped to the authenticated user and associated project, providing complete isolation across teams and tenants.
<img width="666" height="923" alt="image" src="https://github.com/user-attachments/assets/699c0e6a-f3c3-4abc-9162-c6651571a03d" />

### Team Invite 
Each repository project supports team-based collaboration. Users can invite teammates to a project, enabling shared access to repository insights, AI queries, and meeting summaries.
<img width="1912" height="929" alt="image" src="https://github.com/user-attachments/assets/01b20589-1049-4d2d-a66b-a0747f9afcc5" />

The avatars of joined members are displayed next to the invite button, providing quick visibility into active collaborators for the selected project.

<img width="1909" height="909" alt="image" src="https://github.com/user-attachments/assets/6c915f09-6536-4232-9daf-93a4d5424bc3" />

### Make Projects 
Users can create a new project by providing a project name and a valid GitHub repository URL in the specified format. Each project represents an isolated workspace where repository data, embeddings, and AI interactions are managed independently.
<img width="1893" height="762" alt="image" src="https://github.com/user-attachments/assets/498905ab-cf46-4e6b-94d3-54096fa9de00" />

Before project creation, the system checks whether the user has sufficient AI credits available. If credits are insufficient, the user is prompted to purchase additional credits.

<img width="1919" height="847" alt="image" src="https://github.com/user-attachments/assets/c9f016c4-4157-45c2-b1dc-ddb13244d560" />

Once credits are available, the repository is processed through a Retrieval-Augmented Generation (RAG) pipeline, where source files and commits are summarized, embedded, and indexed to enable semantic search and intelligent responses.

<img width="1905" height="912" alt="image" src="https://github.com/user-attachments/assets/32c61d83-ca21-493e-ba17-a9145ccdcd58" />

### Buying Credits to use the Platform (Stripe)
RepoQuery uses a credit-based usage model backed by Stripe. The billing dashboard displays the user’s available credits, usage rules, and purchase options, with payments securely handled via Stripe.

For each project, the required credits are dynamically calculated based on the total number of source files extracted from the linked GitHub repository, ensuring that credit consumption scales proportionally with repository size and indexing cost. Credits are strictly enforced across all AI-powered features.

<img width="1892" height="975" alt="image" src="https://github.com/user-attachments/assets/979169be-96e2-43fd-9cdc-38ce62d81679" />

<img width="1920" height="980" alt="image" src="https://github.com/user-attachments/assets/73a02c1e-8beb-471a-8a8c-ad624b607fb4" />

### Meetings ( Assembly AI  )
RepoQuery allows users to upload recorded meeting audio files. These recordings are transcribed using AssemblyAI, and the system automatically extracts key discussion points, issues, and summaries.
<img width="1913" height="897" alt="image" src="https://github.com/user-attachments/assets/c34c689c-5a5b-47e6-aee5-fc8ecb94bba7" />
<img width="1912" height="1008" alt="image" src="https://github.com/user-attachments/assets/df782dc8-e493-4111-978d-7971b1c78006" />
<!-- <img width="1916" height="980" alt="image" src="https://github.com/user-attachments/assets/a44126be-0150-4067-b139-c28441b7578e" />



<img width="1902" height="899" alt="image" src="https://github.com/user-attachments/assets/b0b98de9-2fa0-4eb0-aed5-7767df389e98" /> -->

Clicking View Meeting navigates to a dedicated meeting page, where all extracted issues and summaries are listed for easy reference and follow-up.

<!-- <img width="1899" height="899" alt="image" src="https://github.com/user-attachments/assets/dc76f8c0-2c19-4f09-a913-8c368672d779" /> -->

<!-- <img width="1747" height="912" alt="image" src="https://github.com/user-attachments/assets/8061f3be-4e82-4797-90e1-f44aae004a6f" /> -->
<img width="1916" height="980" alt="image" src="https://github.com/user-attachments/assets/29f6ec37-991a-4944-be3d-0e568a045a4c" />


> (Note: A short sample meeting audio was used for demonstration, so only limited details are shown.)

### Ask Questions Related to the Repository project selected 
RepoQuery supports repository-aware Q&A using a RAG pipeline over indexed code embeddings. Users can optionally save answers, making them visible to all team members within the same project. Saved Q&A entries are persisted via tRPC APIs with strict project-level isolation, enabling shared, reusable knowledge across teams.
<img width="1905" height="989" alt="image" src="https://github.com/user-attachments/assets/458c87eb-a127-48c9-828a-7fc9dd6ef77d" />
<img width="1878" height="983" alt="image" src="https://github.com/user-attachments/assets/bb007ac9-ba9e-410b-b0ca-2bc678197047" />
<img width="1920" height="991" alt="image" src="https://github.com/user-attachments/assets/0fbceec9-351a-40de-8d66-247d75a6f988" />
<img width="1913" height="987" alt="image" src="https://github.com/user-attachments/assets/8dd76d3f-aca6-4404-a123-ef8c7cf7ac8c" />














##  Tech Stack

### Frontend
- Next.js 15 (App Router)
- React + TypeScript
- Tailwind CSS
- Shadcn UI

### Backend
- Next.js API Routes
- tRPC
- Prisma ORM

### Database
- PostgreSQL (NeonDB)
- pgvector for embeddings

### AI & ML
- Google Gemini
- RAG pipeline

### Audio
- AssemblyAI

### Auth & Payments
- Clerk
- Stripe

---




## References
- Next.js Documentation — https://nextjs.org/docs  
- Google Gemini API — https://ai.google.dev  
- LangChain JS — https://js.langchain.com  
- pgvector — https://github.com/pgvector/pgvector  
- AssemblyAI Docs — https://www.assemblyai.com/docs  
- Clerk Auth — https://clerk.com/docs  
- Stripe Docs — https://stripe.com/docs  
- GitHub REST API — https://docs.github.com/en/rest  
- tRPC — https://trpc.io/docs



