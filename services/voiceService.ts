// Native Web Speech API Voice Service
export const speakText = (text: string) => {
  if (!text || !window.speechSynthesis) return;

  // Cancel any ongoing speech
  window.speechSynthesis.cancel();

  const utterance = new SpeechSynthesisUtterance(text);

  // Try to find a warm, friendly voice
  const voices = window.speechSynthesis.getVoices();
  const preferredVoice = voices.find(v =>
    v.name.includes('Google') ||
    v.name.includes('Female') ||
    v.name.includes('Samantha')
  ) || voices[0];

  if (preferredVoice) {
    utterance.voice = preferredVoice;
  }

  utterance.pitch = 1.1; // Slightly higher/cuter dog voice
  utterance.rate = 1.0;
  utterance.volume = 0.8;

  window.speechSynthesis.speak(utterance);
};
