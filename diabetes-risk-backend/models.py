from sqlalchemy import Column, Integer, String, Float, Boolean
from database import Base

class Assessment(Base):
    __tablename__ = "assessments"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String)
    email = Column(String, unique=True)
    age_group = Column(String)
    sex = Column(String)
    bmi = Column(Float)
    waist = Column(Float)
    height = Column(Float)
    whtr = Column(Float)

    activity = Column(Boolean)
    diet = Column(Boolean)
    bp = Column(Boolean)
    glucose = Column(Boolean)

    family_direct = Column(Boolean)
    family_indirect = Column(Boolean)

    gdm = Column(Boolean, default=False)
    birth_weight = Column(Boolean, default=False)
    pcos = Column(Boolean, default=False)

    score = Column(Integer)
    risk_level = Column(String)
    probability = Column(String)