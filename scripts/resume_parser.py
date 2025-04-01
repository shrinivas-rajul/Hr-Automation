import PyPDF2
import re
import json
import sys
from pathlib import Path

def extract_text_from_pdf(pdf_path):
    with open(pdf_path, 'rb') as file:
        pdf_reader = PyPDF2.PdfReader(file)
        text = ""
        for page in pdf_reader.pages:
            text += page.extract_text() + "\n"
    return text

def extract_email(text):
    email_pattern = r'[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}'
    emails = re.findall(email_pattern, text)
    return emails[0] if emails else ""

def extract_phone(text):
    phone_pattern = r'(?:\+\d{1,3}[-. ]?)?\(?\d{3}\)?[-. ]?\d{3}[-. ]?\d{4}'
    phones = re.findall(phone_pattern, text)
    return phones[0] if phones else ""

def extract_name(text):
    # Look for name in the first few lines
    lines = text.split('\n')
    for line in lines[:5]:  # Check first 5 lines
        # Skip empty lines and common headers
        if line.strip() and not any(header in line.lower() for header in ['resume', 'cv', 'curriculum vitae']):
            return line.strip()
    return ""

def extract_skills(text):
    skill_keywords = [
        "javascript", "typescript", "react", "node.js", "python", "java", "sql",
        "aws", "docker", "kubernetes", "git", "agile", "scrum", "leadership",
        "communication", "problem solving", "project management", "next.js",
        "express", "mongodb", "postgresql", "redis", "graphql", "rest api",
        "ci/cd", "jenkins", "github actions", "terraform", "cloud computing",
        "machine learning", "ai", "data science", "analytics", "testing",
        "unit testing", "integration testing", "automation", "devops"
    ]
    
    found_skills = []
    text_lower = text.lower()
    for skill in skill_keywords:
        if skill in text_lower:
            found_skills.append(skill)
    return found_skills

def extract_experience(text):
    experience_pattern = r'(\d+)\+?\s*(?:years?|yrs?)\s*(?:of)?\s*experience'
    match = re.search(experience_pattern, text, re.IGNORECASE)
    return match.group(0) if match else ""

def calculate_match_score(skills, experience):
    score = 0
    
    # Score based on number of skills (max 50 points)
    skill_score = min(len(skills) * 5, 50)
    score += skill_score
    
    # Score based on experience (max 50 points)
    years_match = re.search(r'(\d+)', experience)
    if years_match:
        years = int(years_match.group(1))
        experience_score = min(years * 10, 50)
        score += experience_score
    
    return score

def parse_resume(pdf_path):
    try:
        # Extract text from PDF
        text = extract_text_from_pdf(pdf_path)
        
        # Extract information
        name = extract_name(text)
        email = extract_email(text)
        phone = extract_phone(text)
        skills = extract_skills(text)
        experience = extract_experience(text)
        
        # Calculate match score
        match_score = calculate_match_score(skills, experience)
        
        # Generate candidate ID
        import time
        import random
        candidate_id = f"CAND-{int(time.time())}-{random.randint(1000, 9999)}"
        
        return {
            "name": name,
            "email": email,
            "phone": phone,
            "skills": skills,
            "experience": experience,
            "candidateId": candidate_id,
            "matchScore": match_score
        }
    except Exception as e:
        print(f"Error parsing resume: {str(e)}", file=sys.stderr)
        return None

if __name__ == "__main__":
    if len(sys.argv) != 2:
        print("Usage: python resume_parser.py <pdf_path>")
        sys.exit(1)
    
    pdf_path = sys.argv[1]
    result = parse_resume(pdf_path)
    
    if result:
        print(json.dumps(result))
    else:
        sys.exit(1) 