// Abstraction over the browser's speech APIs so a real backend/provider
// (e.g. a server-side STT/TTS service) can be swapped in later without
// touching any screen code.

export abstract class SpeechService {
  abstract startListening(lang: "en" | "hi", onResult: (transcript: string, isFinal: boolean) => void): void;
  abstract stopListening(): void;
  abstract isListening(): boolean;
  abstract speak(text: string, lang: "en" | "hi"): void;
  abstract isSupported(): boolean;
}

type SpeechRecognitionLike = {
  lang: string;
  continuous: boolean;
  interimResults: boolean;
  onresult: ((event: any) => void) | null;
  onerror: ((event: any) => void) | null;
  onend: (() => void) | null;
  start: () => void;
  stop: () => void;
};

class BrowserSpeechService extends SpeechService {
  private recognition: SpeechRecognitionLike | null = null;
  private listening = false;

  private getRecognitionCtor() {
    const w = window as any;
    return w.SpeechRecognition || w.webkitSpeechRecognition || null;
  }

  isSupported(): boolean {
    return !!this.getRecognitionCtor();
  }

  startListening(lang: "en" | "hi", onResult: (transcript: string, isFinal: boolean) => void) {
    const Ctor = this.getRecognitionCtor();
    if (!Ctor) return;
    const recognition: SpeechRecognitionLike = new Ctor();
    recognition.lang = lang === "hi" ? "hi-IN" : "en-IN";
    recognition.continuous = false;
    recognition.interimResults = true;

    recognition.onresult = (event: any) => {
      let transcript = "";
      let isFinal = false;
      for (let i = event.resultIndex; i < event.results.length; i++) {
        transcript += event.results[i][0].transcript;
        if (event.results[i].isFinal) isFinal = true;
      }
      onResult(transcript, isFinal);
    };
    recognition.onerror = () => {
      this.listening = false;
    };
    recognition.onend = () => {
      this.listening = false;
    };

    this.recognition = recognition;
    this.listening = true;
    recognition.start();
  }

  stopListening() {
    this.recognition?.stop();
    this.listening = false;
  }

  isListening() {
    return this.listening;
  }

  speak(text: string, lang: "en" | "hi") {
    if (!("speechSynthesis" in window)) return;
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = lang === "hi" ? "hi-IN" : "en-IN";
    utterance.rate = 0.95;
    window.speechSynthesis.cancel();
    window.speechSynthesis.speak(utterance);
  }
}

export const speechService: SpeechService = new BrowserSpeechService();
