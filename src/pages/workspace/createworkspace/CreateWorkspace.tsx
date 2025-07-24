import { useState } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import type { AppDispatch } from "../../../store/store";
import { createWorkspaceAsync } from "../../../features/workspace/workspaceSlice";
import Step1CompanyInfo from "./Step1CompanyInfo";
import Step2ProfilePhoto from "./Step2ProfilePhoto";
import Step3InviteTeam from "./Step3InviteTeam";
import ProgressBar from "./ProgressBar";

interface WorkspaceData {
  id?: string; // Add workspace ID
  name: string;
  description: string;
  image: string | null;
  userName: string;
  userPhoto: File | null;
  inviteEmails: string[];
}

export default function CreateWorkspace() {
  const [step, setStep] = useState(1);
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();

  const [workspaceData, setWorkspaceData] = useState<WorkspaceData>({
    name: '',
    description: '',
    image: null,
    userName: '',
    userPhoto: null,
    inviteEmails: [],
    id: undefined // Initialize as undefined
  });

  const nextStep = () => setStep((prev) => Math.min(prev + 1, 3));
  const prevStep = () => setStep((prev) => Math.max(prev - 1, 1));

  const updateWorkspaceData = (data: Partial<WorkspaceData>) => {
    setWorkspaceData(prev => ({ ...prev, ...data }));
  };

  const handleCreateWorkspace = async () => {
    try {
      // إنشاء workspace
      const workspacePayload = {
        name: workspaceData.name,
        description: workspaceData.description,
        image: workspaceData.image || undefined
      };

      const result = await dispatch(createWorkspaceAsync(workspacePayload)).unwrap();
      
      // Update workspace data with the new ID
      setWorkspaceData(prev => ({ ...prev, id: result.id }));
      
      // TODO: رفع صورة المستخدم وإرسال دعوات الفريق
      
      // الانتقال إلى workspace
      navigate(`/workspace/${result.id}/channels`);
    } catch (error) {
      console.error("Failed to create workspace:", error);
      alert("فشل في إنشاء مساحة العمل");
    }
  };

  return (
    <div className="min-h-screen bg-white flex justify-center">
      <div className="w-full max-w-2xl px-6 pt-16">
        <ProgressBar currentStep={step} totalSteps={3} />

        {/* Step Content */}
        {step === 1 && (
          <Step1CompanyInfo 
            nextStep={nextStep} 
            workspaceData={workspaceData}
            updateWorkspaceData={updateWorkspaceData}
          />
        )}
        {step === 2 && (
          <Step2ProfilePhoto 
            nextStep={nextStep} 
            prevStep={prevStep}
            workspaceData={workspaceData}
            updateWorkspaceData={updateWorkspaceData}
          />
        )}
        {step === 3 && (
          <Step3InviteTeam
            prevStep={prevStep}
            workspaceData={workspaceData}
            updateWorkspaceData={updateWorkspaceData}
            onSubmit={handleCreateWorkspace}
          />
        )}
      </div>
    </div>
  );
}
