import React, { useState, useRef, useEffect } from 'react';
import { transcribeAudio } from '../services/api';
import './VoiceAssistant.css';

const VoiceAssistant = ({ onCommandProcessed, compact = false }) => {
  const [isRecording, setIsRecording] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [command, setCommand] = useState(null);
  const [error, setError] = useState(null);
  const [audioLevel, setAudioLevel] = useState(0);
  const [autoStopEnabled, setAutoStopEnabled] = useState(true);

  const mediaRecorderRef = useRef(null);
  const audioChunksRef = useRef([]);
  const audioContextRef = useRef(null);
  const analyserRef = useRef(null);
  const animationFrameRef = useRef(null);
  const silenceTimeoutRef = useRef(null);
  const lastSoundTimeRef = useRef(null);
  const isRecordingRef = useRef(false);
  const autoStopEnabledRef = useRef(true);

  // Sync state with ref for use in callbacks
  useEffect(() => {
    autoStopEnabledRef.current = autoStopEnabled;
  }, [autoStopEnabled]);

  const SILENCE_THRESHOLD = 0.01; // Audio level threshold for silence
  const SILENCE_DURATION = 2000; // 2 seconds of silence before auto-stop

  useEffect(() => {
    return () => {
      // Cleanup
      if (audioContextRef.current) {
        audioContextRef.current.close();
      }
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
      if (silenceTimeoutRef.current) {
        clearTimeout(silenceTimeoutRef.current);
      }
    };
  }, []);

  const startRecording = async () => {
    try {
      setError(null);
      setTranscript('');
      setCommand(null);
      audioChunksRef.current = [];

      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });

      // Setup audio visualization
      audioContextRef.current = new (window.AudioContext || window.webkitAudioContext)();
      analyserRef.current = audioContextRef.current.createAnalyser();
      const source = audioContextRef.current.createMediaStreamSource(stream);
      source.connect(analyserRef.current);
      analyserRef.current.fftSize = 256;
      
      visualizeAudio();

      // Initialize sound detection time
      lastSoundTimeRef.current = Date.now();
      console.log('Recording started. Auto-stop enabled:', autoStopEnabledRef.current);

      // Setup MediaRecorder
      mediaRecorderRef.current = new MediaRecorder(stream);

      mediaRecorderRef.current.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };

      mediaRecorderRef.current.onstop = async () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
        stream.getTracks().forEach(track => track.stop());
        
        if (audioContextRef.current) {
          audioContextRef.current.close();
        }
        if (animationFrameRef.current) {
          cancelAnimationFrame(animationFrameRef.current);
        }
        setAudioLevel(0);

        // Process the audio
        await processAudio(audioBlob);
      };

      mediaRecorderRef.current.start();
      setIsRecording(true);
      isRecordingRef.current = true;
    } catch (err) {
      console.error('Error starting recording:', err);
      setError('Failed to start recording. Please check microphone permissions.');
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecordingRef.current) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
      isRecordingRef.current = false;
      setIsProcessing(true);
      
      // Clear silence detection
      if (silenceTimeoutRef.current) {
        clearTimeout(silenceTimeoutRef.current);
        silenceTimeoutRef.current = null;
      }
      lastSoundTimeRef.current = null;
    }
  };

  const visualizeAudio = () => {
    if (!analyserRef.current) return;

    const bufferLength = analyserRef.current.frequencyBinCount;
    const dataArray = new Uint8Array(bufferLength);

    const updateLevel = () => {
      if (!analyserRef.current) return;
      
      analyserRef.current.getByteFrequencyData(dataArray);
      const average = dataArray.reduce((a, b) => a + b) / bufferLength;
      const normalizedLevel = average / 255;
      setAudioLevel(normalizedLevel);

      // Debug: Log audio level occasionally
      if (Math.random() < 0.01) { // 1% of frames
        console.log('Audio level:', normalizedLevel.toFixed(3), 'Threshold:', SILENCE_THRESHOLD);
      }

      // Auto-stop on silence detection
      if (autoStopEnabledRef.current && isRecordingRef.current) {
        if (normalizedLevel > SILENCE_THRESHOLD) {
          // Sound detected - reset silence timer
          lastSoundTimeRef.current = Date.now();
          if (silenceTimeoutRef.current) {
            clearTimeout(silenceTimeoutRef.current);
            silenceTimeoutRef.current = null;
          }
        } else if (lastSoundTimeRef.current) {
          // Silence detected - check duration
          const silenceDuration = Date.now() - lastSoundTimeRef.current;
          if (silenceDuration > SILENCE_DURATION) {
            console.log('Auto-stopping due to silence. Silence duration:', silenceDuration, 'ms');
            stopRecording();
            return; // Exit to prevent further animation frames
          } else if (silenceDuration > 500 && silenceDuration % 500 < 50) {
            // Log every 500ms of silence
            console.log('Silence detected for', Math.round(silenceDuration / 1000), 'seconds');
          }
        }
      }

      animationFrameRef.current = requestAnimationFrame(updateLevel);
    };

    updateLevel();
  };

  const processAudio = async (audioBlob) => {
    try {
      const result = await transcribeAudio(audioBlob);
      
      if (result.success) {
        setTranscript(result.data.transcript);
        setCommand(result.data.command);
        
        if (onCommandProcessed && result.data.command) {
          onCommandProcessed(result.data.command);
        }
      } else {
        setError('Failed to process audio');
      }
    } catch (err) {
      console.error('Error processing audio:', err);
      setError('Failed to process audio. Please try again.');
    } finally {
      setIsProcessing(false);
    }
  };

  const getCommandStatusColor = () => {
    if (!command) return '#6c757d';
    return command.recognized ? '#28a745' : '#ffc107';
  };

  if (compact) {
    return (
      <div className="voice-assistant-compact">
        <div 
          className={`mic-button-compact ${isRecording ? 'recording' : ''} ${isProcessing ? 'processing' : ''}`}
          onClick={isRecording ? stopRecording : startRecording}
          title={isRecording ? 'Stop Recording (or wait for auto-stop)' : 'Start Recording'}
        >
          {isProcessing ? (
            <div className="spinner-compact"></div>
          ) : isRecording ? (
            <span className="mic-icon-compact">🎙️</span>
          ) : (
            <span className="mic-icon-compact">🎤</span>
          )}
        </div>
        {isRecording && (
          <div className="status-compact">
            {autoStopEnabled ? 'Listening... (auto-stop)' : 'Listening...'}
          </div>
        )}
        {isProcessing && (
          <div className="status-compact">Processing...</div>
        )}
        <button 
          className="auto-stop-toggle"
          onClick={() => setAutoStopEnabled(!autoStopEnabled)}
          title={autoStopEnabled ? 'Auto-stop ON' : 'Auto-stop OFF'}
        >
          {autoStopEnabled ? '⏱️' : '⏸️'}
        </button>
      </div>
    );
  }

  return (
    <div className="voice-assistant">
      <div className="recording-section">
        <div 
          className={`microphone-button ${isRecording ? 'recording' : ''} ${isProcessing ? 'processing' : ''}`}
          onClick={isRecording ? stopRecording : startRecording}
          style={{
            transform: isRecording ? `scale(${1 + audioLevel * 0.3})` : 'scale(1)'
          }}
        >
          {isProcessing ? (
            <div className="spinner"></div>
          ) : isRecording ? (
            <span className="mic-icon">🎙️</span>
          ) : (
            <span className="mic-icon">🎤</span>
          )}
        </div>

        <div className="status-text">
          {isProcessing && <p>Processing your command...</p>}
          {isRecording && autoStopEnabled && <p>Listening... (Auto-stops after 2s of silence)</p>}
          {isRecording && !autoStopEnabled && <p>Listening... Click to stop</p>}
          {!isRecording && !isProcessing && (
            <div>
              <p>Click to start speaking</p>
              <label className="auto-stop-label">
                <input 
                  type="checkbox" 
                  checked={autoStopEnabled}
                  onChange={(e) => setAutoStopEnabled(e.target.checked)}
                />
                Auto-stop on silence
              </label>
            </div>
          )}
        </div>

        {isRecording && (
          <div className="audio-level-bar">
            <div 
              className="audio-level-fill"
              style={{ width: `${audioLevel * 100}%` }}
            ></div>
          </div>
        )}
      </div>

      {error && (
        <div className="error-message">
          <span>⚠️</span> {error}
        </div>
      )}

      {transcript && (
        <div className="result-section">
          <div className="transcript-box">
            <h3>📝 Transcript</h3>
            <p>{transcript}</p>
          </div>

          {command && (
            <div className="command-box" style={{ borderColor: getCommandStatusColor() }}>
              <h3>
                {command.recognized ? '✅' : '❓'} Command Result
              </h3>
              <div className="command-details">
                <div className="detail-row">
                  <span className="label">Status:</span>
                  <span className={`value ${command.recognized ? 'success' : 'warning'}`}>
                    {command.recognized ? 'Recognized' : 'Not Recognized'}
                  </span>
                </div>
                {command.recognized && (
                  <>
                    <div className="detail-row">
                      <span className="label">Command:</span>
                      <span className="value">{command.command}</span>
                    </div>
                    <div className="detail-row">
                      <span className="label">Action:</span>
                      <span className="value action">{command.action}</span>
                    </div>
                    {command.target && (
                      <div className="detail-row">
                        <span className="label">Target:</span>
                        <span className="value">{command.target}</span>
                      </div>
                    )}
                  </>
                )}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default VoiceAssistant;

