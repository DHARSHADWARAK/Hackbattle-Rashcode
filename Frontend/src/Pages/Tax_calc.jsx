import React, { useState, useEffect } from "react";
import Navbar from "../components/Navbar";

// Simplified Indian Tax Slabs
const TAX_SLABS = {
  old: [
    { min: 0, max: 250000, rate: 0 },
    { min: 250000, max: 500000, rate: 0.05 },
    { min: 500000, max: 1000000, rate: 0.20 },
    { min: 1000000, max: Infinity, rate: 0.30 }
  ],
  new: [
    { min: 0, max: 300000, rate: 0 },
    { min: 300000, max: 600000, rate: 0.05 },
    { min: 600000, max: 900000, rate: 0.10 },
    { min: 900000, max: 1200000, rate: 0.15 },
    { min: 1200000, max: 1500000, rate: 0.20 },
    { min: 1500000, max: Infinity, rate: 0.30 }
  ]
};

// For auto-detecting category based on description
const KEYWORDS = {
  "Salary/Employment": ["salary", "wage", "employer"],
  "Business/Professional": ["business", "freelance", "consultant"],
  "Capital Gains": ["sale", "capital", "asset"],
  "House Property": ["rent", "property", "house"]
};

const IncomeStreamForm = ({ stream, onUpdate, onClassify }) => {
  const [description, setDescription] = useState(stream.description);

  // Auto-classify if description is long enough and no final category chosen yet
  useEffect(() => {
    if (!stream.category && description.length > 3) {
      const timeout = setTimeout(() => {
        onClassify(stream.id, description);
      }, 500);
      return () => clearTimeout(timeout);
    }
  }, [description, stream.category, stream.id, onClassify]);

  // Reset category if description is changed after one was set
  useEffect(() => {
    if (stream.category && stream.description !== description) {
      onUpdate({ ...stream, category: null });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [description]);

  return (
    
    <div className="mb-4">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <input
          type="number"
          min="0"
          value={stream.amount}
          onChange={(e) =>
            onUpdate({ ...stream, amount: Number(e.target.value) })
          }
          className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500 outline-none"
          placeholder="Amount (₹)"
        />
        <select
          value={stream.frequency}
          onChange={(e) =>
            onUpdate({ ...stream, frequency: e.target.value })
          }
          className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500 outline-none"
        >
          <option value="yearly">Yearly</option>
          <option value="monthly">Monthly</option>
        </select>
        <input
          type="text"
          value={description}
          onChange={(e) => {
            setDescription(e.target.value);
            onUpdate({ ...stream, description: e.target.value });
          }}
          className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500 outline-none md:col-span-2"
          placeholder="Income description"
        />
      </div>
      {/* For Business/Professional income, allow entry of an expense deduction percentage */}
      {(stream.category === "Business/Professional") && (
        <div className="mt-2">
          <label className="block text-gray-700 mb-1">
            Expense Deduction (%) for Business Income
          </label>
          <input
            type="number"
            min="0"
            max="100"
            value={stream.expenseDeductionPercent || 0}
            onChange={(e) =>
              onUpdate({
                ...stream,
                expenseDeductionPercent: Number(e.target.value)
              })
            }
            className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500 outline-none"
            placeholder="e.g., 50"
          />
          <small className="text-gray-500">
            Enter the percentage of your income to be deducted as expenses.
          </small>
        </div>
      )}
    </div>
  );
};

const CategoryQuestionnaire = ({ onSelect, suggestedCategory }) => {
  const questions = [
    {
      text: "Is this income received regularly from an employer?",
      category: "Salary/Employment"
    },
    {
      text: "Is this income related to self-employment or a business?",
      category: "Business/Professional"
    },
    {
      text: "Is this a one-time gain from selling an asset?",
      category: "Capital Gains"
    },
    {
      text: "Does this income come from renting property?",
      category: "House Property"
    }
  ];

  const [currentQuestion, setCurrentQuestion] = useState(0);

  const handleAnswer = (answer) => {
    if (answer) {
      onSelect(questions[currentQuestion].category);
    } else if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    } else {
      onSelect("Other Sources");
    }
  };

  return (
    <div className="bg-white p-4 rounded-lg shadow border border-gray-200 mt-2">
      <p className="mb-3 text-gray-700 font-medium">
        {questions[currentQuestion].text}
      </p>
      <div className="flex gap-2">
        <button
          onClick={() => handleAnswer(true)}
          className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition-colors"
        >
          Yes
        </button>
        <button
          onClick={() => handleAnswer(false)}
          className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition-colors"
        >
          No
        </button>
      </div>
      <p className="mt-3 text-sm text-gray-500">
        Suggested: <span className="font-semibold">{suggestedCategory}</span>
      </p>
    </div>
  );
};

const DeductionsInfo = () => {
  return (
    <div className="mt-4 p-4 bg-gray-50 border rounded">
      <h3 className="text-lg font-bold mb-2">
        Indian Income Tax Deductions & Exemptions – Details
      </h3>
      <p className="text-sm text-gray-700">
        This calculator now factors in exemptions (e.g., HRA, LTA, Gratuity,
        PF withdrawals, Capital Gains Exemptions, etc.) and deductions (e.g.,
        Section 80C, 80D, etc.). Under the <strong>New Regime</strong>, these are
        not applicable and are ignored (except for a rebate under Section 87A).
      </p>
    </div>
  );
};

const TaxCalculator = () => {
  // Steps: streamCount -> streamDetails -> exemptions -> deductions -> regimeSelection -> results
  const [step, setStep] = useState("streamCount");
  const [streamCount, setStreamCount] = useState(1);
  const [incomeStreams, setIncomeStreams] = useState([]);
  const [activeStream, setActiveStream] = useState(null);
  const [taxRegime, setTaxRegime] = useState("new");
  const [showDeductionsInfo, setShowDeductionsInfo] = useState(false);

  // Deductions (reduce taxable income)
  const [deductions, setDeductions] = useState({
    standard: 0,
    section80C: 0,
    section80CCD1B: 0,
    homeLoanInterest: 0,
    section80EE: 0,
    section80EEA: 0,
    section80EEB: 0,
    section80D: 0,
    section80DD: 0,
    section80DDB: 0,
    section80U: 0,
    section80E: 0,
    section80G: 0,
    section80GGA: 0,
    section80GGC: 0,
    section80TTA: 0,
    section80TTB: 0,
    section80RRB: 0,
    section80QQB: 0,
    other: 0
  });

  // Exemptions (income not included in taxable income)
  const [exemptions, setExemptions] = useState({
    // For HRA calculation:
    basicSalary: 0,
    hraReceived: 0,
    rentPaid: 0,
    cityType: "metro",
    computedHRA: 0,
    // Other exemptions:
    lta: 0,
    gratuity: 0,
    pf: 0,
    vrs: 0,
    commutation: 0,
    leaveEncashment: 0,
    agriculturalIncome: 0,
    gifts: 0,
    ppfInterest: 0,
    capitalGainsExemptions: 0
  });

  // Re-calculate HRA exemption whenever related fields change
  useEffect(() => {
    const salary = Number(exemptions.basicSalary);
    const hra = Number(exemptions.hraReceived);
    const rent = Number(exemptions.rentPaid);
    const cityPercent = exemptions.cityType === "metro" ? 0.5 : 0.4;
    const option2 = salary * cityPercent;
    const option3 = Math.max(rent - 0.1 * salary, 0);
    const computedHRA = Math.min(hra, option2, option3);
    if (computedHRA !== exemptions.computedHRA) {
      setExemptions((prev) => ({ ...prev, computedHRA }));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    exemptions.basicSalary,
    exemptions.hraReceived,
    exemptions.rentPaid,
    exemptions.cityType
  ]);

  // Initialize income streams when moving to "streamDetails"
  useEffect(() => {
    if (step === "streamDetails" && incomeStreams.length === 0) {
      setIncomeStreams(
        Array.from({ length: streamCount }).map(() => ({
          id: Math.random(),
          amount: 0,
          description: "",
          frequency: "yearly",
          category: null,
          suggestedCategory: "Other Sources",
          expenseDeductionPercent: 0
        }))
      );
    }
  }, [step, streamCount, incomeStreams.length]);

  const classifyCategory = (streamId, description) => {
    const matched = Object.entries(KEYWORDS).find(([cat, words]) =>
      words.some((word) => description.toLowerCase().includes(word))
    );
    const matchedCategory = matched ? matched[0] : "Other Sources";
    setIncomeStreams((streams) =>
      streams.map((stream) =>
        stream.id === streamId
          ? { ...stream, suggestedCategory: matchedCategory }
          : stream
      )
    );
    setActiveStream(streamId);
  };

  const handleStreamUpdate = (updatedStream) => {
    setIncomeStreams((streams) =>
      streams.map((stream) =>
        stream.id === updatedStream.id ? updatedStream : stream
      )
    );
  };

  // Calculate final tax:
  // 1. Sum income streams (for Business income, subtract expense deduction)
  const totalIncome = incomeStreams.reduce((sum, stream) => {
    const factor = stream.frequency === "monthly" ? 12 : 1;
    let streamAmount = stream.amount * factor;
    if (stream.category === "Business/Professional") {
      const deductionPercent = stream.expenseDeductionPercent || 0;
      streamAmount = streamAmount * (1 - deductionPercent / 100);
    }
    return sum + streamAmount;
  }, 0);

  // Sum deductions and exemptions from user input
  const totalDeductions = Object.values(deductions).reduce(
    (acc, val) => acc + Number(val),
    0
  );
  const totalExemptions =
    Number(exemptions.computedHRA) +
    Number(exemptions.lta) +
    Number(exemptions.gratuity) +
    Number(exemptions.pf) +
    Number(exemptions.vrs) +
    Number(exemptions.commutation) +
    Number(exemptions.leaveEncashment) +
    Number(exemptions.agriculturalIncome) +
    Number(exemptions.gifts) +
    Number(exemptions.ppfInterest) +
    Number(exemptions.capitalGainsExemptions);

  // For the New Regime, all exemptions/deductions are ignored.
  let taxableIncome =
    taxRegime === "new"
      ? totalIncome
      : Math.max(totalIncome - totalExemptions - totalDeductions, 0);

  // Calculate tax using slab rates
  let tax = 0;
  const slabs = TAX_SLABS[taxRegime];
  for (const slab of slabs) {
    if (taxableIncome > slab.min) {
      const incomeInSlab = Math.min(taxableIncome, slab.max) - slab.min;
      tax += incomeInSlab * slab.rate;
    }
  }
  // Add 4% cess on the computed tax
  tax += tax * 0.04;

  // Under the New Regime, if income is ≤ ₹7,00,000, apply a rebate of up to ₹12,500
  if (taxRegime === "new" && taxableIncome <= 700000) {
    tax = Math.max(tax - 12500, 0);
  }

  return (
    <>
    <Navbar/>
    <div className="max-w-4xl mx-auto p-5 min-h-screen">
      {/* STEP 1: Number of Income Streams */}
      {step === "streamCount" && (
        <div className="bg-white p-8 rounded-xl shadow border border-gray-200">
          <h2 className="text-2xl font-bold mb-6 text-gray-800">
            How many income streams do you have?
          </h2>
          <input
            type="number"
            min="1"
            value={streamCount}
            onChange={(e) =>
              setStreamCount(Math.max(1, Number(e.target.value)))
            }
            className="w-full p-3 border rounded-lg mb-6 focus:ring-2 focus:ring-blue-500 outline-none"
          />
          <button
            onClick={() => setStep("streamDetails")}
            className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition-colors font-medium"
          >
            Continue
          </button>
        </div>
      )}

      {/* STEP 2: Income Stream Details */}
      {step === "streamDetails" && (
        <div className="bg-white p-8 rounded-xl shadow border border-gray-200">
          <h2 className="text-2xl font-bold mb-8 text-gray-800">
            Enter Income Details
          </h2>
          {incomeStreams.map((stream) => (
            <div key={stream.id} className="mb-6">
              <IncomeStreamForm
                stream={stream}
                onUpdate={handleStreamUpdate}
                onClassify={classifyCategory}
              />
              {activeStream === stream.id && !stream.category && (
                <CategoryQuestionnaire
                  onSelect={(cat) => {
                    handleStreamUpdate({ ...stream, category: cat });
                    setActiveStream(null);
                  }}
                  suggestedCategory={stream.suggestedCategory}
                />
              )}
            </div>
          ))}
          <button
            onClick={() => setStep("exemptions")}
            className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition-colors font-medium"
          >
            Next: Enter Exemptions
          </button>
        </div>
      )}

      {/* STEP 3: Exemptions */}
      {step === "exemptions" && (
        <div className="bg-white p-8 rounded-xl shadow border border-gray-200">
          <h2 className="text-2xl font-bold mb-4 text-gray-800">
            Enter Your Exemptions
          </h2>
          <p className="text-gray-600 mb-6">
            Provide details for salary components and other incomes that are
            exempt from tax.
          </p>
          {/* HRA Exemption Calculation */}
          <div className="mb-6">
            <h3 className="text-xl font-bold text-gray-800 mb-2">
              House Rent Allowance (HRA)
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-gray-700">
                  Basic Salary (₹)
                </label>
                <input
                  type="number"
                  min="0"
                  value={exemptions.basicSalary}
                  onChange={(e) =>
                    setExemptions({
                      ...exemptions,
                      basicSalary: e.target.value
                    })
                  }
                  className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500 outline-none"
                  placeholder="e.g., 500000"
                />
              </div>
              <div>
                <label className="block text-gray-700">
                  HRA Received (₹)
                </label>
                <input
                  type="number"
                  min="0"
                  value={exemptions.hraReceived}
                  onChange={(e) =>
                    setExemptions({
                      ...exemptions,
                      hraReceived: e.target.value
                    })
                  }
                  className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500 outline-none"
                  placeholder="e.g., 200000"
                />
              </div>
              <div>
                <label className="block text-gray-700">
                  Rent Paid (₹)
                </label>
                <input
                  type="number"
                  min="0"
                  value={exemptions.rentPaid}
                  onChange={(e) =>
                    setExemptions({
                      ...exemptions,
                      rentPaid: e.target.value
                    })
                  }
                  className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500 outline-none"
                  placeholder="e.g., 180000"
                />
              </div>
              <div>
                <label className="block text-gray-700">City Type</label>
                <select
                  value={exemptions.cityType}
                  onChange={(e) =>
                    setExemptions({ ...exemptions, cityType: e.target.value })
                  }
                  className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500 outline-none"
                >
                  <option value="metro">Metro (50%)</option>
                  <option value="non-metro">Non-Metro (40%)</option>
                </select>
              </div>
            </div>
            <p className="mt-2 text-gray-700">
              Computed HRA Exemption: ₹
              {Number(exemptions.computedHRA).toLocaleString()}
            </p>
          </div>
          {/* Other Exemptions */}
          <div className="mb-6">
            <h3 className="text-xl font-bold text-gray-800 mb-2">
              Other Exemptions
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-gray-700">
                  Leave Travel Allowance (LTA) (₹)
                </label>
                <input
                  type="number"
                  min="0"
                  value={exemptions.lta}
                  onChange={(e) =>
                    setExemptions({ ...exemptions, lta: e.target.value })
                  }
                  className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500 outline-none"
                  placeholder="e.g., 50000"
                />
              </div>
              <div>
                <label className="block text-gray-700">Gratuity (₹)</label>
                <input
                  type="number"
                  min="0"
                  value={exemptions.gratuity}
                  onChange={(e) =>
                    setExemptions({ ...exemptions, gratuity: e.target.value })
                  }
                  className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500 outline-none"
                  placeholder="e.g., 200000"
                />
              </div>
              <div>
                <label className="block text-gray-700">
                  PF Withdrawals (₹)
                </label>
                <input
                  type="number"
                  min="0"
                  value={exemptions.pf}
                  onChange={(e) =>
                    setExemptions({ ...exemptions, pf: e.target.value })
                  }
                  className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500 outline-none"
                  placeholder="e.g., 100000"
                />
              </div>
              <div>
                <label className="block text-gray-700">
                  Voluntary Retirement Scheme (VRS) (₹)
                </label>
                <input
                  type="number"
                  min="0"
                  value={exemptions.vrs}
                  onChange={(e) =>
                    setExemptions({ ...exemptions, vrs: e.target.value })
                  }
                  className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500 outline-none"
                  placeholder="e.g., 500000"
                />
              </div>
              <div>
                <label className="block text-gray-700">
                  Commutation of Pension (₹)
                </label>
                <input
                  type="number"
                  min="0"
                  value={exemptions.commutation}
                  onChange={(e) =>
                    setExemptions({ ...exemptions, commutation: e.target.value })
                  }
                  className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500 outline-none"
                  placeholder="e.g., 50000"
                />
              </div>
              <div>
                <label className="block text-gray-700">
                  Leave Encashment (₹)
                </label>
                <input
                  type="number"
                  min="0"
                  value={exemptions.leaveEncashment}
                  onChange={(e) =>
                    setExemptions({ ...exemptions, leaveEncashment: e.target.value })
                  }
                  className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500 outline-none"
                  placeholder="e.g., 30000"
                />
              </div>
              <div>
                <label className="block text-gray-700">
                  Agricultural Income (₹)
                </label>
                <input
                  type="number"
                  min="0"
                  value={exemptions.agriculturalIncome}
                  onChange={(e) =>
                    setExemptions({ ...exemptions, agriculturalIncome: e.target.value })
                  }
                  className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500 outline-none"
                  placeholder="e.g., 100000"
                />
              </div>
              <div>
                <label className="block text-gray-700">
                  Gifts from Relatives (₹)
                </label>
                <input
                  type="number"
                  min="0"
                  value={exemptions.gifts}
                  onChange={(e) =>
                    setExemptions({ ...exemptions, gifts: e.target.value })
                  }
                  className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500 outline-none"
                  placeholder="e.g., 50000"
                />
              </div>
              <div>
                <label className="block text-gray-700">
                  Interest on PPF (₹)
                </label>
                <input
                  type="number"
                  min="0"
                  value={exemptions.ppfInterest}
                  onChange={(e) =>
                    setExemptions({ ...exemptions, ppfInterest: e.target.value })
                  }
                  className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500 outline-none"
                  placeholder="e.g., 20000"
                />
              </div>
              <div>
                <label className="block text-gray-700">
                  Capital Gains Exemptions (₹)
                </label>
                <input
                  type="number"
                  min="0"
                  value={exemptions.capitalGainsExemptions}
                  onChange={(e) =>
                    setExemptions({ ...exemptions, capitalGainsExemptions: e.target.value })
                  }
                  className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500 outline-none"
                  placeholder="e.g., 50000"
                />
              </div>
            </div>
          </div>
          <button
            onClick={() => setStep("deductions")}
            className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition-colors font-medium"
          >
            Next: Enter Deductions
          </button>
        </div>
      )}

      {/* STEP 4: Deductions */}
      {step === "deductions" && (
        <div className="bg-white p-8 rounded-xl shadow border border-gray-200">
          <h2 className="text-2xl font-bold mb-4 text-gray-800">
            Enter Your Deductions
          </h2>
          <p className="text-gray-600 mb-6">
            Deductions reduce your taxable income. Fill in the amounts that apply.
          </p>
          {/* General Deductions */}
          <div className="mb-8">
            <h3 className="text-xl font-bold text-gray-800 mb-2">General Deductions</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-gray-700">
                  Standard Deduction (₹)
                </label>
                <input
                  type="number"
                  min="0"
                  value={deductions.standard}
                  onChange={(e) =>
                    setDeductions({ ...deductions, standard: e.target.value })
                  }
                  className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500 outline-none"
                  placeholder="e.g., 50000"
                />
                <small className="text-gray-500">
                  Often ₹50,000 for salaried individuals.
                </small>
              </div>
            </div>
          </div>
          {/* Investment Deductions */}
          <div className="mb-8">
            <h3 className="text-xl font-bold text-gray-800 mb-2">Investment Deductions</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-gray-700">
                  Section 80C (₹)
                </label>
                <input
                  type="number"
                  min="0"
                  value={deductions.section80C}
                  onChange={(e) =>
                    setDeductions({ ...deductions, section80C: e.target.value })
                  }
                  className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500 outline-none"
                  placeholder="Max ₹1.5 lakh"
                />
                <small className="text-gray-500">
                  Investments like life insurance, PPF, ELSS, etc.
                </small>
              </div>
              <div>
                <label className="block text-gray-700">
                  Section 80CCD(1B) (₹)
                </label>
                <input
                  type="number"
                  min="0"
                  value={deductions.section80CCD1B}
                  onChange={(e) =>
                    setDeductions({ ...deductions, section80CCD1B: e.target.value })
                  }
                  className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500 outline-none"
                  placeholder="Up to ₹50,000"
                />
                <small className="text-gray-500">
                  Additional NPS deduction.
                </small>
              </div>
            </div>
          </div>
          {/* Housing Deductions */}
          <div className="mb-8">
            <h3 className="text-xl font-bold text-gray-800 mb-2">Housing Deductions</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-gray-700">
                  Home Loan Interest (Section 24(b)) (₹)
                </label>
                <input
                  type="number"
                  min="0"
                  value={deductions.homeLoanInterest}
                  onChange={(e) =>
                    setDeductions({ ...deductions, homeLoanInterest: e.target.value })
                  }
                  className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500 outline-none"
                  placeholder="Up to ₹2 lakh"
                />
                <small className="text-gray-500">
                  Interest on home loan.
                </small>
              </div>
              <div>
                <label className="block text-gray-700">
                  Section 80EE (₹)
                </label>
                <input
                  type="number"
                  min="0"
                  value={deductions.section80EE}
                  onChange={(e) =>
                    setDeductions({ ...deductions, section80EE: e.target.value })
                  }
                  className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500 outline-none"
                  placeholder="Up to ₹50,000"
                />
                <small className="text-gray-500">
                  For first-time home buyers.
                </small>
              </div>
              <div>
                <label className="block text-gray-700">
                  Section 80EEA (₹)
                </label>
                <input
                  type="number"
                  min="0"
                  value={deductions.section80EEA}
                  onChange={(e) =>
                    setDeductions({ ...deductions, section80EEA: e.target.value })
                  }
                  className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500 outline-none"
                  placeholder="Up to ₹1.5 lakh"
                />
                <small className="text-gray-500">
                  For affordable housing.
                </small>
              </div>
              <div>
                <label className="block text-gray-700">
                  Section 80EEB (₹)
                </label>
                <input
                  type="number"
                  min="0"
                  value={deductions.section80EEB}
                  onChange={(e) =>
                    setDeductions({ ...deductions, section80EEB: e.target.value })
                  }
                  className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500 outline-none"
                  placeholder="Up to ₹1.5 lakh"
                />
                <small className="text-gray-500">
                  For EV loan interest.
                </small>
              </div>
            </div>
          </div>
          {/* Medical & Health Insurance */}
          <div className="mb-8">
            <h3 className="text-xl font-bold text-gray-800 mb-2">Medical & Health Insurance</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-gray-700">
                  Section 80D (₹)
                </label>
                <input
                  type="number"
                  min="0"
                  value={deductions.section80D}
                  onChange={(e) =>
                    setDeductions({ ...deductions, section80D: e.target.value })
                  }
                  className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500 outline-none"
                  placeholder="e.g., 25000"
                />
                <small className="text-gray-500">
                  Medical insurance premiums.
                </small>
              </div>
              <div>
                <label className="block text-gray-700">
                  Section 80DD (₹)
                </label>
                <input
                  type="number"
                  min="0"
                  value={deductions.section80DD}
                  onChange={(e) =>
                    setDeductions({ ...deductions, section80DD: e.target.value })
                  }
                  className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500 outline-none"
                  placeholder="For disabled dependents"
                />
                <small className="text-gray-500">
                  Up to ₹75,000 (or ₹1.25 lakh for severe disability).
                </small>
              </div>
              <div>
                <label className="block text-gray-700">
                  Section 80DDB (₹)
                </label>
                <input
                  type="number"
                  min="0"
                  value={deductions.section80DDB}
                  onChange={(e) =>
                    setDeductions({ ...deductions, section80DDB: e.target.value })
                  }
                  className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500 outline-none"
                  placeholder="For critical illness"
                />
                <small className="text-gray-500">
                  ₹40,000 (or ₹1 lakh for seniors).
                </small>
              </div>
              <div>
                <label className="block text-gray-700">
                  Section 80U (₹)
                </label>
                <input
                  type="number"
                  min="0"
                  value={deductions.section80U}
                  onChange={(e) =>
                    setDeductions({ ...deductions, section80U: e.target.value })
                  }
                  className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500 outline-none"
                  placeholder="For self-disability"
                />
                <small className="text-gray-500">
                  Up to ₹75,000 (or ₹1.25 lakh for severe disability).
                </small>
              </div>
            </div>
          </div>
          {/* Education & Donations */}
          <div className="mb-8">
            <h3 className="text-xl font-bold text-gray-800 mb-2">Education & Donations</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-gray-700">
                  Section 80E (₹)
                </label>
                <input
                  type="number"
                  min="0"
                  value={deductions.section80E}
                  onChange={(e) =>
                    setDeductions({ ...deductions, section80E: e.target.value })
                  }
                  className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500 outline-none"
                  placeholder="No limit"
                />
                <small className="text-gray-500">
                  Interest on education loans.
                </small>
              </div>
              <div>
                <label className="block text-gray-700">
                  Section 80G (₹)
                </label>
                <input
                  type="number"
                  min="0"
                  value={deductions.section80G}
                  onChange={(e) =>
                    setDeductions({ ...deductions, section80G: e.target.value })
                  }
                  className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500 outline-none"
                  placeholder="Donations"
                />
                <small className="text-gray-500">
                  Donations to charities.
                </small>
              </div>
              <div>
                <label className="block text-gray-700">
                  Section 80GGA (₹)
                </label>
                <input
                  type="number"
                  min="0"
                  value={deductions.section80GGA}
                  onChange={(e) =>
                    setDeductions({ ...deductions, section80GGA: e.target.value })
                  }
                  className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500 outline-none"
                  placeholder="Scientific research"
                />
                <small className="text-gray-500">
                  Donations for research.
                </small>
              </div>
              <div>
                <label className="block text-gray-700">
                  Section 80GGC (₹)
                </label>
                <input
                  type="number"
                  min="0"
                  value={deductions.section80GGC}
                  onChange={(e) =>
                    setDeductions({ ...deductions, section80GGC: e.target.value })
                  }
                  className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500 outline-none"
                  placeholder="Political donations"
                />
                <small className="text-gray-500">
                  Donations to political parties.
                </small>
              </div>
            </div>
          </div>
          {/* Interest & Royalty Deductions */}
          <div className="mb-8">
            <h3 className="text-xl font-bold text-gray-800 mb-2">Interest & Royalty Deductions</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-gray-700">
                  Section 80TTA (₹)
                </label>
                <input
                  type="number"
                  min="0"
                  value={deductions.section80TTA}
                  onChange={(e) =>
                    setDeductions({ ...deductions, section80TTA: e.target.value })
                  }
                  className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500 outline-none"
                  placeholder="Up to ₹10,000"
                />
                <small className="text-gray-500">
                  Savings account interest.
                </small>
              </div>
              <div>
                <label className="block text-gray-700">
                  Section 80TTB (₹)
                </label>
                <input
                  type="number"
                  min="0"
                  value={deductions.section80TTB}
                  onChange={(e) =>
                    setDeductions({ ...deductions, section80TTB: e.target.value })
                  }
                  className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500 outline-none"
                  placeholder="Up to ₹50,000"
                />
                <small className="text-gray-500">
                  For senior citizens.
                </small>
              </div>
              <div>
                <label className="block text-gray-700">
                  Section 80RRB (₹)
                </label>
                <input
                  type="number"
                  min="0"
                  value={deductions.section80RRB}
                  onChange={(e) =>
                    setDeductions({ ...deductions, section80RRB: e.target.value })
                  }
                  className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500 outline-none"
                  placeholder="Up to ₹3 lakh"
                />
                <small className="text-gray-500">
                  Royalty on patents.
                </small>
              </div>
              <div>
                <label className="block text-gray-700">
                  Section 80QQB (₹)
                </label>
                <input
                  type="number"
                  min="0"
                  value={deductions.section80QQB}
                  onChange={(e) =>
                    setDeductions({ ...deductions, section80QQB: e.target.value })
                  }
                  className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500 outline-none"
                  placeholder="Up to ₹3 lakh"
                />
                <small className="text-gray-500">
                  For authors.
                </small>
              </div>
            </div>
          </div>
          {/* Other Deductions */}
          <div className="mb-8">
            <h3 className="text-xl font-bold text-gray-800 mb-2">Other Deductions</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-gray-700">
                  Other Deductions (₹)
                </label>
                <input
                  type="number"
                  min="0"
                  value={deductions.other}
                  onChange={(e) =>
                    setDeductions({ ...deductions, other: e.target.value })
                  }
                  className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500 outline-none"
                  placeholder="Any other deductions"
                />
              </div>
            </div>
          </div>
          <button
            onClick={() => setStep("regimeSelection")}
            className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition-colors font-medium"
          >
            Next: Select Tax Regime
          </button>
          <div className="mt-4">
            <button
              onClick={() => setShowDeductionsInfo(!showDeductionsInfo)}
              className="text-blue-600 underline"
            >
              {showDeductionsInfo ? "Hide" : "Learn More about Deductions & Exemptions"}
            </button>
            {showDeductionsInfo && <DeductionsInfo />}
          </div>
        </div>
      )}

      {/* STEP 5: Tax Regime Selection */}
      {step === "regimeSelection" && (
        <div className="bg-white p-8 rounded-xl shadow border border-gray-200">
          <h2 className="text-2xl font-bold mb-8 text-gray-800">
            Select Tax Regime
          </h2>
          <div className="flex flex-col gap-4 mb-8">
            <label className="flex items-center gap-3 p-4 border rounded-lg hover:bg-gray-50 cursor-pointer">
              <input
                type="radio"
                value="old"
                checked={taxRegime === "old"}
                onChange={() => setTaxRegime("old")}
                className="h-5 w-5 text-blue-600 focus:ring-blue-500"
              />
              <span className="text-lg font-medium text-gray-700">
                Old Regime
              </span>
            </label>
            <label className="flex items-center gap-3 p-4 border rounded-lg hover:bg-gray-50 cursor-pointer">
              <input
                type="radio"
                value="new"
                checked={taxRegime === "new"}
                onChange={() => setTaxRegime("new")}
                className="h-5 w-5 text-blue-600 focus:ring-blue-500"
              />
              <span className="text-lg font-medium text-gray-700">
                New Regime
              </span>
            </label>
          </div>
          <button
            onClick={() => setStep("results")}
            className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition-colors font-medium"
          >
            Calculate Tax
          </button>
        </div>
      )}

      {/* STEP 6: Results */}
      {step === "results" && (
        <div className="bg-white p-8 rounded-xl shadow border border-gray-200">
          <h2 className="text-2xl font-bold mb-8 text-gray-800">
            Tax Calculation Results
          </h2>
          <div className="mb-8">
            <h3 className="text-lg font-semibold mb-4 text-gray-700">
              Income Breakdown
            </h3>
            {incomeStreams.map((stream) => (
              <div key={stream.id} className="p-3 bg-gray-50 rounded-lg mb-2">
                <p className="text-gray-600">
                  <span className="font-medium">{stream.description}</span>: ₹
                  {stream.amount}{" "}
                  <span className="text-sm ml-2">({stream.frequency})</span> -{" "}
                  <span className="ml-2 text-blue-600">
                    {stream.category || stream.suggestedCategory}
                  </span>
                  {stream.category === "Business/Professional" &&
                    stream.expenseDeductionPercent > 0 && (
                      <span className="ml-2 text-gray-600">
                        (Expense Deduction: {stream.expenseDeductionPercent}%)
                      </span>
                    )}
                </p>
              </div>
            ))}
          </div>
          <div className="p-6 bg-blue-50 rounded-lg">
            <h3 className="text-xl font-bold text-gray-800">
              Total Tax Liability: ₹{Math.round(tax).toLocaleString()}
            </h3>
            <p className="text-sm text-gray-600 mt-2">
              {taxRegime === "new"
                ? "Under the New Regime, exemptions and deductions are not allowed (except for a Section 87A rebate if applicable)."
                : "Your taxable income is calculated after applying the exemptions and deductions entered."}
            </p>
          </div>
          <button
            onClick={() => setStep("streamCount")}
            className="w-full mt-8 bg-gray-600 text-white py-3 rounded-lg hover:bg-gray-700 transition-colors font-medium"
          >
            Start Over
          </button>
        </div>
      )}
    </div>
    </>

  );
};

export default TaxCalculator;
