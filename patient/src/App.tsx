import { Routes, Route } from "react-router-dom";
import LoginScreen from './screens/auth/LoginScreen';

import WelcomeScreen from "./screens/welcome/WelcomeScreen";
import LanguageScreen from "./screens/language/LanguageScreen";
import RegistrationScreen from "./screens/registration/RegistrationScreen";
import ConsentScreen from "./screens/consent/ConsentScreen";
import ChiefComplaintScreen from "./screens/complaint/ChiefComplaintScreen";
import AiHistoryScreen from "./screens/history/AiHistoryScreen";
import MedicationScreen from "./screens/history/MedicationScreen";
import AllergyScreen from "./screens/history/AllergyScreen";
import FamilyPersonalHistoryScreen from "./screens/history/FamilyPersonalHistoryScreen";
import ReviewOfSystemsScreen from "./screens/history/ReviewOfSystemsScreen";
import DocumentUploadScreen from "./screens/documents/DocumentUploadScreen";
import OcrProcessingScreen from "./screens/documents/OcrProcessingScreen";
import MedicalTimelineScreen from "./screens/timeline/MedicalTimelineScreen";
import HistorySummaryScreen from "./screens/summary/HistorySummaryScreen";
import PatientConfirmationScreen from "./screens/summary/PatientConfirmationScreen";
import SubmissionScreen from "./screens/submission/SubmissionScreen";

export default function App() {
  return (
    <Routes>
     
      <Route path="/login" element={<LoginScreen />} />
      <Route path="/" element={<WelcomeScreen />} />
      <Route path="/language" element={<LanguageScreen />} />
      <Route path="/register" element={<RegistrationScreen />} />
      <Route path="/consent" element={<ConsentScreen />} />
      <Route path="/complaint" element={<ChiefComplaintScreen />} />
      <Route path="/history" element={<AiHistoryScreen />} />
      <Route path="/medication" element={<MedicationScreen />} />
      <Route path="/allergy" element={<AllergyScreen />} />
      <Route path="/family-history" element={<FamilyPersonalHistoryScreen />} />
      <Route path="/review-of-systems" element={<ReviewOfSystemsScreen />} />
      
      <Route path="/documents" element={<DocumentUploadScreen />} />
      <Route path="/ocr-processing/:docId" element={<OcrProcessingScreen />} />
      <Route path="/timeline" element={<MedicalTimelineScreen />} />
      <Route path="/summary" element={<HistorySummaryScreen />} />
      <Route path="/confirm" element={<PatientConfirmationScreen />} />
      <Route path="/submitted" element={<SubmissionScreen />} />


    </Routes>
  );
}
