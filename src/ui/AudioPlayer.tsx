import React, { useEffect, useRef } from "react";
import { Audio, AVPlaybackStatus } from "expo-av";

export interface AudioPlayerProps {
  source: string;
  play: boolean;
  onEnd?: () => void;
}

export const AudioPlayer: React.FC<AudioPlayerProps> = ({ source, play, onEnd }) => {
  const soundRef = useRef<Audio.Sound | null>(null);

  useEffect(() => {
    let isMounted = true;
    async function loadAndPlay() {
      if (play && source) {
        if (soundRef.current) {
          await soundRef.current.unloadAsync();
        }
        const { sound } = await Audio.Sound.createAsync({ uri: source });
        soundRef.current = sound;
        sound.setOnPlaybackStatusUpdate((status: AVPlaybackStatus) => {
          if (status.isLoaded && status.didJustFinish && onEnd) {
            onEnd();
          }
        });
        await sound.playAsync();
      } else if (soundRef.current) {
        await soundRef.current.stopAsync();
      }
    }
    loadAndPlay();
    return () => {
      isMounted = false;
      if (soundRef.current) {
        soundRef.current.unloadAsync();
      }
    };
  }, [play, source]);

  return null;
};
