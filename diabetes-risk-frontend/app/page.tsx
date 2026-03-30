"use client";

import { useState } from "react";

export default function Home() {

  const [step, setStep] = useState(1);
const [form, setForm] = useState({
  name:"",
  email: "",
  age_group: "",
  sex: "",
  height: "",
  weight: "",
  bmi: 0 as number,
  waist: "",
  activity: "",
  diet: "",
  bp: "",
  glucose: "",
  family_direct: "",
  family_indirect: "",
  gdm: "",
  birth_weight: "",
  pcos: "",
});

const [result, setResult] = useState<any>(null);

const handleSubmit = async () => {
  const payload = {
    name: form.name,
    email: form.email,
    age_group: form.age_group,
    sex: form.sex,
    bmi: Number(form.bmi),
    height: Number(form.height),
    waist: Number(form.waist),
    activity: form.activity === "yes",
    diet: form.diet === "yes",
    bp: form.bp === "yes",
    glucose: form.glucose === "yes",
    family_direct: form.family_direct === "yes",
    family_indirect: form.family_indirect === "yes",
female_specific:
  form.sex === "female"
    ? {
        gdm: form.gdm === "yes",
        birth_weight: form.birth_weight === "yes",
        pcos: form.pcos === "yes",
      }
    : null,
  };


  try {
    console.log("Sending request...");  

    const res = await fetch("http://127.0.0.1:8000/assess-risk", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });

    console.log("Response received:", res);  

    const data = await res.json();

    console.log("API DATA:", data);
    
if (data.message === "User already exists") {
  alert("User already exists!");

  setResult(null);  
  return;
}

    setResult(data);

  } catch (error) {
    console.error("FETCH ERROR:", error);  
  }
};

const handleRestart = () => {
  setForm({
  name: "",
  email: "",
  age_group: "",
  sex: "",
  height: "",
  weight: "",
  bmi: 0,
  waist: "",
  activity: "",
  diet: "",
  bp: "",
  glucose: "",
  family_direct: "",
  family_indirect: "",
  gdm: "",
  birth_weight: "",
  pcos: "",
  });

  setResult(null);
  setStep(1);
};
const handleChange = (name: string, value: any) => {
  const updatedForm = { ...form, [name]: value };

  if (name === "height" || name === "weight") {
    const bmi = calculateBMI(
      Number(updatedForm.height),
      Number(updatedForm.weight)
    );
    updatedForm.bmi = bmi;
  }

  setForm(updatedForm);
};

const calculateBMI = (height: number, weight: number) => {
  if (!height || !weight) return 0;

  const heightInMeters = height / 100;
  return Number(
  (weight / (heightInMeters * heightInMeters)).toFixed(1)
);
};

function Toggle({
  label,
  name,
  value,
  onChange,
  yesLabel = "Yes",          
  noLabel = "No",            
}: any) {
  return (
    <div className="mb-4">
      <p className="mb-2 font-medium">{label}</p>
      <div className="flex gap-2">
        <button
          type="button"
          className={`px-4 py-2 rounded ${
            value === "yes" ? "bg-green-500 text-white" : "bg-gray-200"
          }`}
          onClick={() => onChange(name, "yes")}
        >
          {yesLabel}
        </button>

        <button
          type="button"
          className={`px-4 py-2 rounded ${
            value === "no" ? "bg-red-500 text-white" : "bg-gray-200"
          }`}
          onClick={() => onChange(name, "no")}
        >
          {noLabel}
        </button>
      </div>
    </div>
  );
}

