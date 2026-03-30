def calculate_risk(data):
    score = 0
    sex = data.sex.lower()

    # Age
    if data.age_group == "45-54":
        score += 2
    elif data.age_group == "55-64":
        score += 3
    elif data.age_group == ">64":
        score += 4

    # Sex
    if sex == "male":
        score += 1

    # BMI
    if data.bmi > 30:
        score += 3
    elif 25 <= data.bmi < 30:
        score += 1
    
    # Waist (gender-specific)
    if sex == "male" and data.waist > 102:
        score += 4
    elif sex == "female" and data.waist > 88:
        score += 4

    # Waist-to-Height Ratio (WHtR)
    if data.height and data.waist:
        whtr = data.waist / data.height
        if whtr > 0.5:
            score += 2

    # Activity
    if not data.activity:
        score += 2

    # Diet
    if not data.diet:
        score += 1

    # BP
    if data.bp:
        score += 2

    # Glucose
    if data.glucose:
        score += 5

    # Family history
    if data.family_direct:
        score += 5
    if data.family_indirect:
        score += 3

    # Female-specific
    if sex == "female" and data.female_specific is not None:
        if data.female_specific.gdm:
            score += 1
        if data.female_specific.birth_weight:
            score += 1
        if data.female_specific.pcos:
            score += 1

    return map_risk(score)


def map_risk(score):
    if score <= 10:
        return {"score": score, "risk_level": "Low", "probability": "1%", "color": "green", "cta": "Keep up the great work!"}
    elif score <= 14:
        return {"score": score, "risk_level": "Moderate", "probability": "15%", "color": "yellow", "cta": "View lifestyle improvement tips."}
    elif score <= 20:
        return {"score": score, "risk_level": "High", "probability": "33%", "color": "orange", "cta": "Schedule an HbA1c blood test."}
    else:
        return {"score": score, "risk_level": "Very High", "probability": "50%+", "color": "red", "cta": "Urgent: Consult your GP this week."}