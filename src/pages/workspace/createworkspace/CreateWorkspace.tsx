import { useState } from "react";
import Step1CompanyInfo from "./Step1CompanyInfo";
import Step2ProfilePhoto from "./Step2ProfilePhoto";
import Step3InviteTeam from "./Step3InviteTeam";
import ProgressBar from "./ProgressBar";

export default function CreateWorkspace() {
  const [step, setStep] = useState(1);

  const nextStep = () => setStep((prev) => Math.min(prev + 1, 3));
  const prevStep = () => setStep((prev) => Math.max(prev - 1, 1));

  return (
    <div className="min-h-screen bg-white flex justify-center">
      <div className="w-full max-w-2xl px-6 pt-16">
        <ProgressBar currentStep={step} totalSteps={3} />

        {/* Step Content */}
        {step === 1 && <Step1CompanyInfo nextStep={nextStep} />}
        {step === 2 && <Step2ProfilePhoto nextStep={nextStep} prevStep={prevStep} />}
        {step === 3 && <Step3InviteTeam prevStep={prevStep} />}
      </div>
    </div>
  );
}