const isStepValid = () => {
  if (step === 1) {
    return (
      form.name &&
      form.email &&
      form.age_group &&
      form.sex
    );
  }

  if (step === 2) {
    return (
      form.height &&
      form.weight &&
      form.waist
    );
  }

  if (step === 3) {
    return form.activity && form.diet;
  }

  if (step === 4) {
    return (
      form.bp &&
      form.glucose &&
      form.family_direct &&
      form.family_indirect
    );
  }

  if (step === 5 && form.sex === "female") {
    return form.gdm && form.birth_weight && form.pcos;
  }

  return true;
};
  return (
<main className="min-h-screen flex items-start justify-center bg-gray-50 p-6 pt-32">        {/*  HEADER */}
<div className="w-full fixed top-0 left-0 z-50 bg-white/70 backdrop-blur-md border-b border-gray-200">  <div className="max-w-5xl mx-auto flex justify-between items-center px-6 py-3">
<img 
  src="/logo1.png"
  alt="OneHealth"
  className="h-16 object-contain"
/>

<img 
  src="/logo2.png"
  alt="CareCon"
  className="h-20 object-contain"
/>
</div>
</div>
      <div className="bg-white shadow-xl rounded-2xl p-8 w-full max-w-md transition-all">
        <h1 className="text-2xl font-bold mb-6 text-center">
          Diabetes Risk Assessment
        </h1>

        <div className="flex justify-between mb-6">
  {[1, 2, 3, 4, ...(form.sex === "female" ? [5] : [])].map((s) => (
    <div
      key={s}
      className={`h-2 flex-1 mx-1 rounded ${
        step >= s ? "bg-blue-600" : "bg-gray-200"
      }`}
    />
  ))}
</div>

{step === 1 && (
  <>
    <h2 className="text-lg font-semibold mb-4">Basic Info</h2>

<input
  type="text"
  placeholder="Enter your name"
  onChange={(e) => handleChange("name", e.target.value)}
  className="w-full mb-4 p-2 border rounded"
/>

<input
  type="email"
  placeholder="Enter your email"
  onChange={(e) => handleChange("email", e.target.value)}
  className="w-full mb-4 p-3 border rounded-lg"
/>
    <select
      onChange={(e) => handleChange("age_group", e.target.value)}
      className="w-full mb-4 p-2 border rounded"
    >
      <option value="">Select Age</option>
      <option value="<45">Below 45</option>
      <option value="45-54">45–54</option>
      <option value="55-64">55–64</option>
      <option value=">64">Above 64</option>
    </select>

    <select
      onChange={(e) => handleChange("sex", e.target.value)}
      className="w-full mb-4 p-2 border rounded"
    >
      <option value="">Select Gender</option>
      <option value="male">Male</option>
      <option value="female">Female</option>
    </select>

   <button
onClick={async () => {
  if (!isStepValid()) {
    alert("Please fill all fields before proceeding");
    return;
  }

  try {
    const res = await fetch(
      `http://127.0.0.1:8000/check-email?email=${form.email}`
    );

    const data = await res.json();

    if (data.exists) {
      alert("User already exists!");
      return; 
    }


    setStep(2);

  } catch (error) {
    console.error("Email check failed:", error);
    alert("Server error. Try again.");
  }
}}
  className="btn"
>
  Next
</button>
  </>
)}

{step === 2 && (
  <>
    <h2 className="text-lg font-semibold mb-4">Body Metrics</h2>

<input
  type="number"
  placeholder="Height (cm)"
  onChange={(e) => handleChange("height", e.target.value)}
  className="w-full mb-4 p-2 border rounded"
/>

<input
  type="number"
  placeholder="Weight (kg)"
  onChange={(e) => handleChange("weight", e.target.value)}
  className="w-full mb-4 p-2 border rounded"
/>

{/* BMI Display */}
<div className="mb-4 p-3 bg-gray-100 rounded text-center">
  <p className="text-sm text-gray-600">Calculated BMI</p>
  <p className="text-xl font-bold">{form.bmi || "--"}</p>
</div>

    <input
      type="number"
      placeholder="Waist (cm)"
      onChange={(e) => handleChange("waist", e.target.value)}
      className="w-full mb-4 p-2 border rounded"
    />
  
  <div className="mb-4 p-3 bg-gray-100 rounded text-center">
  <p className="text-sm text-gray-600">Waist-to-Height Ratio</p>
  <p className="text-xl font-bold">
    {form.height && form.waist && Number(form.height) > 0
      ? (Number(form.waist) / Number(form.height)).toFixed(2)
      : "--"}
  </p>
</div>

    <div className="flex gap-2">
      <button onClick={() => setStep(1)} className="btn-secondary">
        Back
      </button>
<button
  onClick={() => {
    if (!isStepValid()) {
      alert("Please fill all fields");
      return;
    }
    setStep(3);
  }}
  className="btn"
>
  Next
</button>
    </div>
  </>
)}

{step === 3 && (
  <>
    <h2 className="text-lg font-semibold mb-4">Lifestyle</h2>

    <Toggle label="Do you typically perform at least 30 minutes of physical activity daily?" name="activity" value={form.activity} onChange={handleChange} />
   <Toggle
  label="How often do you consume vegetables, fruits, or berries?"
  name="diet"
  value={form.diet}
  onChange={handleChange}
  yesLabel="Everyday"            
  noLabel="Not Everyday"         
/>
    <div className="flex gap-2">
      <button onClick={() => setStep(2)} className="btn-secondary">
        Back
      </button>
<button
  onClick={() => {
    if (!isStepValid()) {
      alert("Please answer all questions");
      return;
    }
    setStep(4);
  }}
  className="btn"
>
  Next
</button>
    </div>
  </>
)}

{step === 4 && (
  <>
    <h2 className="text-lg font-semibold mb-4">Medical</h2>

    <Toggle label="Have you ever been diagnosed with High Blood Pressure or taken BP medication?" name="bp" value={form.bp} onChange={handleChange} />
    <Toggle label="Have you ever been told by a doctor that your blood sugar is high (e.g., during a checkup)?" name="glucose" value={form.glucose} onChange={handleChange} />
    <Toggle label="Have your parents or siblings (1st degree) been diagnosed with Type 1 or Type 2 Diabetes?" name="family_direct" value={form.family_direct} onChange={handleChange} />
    <Toggle label="Have your grandparents, aunts, uncles, or first cousins been diagnosed with Diabetes?" name="family_indirect" value={form.family_indirect} onChange={handleChange} />

    <div className="flex gap-2">
      <button onClick={() => setStep(3)} className="btn-secondary">
        Back
      </button>
<button
onClick={() => {
  if (!isStepValid()) {
    alert("Please complete all medical questions");
    return;
  }

  if (form.sex === "female") {
    setStep(5);
  } else {
    handleSubmit();
  }
}}
  className="btn"
>
  {form.sex === "female" ? "Next" : "Calculate"}
</button>
    </div>
  </>
)}

{step === 5 && form.sex === "female" && (
  <>
    <h2 className="text-lg font-semibold mb-4">
      Female Health History
    </h2>

    <Toggle
      label="Did you develop high blood sugar during a pregnancy (Gestational Diabetes)?"
      name="gdm"
      value={form.gdm}
      onChange={handleChange}
    />

    <Toggle
      label="Have you ever given birth to a baby weighing more than 9 lbs (4.1 kg)?"
      name="birth_weight"
      value={form.birth_weight}
      onChange={handleChange}
    />

    <Toggle
      label="Have you been diagnosed with Polycystic Ovary Syndrome (PCOS)?"
      name="pcos"
      value={form.pcos}
      onChange={handleChange}
    />

    <div className="flex gap-2">
      <button
        onClick={() => setStep(4)}
        className="btn-secondary"
      >
        Back
      </button>

      <button
        onClick={handleSubmit}
        className="btn"
      >
        Calculate
      </button>
    </div>
  </>
)}
{result && (
  <div
    className={`mt-6 p-6 rounded-xl shadow-lg text-white transition-all ${
      result.color === "green"
        ? "bg-green-500"
        : result.color === "yellow"
        ? "bg-yellow-500"
        : result.color === "orange"
        ? "bg-orange-500"
        : "bg-red-500"
    }`}
  >
    <h2 className="text-2xl font-bold mb-2 text-center">
      {result.risk_level} Risk
    </h2>

    <p className="text-center text-lg mb-2">
      Score: <span className="font-bold">{result.score}</span>
    </p>

    <p className="text-center text-lg mb-4">
      Probability: <span className="font-bold">{result.probability}</span>
    </p>

    <div className="bg-white text-black p-3 rounded-lg text-center font-medium">
      {result.cta}
    </div>

    <button
  onClick={handleRestart}
  className="w-full mt-4 bg-gray-800 hover:bg-gray-900 text-white p-2 rounded"
>
  Restart Assessment
</button>
  </div>
  
)}

<style jsx>{`
  .btn {
    background: #2563eb;
    color: white;
    padding: 10px;
    border-radius: 10px;
    width: 100%;
  }

  .btn:hover {
    background: #1d4ed8;
  }

  .btn-secondary {
    background: #e5e7eb;
    padding: 10px;
    border-radius: 10px;
    width: 100%;
  }
`}</style>
      </div>
    </main>
  );
}