from pydantic import BaseModel, Field

class FemaleSpecific(BaseModel):
    gdm: bool = False
    birth_weight: bool = False
    pcos: bool = False

class AssessmentRequest(BaseModel):
    name: str
    email: str
    age_group: str
    sex: str
    bmi: float = Field(gt=0)
    height: float
    waist: float = Field(gt=0)
    activity: bool
    diet: bool
    bp: bool
    glucose: bool
    family_direct: bool
    family_indirect: bool
    female_specific: FemaleSpecific | None = None