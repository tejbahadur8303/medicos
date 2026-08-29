import { useState } from "react";
import { useNavigate } from "react-router-dom";

import { usePatientStore } from "../../store/usePatientStore";
import KioskShell from "../../widgets/KioskShell";
import type { Gender } from "../../types/patient";
import { api } from "../../services/apiService";

export default function RegistrationScreen() {
  const navigate = useNavigate();
  const { patient, setPatient } = usePatientStore();

  const isHindi = patient.language === "hi";

  const [name, setName] = useState(patient.name);
  const [age, setAge] = useState(patient.age?.toString() || "");
  const [gender, setGender] = useState<Gender | null>(patient.gender);
  const [mobile, setMobile] = useState(patient.mobile);
  const [abhaId, setAbhaId] = useState(patient.abhaId || "");
  const [loading, setLoading] = useState(false);

  const canContinue =
    name.trim().length > 0 &&
    age.trim().length > 0 &&
    gender !== null &&
    mobile.trim().length >= 10;

  const proceed = async (guest = false) => {
    if (loading) return;

    const patientName =
      name.trim() || (guest ? "Guest Patient" : "");

    const patientAge = age ? parseInt(age, 10) : 0;

    const patientMobile = mobile.trim();

    setLoading(true);

    try {
      // Create patient session in backend
      const response = await api.createSession({
        name: patientName,
        age: patientAge,
        gender: gender || "Other",
        mobileNumber: patientMobile,
        abhaId: abhaId.trim(),
        language: patient.language || "en",
        isGuest: guest,
        consent: {
          given: false,
        },
      });

      console.log("Patient session created:", response);

      // Save patient + backend session information locally
      setPatient({
        name: patientName,
        age: patientAge,
        gender,
        mobile: patientMobile,
        abhaId: abhaId.trim(),
        isGuest: guest,
        sessionId: response.sessionId,
        token: response.token,
      });

      navigate("/consent");
    } catch (error) {
      console.error("Failed to create patient session:", error);

      // Save locally so kiosk can continue even if backend is unavailable
      setPatient({
        name: patientName,
        age: patientAge,
        gender,
        mobile: patientMobile,
        abhaId: abhaId.trim(),
        isGuest: guest,
      });

      navigate("/consent");
    } finally {
      setLoading(false);
    }
  };

  const genders: Gender[] = ["Male", "Female", "Other"];

  return (
    <KioskShell step={1} totalSteps={5}>
      <h1 className="font-display text-2xl text-ink">
        {isHindi ? "अपनी जानकारी दें" : "Tell us about yourself"}
      </h1>

      <div className="mt-6 space-y-4">
        <div>
          <label className="mb-1 block text-sm font-medium text-ink/60">
            {isHindi ? "पूरा नाम" : "Full Name"}
          </label>

          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="tap-target w-full rounded-2xl border-2 border-stone-150 px-4 py-3 text-lg focus:border-kiosk-400 focus:outline-none"
            placeholder={
              isHindi ? "अपना नाम लिखें" : "Enter your name"
            }
          />
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="mb-1 block text-sm font-medium text-ink/60">
              {isHindi ? "उम्र" : "Age"}
            </label>

            <input
              value={age}
              onChange={(e) =>
                setAge(e.target.value.replace(/\D/g, ""))
              }
              inputMode="numeric"
              className="tap-target w-full rounded-2xl border-2 border-stone-150 px-4 py-3 text-lg focus:border-kiosk-400 focus:outline-none"
              placeholder={isHindi ? "उम्र" : "Age"}
            />
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium text-ink/60">
              {isHindi ? "मोबाइल नंबर" : "Mobile Number"}
            </label>

            <input
              value={mobile}
              onChange={(e) =>
                setMobile(
                  e.target.value
                    .replace(/\D/g, "")
                    .slice(0, 10),
                )
              }
              inputMode="numeric"
              className="tap-target w-full rounded-2xl border-2 border-stone-150 px-4 py-3 text-lg focus:border-kiosk-400 focus:outline-none"
              placeholder="10-digit number"
            />
          </div>
        </div>

        <div>
          <label className="mb-1 block text-sm font-medium text-ink/60">
            {isHindi ? "लिंग" : "Gender"}
          </label>

          <div className="grid grid-cols-3 gap-2">
            {genders.map((g) => (
              <button
                key={g}
                type="button"
                onClick={() => setGender(g)}
                className={`tap-target rounded-2xl border-2 py-3 text-base font-semibold ${
                  gender === g
                    ? "border-kiosk-500 bg-kiosk-500 text-white"
                    : "border-stone-150 bg-white text-ink"
                }`}
              >
                {g}
              </button>
            ))}
          </div>
        </div>

        <div>
          <label className="mb-1 block text-sm font-medium text-ink/60">
            {isHindi
              ? "आभा आईडी — वैकल्पिक"
              : "ABHA ID — optional"}
          </label>

          <input
            value={abhaId}
            onChange={(e) => setAbhaId(e.target.value)}
            className="tap-target w-full rounded-2xl border-2 border-stone-150 px-4 py-3 text-lg focus:border-kiosk-400 focus:outline-none"
            placeholder="XX-XXXX-XXXX-XXXX"
          />
        </div>
      </div>

      <button
        disabled={!canContinue || loading}
        onClick={() => proceed(false)}
        className="tap-target mt-6 w-full rounded-2xl bg-kiosk-500 py-4 text-lg font-bold text-white shadow-raised disabled:opacity-40"
      >
        {loading
          ? isHindi
            ? "कृपया प्रतीक्षा करें..."
            : "Please wait..."
          : isHindi
            ? "आगे बढ़ें"
            : "Continue"}
      </button>

      <button
        type="button"
        disabled={loading}
        onClick={() => proceed(true)}
        className="tap-target mt-3 w-full rounded-2xl border-2 border-stone-150 bg-white py-3.5 text-base font-semibold text-ink/70 disabled:opacity-40"
      >
        {isHindi
          ? "मेहमान के रूप में जारी रखें"
          : "Continue as Guest"}
      </button>

      <p className="mt-3 text-center text-xs text-ink/40">
        {isHindi
          ? "आभा आईडी नहीं है? कोई बात नहीं।"
          : "I don't have an ABHA ID — that's fine, continue anyway."}
      </p>
    </KioskShell>
  );
}