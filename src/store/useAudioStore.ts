import create from "zustand";

interface AudioStore {
  audioStream: MediaStream | null;
  setAudioStream: (stream: MediaStream | null) => void;
}

const useAudioStore = create<AudioStore>((set) => ({
  audioStream: null,
  setAudioStream: (stream) => set({ audioStream: stream }),
}));

export default useAudioStore;
