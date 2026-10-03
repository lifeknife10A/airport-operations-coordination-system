# 06: Complete Deliverables & Submission Checklist
**Project**: Saphire AOCS (Airport Operations Coordination System)  
**Authors**: Krishna Solanki (I075), Chaitanya Tikku (I078), Anuvrat Tripathi (I080), Anay Modi (I088)  

---

## 1. Physical Deliverables Roster

| Deliverable Name | File Location | Format | Status |
| :--- | :--- | :--- | :--- |
| **PowerPoint Presentation** | `Submission Guidelines/I075_I078_I080_I088_Saphire_AOCS_Presentation.pptx` | PPTX (22 Slides) | Ready (5.5 MB) |
| **Master Submission Handbook** | `Submission Guidelines/MASTER_SUBMISSION_AND_EVALUATION_GUIDELINES.md` | Markdown | Ready |
| **CR Voice Notes & Rules** | `Submission Guidelines/01_CR_VOICE_TRANSCRIPTS_AND_SUBMISSION_RULES.md` | Markdown | Ready |
| **Presentation Content Pack** | `Submission Guidelines/02_PRESENTATION_MASTER_CONTENT_PACK_22_SLIDES.md` | Markdown | Ready |
| **4-Member Video Script** | `Submission Guidelines/03_FOUR_MEMBER_VIDEO_DEMO_SCRIPT.md` | Markdown | Ready |
| **Database & Viva Guide** | `Submission Guidelines/04_DATABASE_SCHEMA_AND_VIVA_DEFENSE_GUIDE.md` | Markdown | Ready |
| **AI Prompts & Audit Pack** | `Submission Guidelines/05_AI_PROMPTS_AND_SECOND_OPINION_AUDIT_PROMPT.md` | Markdown | Ready |
| **Relational Schema (41 Tables)**| `Mini Project/documentation/SVG/Final Assets/Figure 9 - Relational Schema.svg` | SVG & High-Res PNG | Ready |
| **Star Schema (10 Dimensions)** | `Mini Project/documentation/SVG/Final Assets/Figure 10 - Star Schema.svg` | SVG & High-Res PNG | Ready |
| **Information Package** | `Mini Project/documentation/SVG/Final Assets/Figure 11 - Information Package.svg` | SVG & High-Res PNG | Ready |
| **UML Diagram Suite (Labs 3-8)** | `Mini Project/documentation/SVG/Final Assets/` (Figures 3.1 to 8.2) | SVG & High-Res PNG | Ready |
| **Backend Spring Boot REST** | `Mini Project/backend/` | Java 17 / Spring Boot 3.2.5 | Ready (18 Controllers) |
| **Frontend React 19 App** | `Mini Project/frontend/` | React 19 / TypeScript / Vite | Ready (16 Consoles) |
| **Flyway Database Migrations** | `Mini Project/backend/src/main/resources/db/migration/` | 20 SQL Scripts (V1-V20) | Ready (158k+ Records) |
| **QA Automated Test Suite** | `Mini Project/backend/src/test/` | JUnit 5 / Mockito | Ready (109 Passing Tests) |

---

## 2. Pre-Viva Setup & Execution Checklist

1. **Database Container**:
   - Ensure PostgreSQL 18 is running (`docker compose up -d postgres` or local service).
   - Check tables count: `SELECT COUNT(*) FROM information_schema.tables WHERE table_schema='public';` -> 41 tables.

2. **Backend Services**:
   - Run `./mvnw spring-boot:run` in `Mini Project/backend/`.
   - Verify health endpoint: `GET http://localhost:8080/actuator/health` or `GET http://localhost:8080/api/public/flights`.

3. **Frontend Application**:
   - Run `pnpm run dev` in `Mini Project/frontend/`.
   - Open `http://localhost:3000` in Google Chrome / Safari.
   - Test DCS Check-in flow (`/dashboard/check-in`) with PNR `6E-8841` to demonstrate live PDF417 boarding pass generation.

4. **Presentation File**:
   - Open `I075_I078_I080_I088_Saphire_AOCS_Presentation.pptx` in Microsoft PowerPoint or Keynote.
   - Verify slide notes are visible in presenter view.
