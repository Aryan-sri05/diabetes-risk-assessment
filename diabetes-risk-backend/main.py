from fastapi import FastAPI, Depends, status
from sqlalchemy.orm import Session
from database import SessionLocal, engine
import models
from schemas import AssessmentRequest
from scoring import calculate_risk
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI()

models.Base.metadata.create_all(bind=engine)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Dependency
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

@app.get("/")
def root():
    return {"message": "Diabetes Risk API is running"}

@app.post("/assess-risk", status_code=status.HTTP_200_OK)
def assess_risk(data: AssessmentRequest, db: Session = Depends(get_db)):
    existing = db.query(models.Assessment).filter(
        models.Assessment.email == data.email
    ).first()

    if existing:
        return {"message": "User already exists"}

    result = calculate_risk(data)

    whtr = data.waist / data.height if data.height else None

    female = data.female_specific
    gdm = female.gdm if female else False
    birth_weight = female.birth_weight if female else False
    pcos = female.pcos if female else False

    print("Incoming data:", data)
    print("Calculated result:", result)

    new_entry = models.Assessment(
        name=data.name,
        email=data.email,
        age_group=data.age_group,
        sex=data.sex,
        bmi=data.bmi,
        height=data.height, 
        waist=data.waist,
        whtr=whtr,
        activity=data.activity,
        diet=data.diet,
        bp=data.bp,
        glucose=data.glucose,
        family_direct=data.family_direct,
        family_indirect=data.family_indirect,
        gdm=gdm,
        birth_weight=birth_weight,
        pcos=pcos,
        score=result["score"],
        risk_level=result["risk_level"],
        probability=result["probability"]
    )

    db.add(new_entry)
    db.commit()
    db.refresh(new_entry)

    return result

@app.get("/check-email")
def check_email(email: str, db: Session = Depends(get_db)):
    existing = db.query(models.Assessment).filter(
        models.Assessment.email == email
    ).first()

    if existing:
        return {"exists": True}
    return {"exists": False}