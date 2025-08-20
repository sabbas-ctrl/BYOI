import React, { useState } from "react";

export default function BYOIOrderForm1() {
  const [step, setStep] = useState(0);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    base: null,
    protein: null,
    mixins: [],
    sweetener: null,
    extraRich: false,
    consistency: null,
    pickupDate: ""
  });

  const [price, setPrice] = useState(0);

  const bases = [
    { label: "Classic Dairy Base", price: 200 },
    { label: "Almond Milk Base", price: 250 },
    { label: "Coconut Cream Base", price: 270 }
  ];

  const proteins = [
    { label: "Whey Protein", price: 150 },
    { label: "Soy Protein", price: 120 },
    { label: "No Protein", price: 0 }
  ];

  const mixins = [
    { label: "Chocolate Chips", price: 50 },
    { label: "Strawberries", price: 70 },
    { label: "Brownie Chunks", price: 100 },
    { label: "Cookie Dough", price: 80 }
  ];

  const sweeteners = [
    { label: "Sugar", price: 20 },
    { label: "Honey", price: 40 },
    { label: "Stevia", price: 30 },
    { label: "Date Syrup", price: 50 },
    { label: "No Sweetener", price: 0 }
  ];

  const consistencies = [
    { label: "Scoop Style – Thick and Firm", desc: "Traditional ice cream experience", price: 0 },
    { label: "Soft Serve – Smooth & Airy", desc: "Creamy modern texture", price: 0 }
  ];

  const steps = [
    { key: "name", title: "What’s your name?", type: "input" },
    { key: "email", title: "Enter your email", type: "input" },
    { key: "phone", title: "Your phone number", type: "input" },
    { key: "base", title: "Select a Base", type: "options", options: bases },
    { key: "protein", title: "Choose Milk Protein", type: "options", options: proteins },
    { key: "mixins", title: "Pick Mix-Ins", type: "multi", options: mixins },
    { key: "sweetener", title: "How should we sweeten it?", type: "options", options: sweeteners },
    { key: "extraRich", title: "Make it extra rich? (+100) ", type: "toggle", price: 100 },
    { key: "consistency", title: "Which consistency do you prefer?", type: "optionsWithDesc", options: consistencies },
    { key: "pickupDate", title: "Select pickup date", type: "date" },
    { key: "confirm", title: "Confirm Order", type: "summary" }
  ];

  const handleNext = () => setStep((s) => Math.min(s + 1, steps.length - 1));
  const handlePrev = () => setStep((s) => Math.max(s - 1, 0));

  const toggleMixin = (option) => {
    const exists = formData.mixins.includes(option.label);
    const newMixins = exists
      ? formData.mixins.filter((m) => m !== option.label)
      : [...formData.mixins, option.label];

    setFormData({ ...formData, mixins: newMixins });
  };

  const calculatePrice = () => {
    let total = 0;
    if (formData.base) total += bases.find((b) => b.label === formData.base).price;
    if (formData.protein) total += proteins.find((p) => p.label === formData.protein).price;
    if (formData.sweetener) total += sweeteners.find((s) => s.label === formData.sweetener).price;
    if (formData.extraRich) total += 100;
    formData.mixins.forEach((m) => (total += mixins.find((mi) => mi.label === m).price));
    return total;
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-orange-400 to-yellow-300 p-6">
      <div className="bg-white w-full max-w-lg rounded-2xl shadow-xl p-8">
        <h2 className="text-2xl font-bold text-center mb-4 text-orange-600">{steps[step].title}</h2>

        {/* Render Step */}
        {steps[step].type === "input" && (
          <input
            type="text"
            value={formData[steps[step].key]}
            onChange={(e) => setFormData({ ...formData, [steps[step].key]: e.target.value })}
            className="w-full border rounded-lg p-3"
            placeholder={steps[step].title}
          />
        )}

        {steps[step].type === "options" && (
          <div className="space-y-3">
            {steps[step].options.map((opt) => (
              <button
                key={opt.label}
                onClick={() => setFormData({ ...formData, [steps[step].key]: opt.label })}
                className={`w-full p-3 rounded-lg border text-left ${formData[steps[step].key] === opt.label ? "bg-orange-200 border-orange-500" : "bg-gray-50"}`}
              >
                {opt.label} <span className="float-right font-semibold">+{opt.price}</span>
              </button>
            ))}
          </div>
        )}

        {steps[step].type === "multi" && (
          <div className="space-y-3">
            {steps[step].options.map((opt) => (
              <label key={opt.label} className="flex items-center gap-3 border p-3 rounded-lg cursor-pointer hover:bg-orange-50">
                <input
                  type="checkbox"
                  checked={formData.mixins.includes(opt.label)}
                  onChange={() => toggleMixin(opt)}
                />
                <span>{opt.label} (+{opt.price})</span>
              </label>
            ))}
          </div>
        )}

        {steps[step].type === "toggle" && (
          <label className="flex items-center gap-3 cursor-pointer">
            <input
              type="checkbox"
              checked={formData.extraRich}
              onChange={(e) => setFormData({ ...formData, extraRich: e.target.checked })}
            />
            Yes, make it rich (+100)
          </label>
        )}

        {steps[step].type === "optionsWithDesc" && (
          <div className="space-y-3">
            {steps[step].options.map((opt) => (
              <button
                key={opt.label}
                onClick={() => setFormData({ ...formData, consistency: opt.label })}
                className={`w-full p-3 rounded-lg border text-left ${formData.consistency === opt.label ? "bg-orange-200 border-orange-500" : "bg-gray-50"}`}
              >
                <div className="font-semibold">{opt.label}</div>
                <div className="text-sm text-gray-600">{opt.desc}</div>
              </button>
            ))}
          </div>
        )}

        {steps[step].type === "date" && (
          <input
            type="date"
            value={formData.pickupDate}
            onChange={(e) => setFormData({ ...formData, pickupDate: e.target.value })}
            className="w-full border rounded-lg p-3"
          />
        )}

        {steps[step].type === "summary" && (
          <div className="space-y-2">
            <p><strong>Name:</strong> {formData.name}</p>
            <p><strong>Email:</strong> {formData.email}</p>
            <p><strong>Phone:</strong> {formData.phone}</p>
            <p><strong>Base:</strong> {formData.base}</p>
            <p><strong>Protein:</strong> {formData.protein}</p>
            <p><strong>Mixins:</strong> {formData.mixins.join(", ")}</p>
            <p><strong>Sweetener:</strong> {formData.sweetener}</p>
            <p><strong>Extra Rich:</strong> {formData.extraRich ? "Yes" : "No"}</p>
            <p><strong>Consistency:</strong> {formData.consistency}</p>
            <p><strong>Pickup Date:</strong> {formData.pickupDate}</p>
            <hr />
            <p className="text-lg font-bold">Total Price: Rs {calculatePrice()}</p>
          </div>
        )}

        {/* Nav Buttons */}
        <div className="flex justify-between mt-6">
          {step > 0 && <button onClick={handlePrev} className="px-4 py-2 rounded-lg bg-gray-200">Previous</button>}
          {step < steps.length - 1 && <button onClick={handleNext} className="px-4 py-2 rounded-lg bg-orange-500 text-white">Next</button>}
        </div>
      </div>
    </div>
  );
}
