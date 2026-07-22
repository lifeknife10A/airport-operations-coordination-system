import os
import subprocess

def assemble():
    # Paths
    base_dir = "/Users/krish/Desktop/Software Engineering"
    md_dir = os.path.join(base_dir, "Mini Project", "MD")
    scratch_file = "/Users/krish/.gemini/antigravity/brain/0eb9fbe6-d1bd-4dbb-b930-c7be0c6256b3/scratch/initial_phase.txt"
    output_md = os.path.join(md_dir, "AOCS_Master_Handbook.md")
    output_docx = os.path.join(base_dir, "Mini Project", "Initial Phase - Airport Operations Coordination System.docx")

    # Read the scratch file to get theoretical sections
    with open(scratch_file, 'r', encoding='utf-8') as f:
        original_text = f.read()

    # We will build the master markdown
    md_content = []

    # Title & Metadata
    md_content.append("# Airport Operations Coordination System (AOCS)")
    md_content.append("## Initial Phase Project Handbook\n")
    md_content.append("### Course: Software Engineering")
    md_content.append("### Academic Year: 2026-2027\n")
    
    md_content.append("### Project Team Members")
    md_content.append("* **Krishna Solanki (I075) - Lead:** Backend, Architecture, Database")
    md_content.append("* **Anay Modi (I088):** Frontend, React, Dashboard, API Integration")
    md_content.append("* **Anuvrat Tripathi (I080):** Documentation, Testing, UML, Presentation")
    md_content.append("* **Chaitanya Tikku (I078):** Integration Specialist, Mobile HCI Developer & Quality Assurance\n")
    
    md_content.append("---\n")
    
    # 1. Introduction to Software Engineering
    md_content.append("## 1. Introduction to Software Engineering")
    intro_start = original_text.find("3. Introduction to Software Engineering")
    intro_end = original_text.find("4. Why We Selected Aviation")
    if intro_start != -1 and intro_end != -1:
        intro_part = original_text[intro_start:intro_end].strip()
        intro_part = intro_part.replace('\x0c', '').replace('3. Introduction to Software Engineering', '').strip()
        md_content.append(intro_part + "\n")
    
    # 2. Why We Selected Aviation
    md_content.append("## 2. Why We Selected Aviation")
    aviation_start = original_text.find("4. Why We Selected Aviation")
    aviation_end = original_text.find("5. Understanding Airport Operations")
    if aviation_start != -1 and aviation_end != -1:
        aviation_part = original_text[aviation_start:aviation_end].strip()
        aviation_part = aviation_part.replace('\x0c', '').replace('4. Why We Selected Aviation', '').strip()
        md_content.append(aviation_part + "\n")

    # 3. Understanding Airport Operations
    md_content.append("## 3. Understanding Airport Operations")
    ops_start = original_text.find("5. Understanding Airport Operations")
    ops_end = original_text.find("6. Existing Problems")
    if ops_start != -1 and ops_end != -1:
        ops_part = original_text[ops_start:ops_end].strip()
        ops_part = ops_part.replace('\x0c', '').replace('5. Understanding Airport Operations', '').strip()
        md_content.append(ops_part + "\n")

    # 4. Existing Problems
    md_content.append("## 4. Existing Problems")
    problems_start = original_text.find("6. Existing Problems")
    problems_end = original_text.find("7. Proposed Solution")
    if problems_start != -1 and problems_end != -1:
        problems_part = original_text[problems_start:problems_end].strip()
        problems_part = problems_part.replace('\x0c', '').replace('6. Existing Problems', '').strip()
        md_content.append(problems_part + "\n")

    # 5. Proposed Solution & Vision (incorporate project_vision.md contents)
    md_content.append("## 5. Proposed Solution & Vision")
    vision_file = os.path.join(md_dir, "project_vision.md")
    if os.path.exists(vision_file):
        with open(vision_file, 'r', encoding='utf-8') as vf:
            md_content.append(vf.read().strip() + "\n")

    # 6. Airport Management & Usage Features (incorporate airport_usage_features.md)
    md_content.append("## 6. Airport Management & Usage Features")
    features_file = os.path.join(md_dir, "airport_usage_features.md")
    if os.path.exists(features_file):
        with open(features_file, 'r', encoding='utf-8') as ff:
            md_content.append(ff.read().strip() + "\n")

    # 7. User Stories and Acceptance Criteria (incorporate user_requirements_combined.md)
    md_content.append("## 7. Master User Stories & Acceptance Criteria")
    req_file = os.path.join(md_dir, "user_requirements_combined.md")
    if os.path.exists(req_file):
        with open(req_file, 'r', encoding='utf-8') as rf:
            content = rf.read()
            start_index = content.find("## 2. Group A:")
            if start_index != -1:
                md_content.append(content[start_index:].strip() + "\n")
            else:
                md_content.append(content.strip() + "\n")

    # 8. Non Functional Requirements
    md_content.append("## 8. Non-Functional Requirements")
    nfr_start = original_text.find("10. Non Functional Requirements")
    nfr_end = original_text.find("11. System Modules")
    if nfr_start != -1 and nfr_end != -1:
        nfr_part = original_text[nfr_start:nfr_end].strip()
        nfr_part = nfr_part.replace('\x0c', '').replace('10. Non Functional Requirements', '').strip()
        md_content.append(nfr_part + "\n")

    # 9. Technology Stack
    md_content.append("## 9. Technology Stack")
    tech_start = original_text.find("12. Technology Stack")
    tech_end = original_text.find("13. Database Overview")
    if tech_start != -1 and tech_end != -1:
        tech_part = original_text[tech_start:tech_end].strip()
        tech_part = tech_part.replace('\x0c', '').replace('12. Technology Stack', '').strip()
        md_content.append(tech_part + "\n")

    # 10. Database Overview
    md_content.append("## 10. Database Overview")
    db_start = original_text.find("13. Database Overview")
    db_end = original_text.find("14. High-Level Software Architecture")
    if db_start != -1 and db_end != -1:
        db_part = original_text[db_start:db_end].strip()
        db_part = db_part.replace('\x0c', '').replace('13. Database Overview', '').strip()
        md_content.append(db_part + "\n")

    # 11. Project Development Roadmap & Workload Allocation
    md_content.append("## 11. Project Development Roadmap & Workload Allocation")
    roadmap_file = os.path.join(md_dir, "project_development_roadmap.md")
    if os.path.exists(roadmap_file):
        with open(roadmap_file, 'r', encoding='utf-8') as rmf:
            md_content.append(rmf.read().strip() + "\n")

    # 12. Risks and Challenges
    md_content.append("## 12. Risks and Challenges")
    risks_start = original_text.find("18. Risks and Challenges")
    risks_end = original_text.find("19. Future Enhancements")
    if risks_start != -1 and risks_end != -1:
        risks_part = original_text[risks_start:risks_end].strip()
        risks_part = risks_part.replace('\x0c', '').replace('18. Risks and Challenges', '').strip()
        md_content.append(risks_part + "\n")

    # 13. Future Enhancements
    md_content.append("## 13. Future Enhancements")
    enh_start = original_text.find("19. Future Enhancements")
    enh_end = original_text.find("20. Glossary")
    if enh_start != -1 and enh_end != -1:
        enh_part = original_text[enh_start:enh_end].strip()
        enh_part = enh_part.replace('\x0c', '').replace('19. Future Enhancements', '').strip()
        md_content.append(enh_part + "\n")

    # 14. Glossary
    md_content.append("## 14. Glossary")
    glossary_start = original_text.find("20. Glossary")
    glossary_end = original_text.find("21. References")
    if glossary_start != -1 and glossary_end != -1:
        glossary_part = original_text[glossary_start:glossary_end].strip()
        glossary_part = glossary_part.replace('\x0c', '').replace('20. Glossary', '').strip()
        md_content.append(glossary_part + "\n")

    # Write out the combined Markdown
    with open(output_md, 'w', encoding='utf-8') as out_f:
        out_f.write("\n\n".join(md_content))
    print(f"Successfully assembled Markdown handbook at: {output_md}")

    # Convert to docx using pandoc
    try:
        cmd = ["/opt/anaconda3/bin/pandoc", "-s", output_md, "-o", output_docx]
        result = subprocess.run(cmd, check=True, stdout=subprocess.PIPE, stderr=subprocess.PIPE)
        print(f"Successfully generated DOCX file at: {output_docx}")
    except subprocess.CalledProcessError as e:
        print(f"Pandoc error: {e.stderr.decode('utf-8')}")
        raise e

if __name__ == '__main__':
    assemble()
