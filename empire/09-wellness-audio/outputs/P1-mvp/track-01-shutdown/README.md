# TRACK 01 "Shutdown" — executed (sleep audio, ADHD moms)
`track-01-shutdown.mp3`: ~9min, Piper neural voice (en_US-lessac-medium, 100% local, zero keys) over brown noise, 60s outro fade. 9MB.
Voice model lives OUTSIDE the repo (63MB): rhasspy/piper-voices en_US-lessac-medium. Reproduce: `cat narration.txt | python -m piper --model <voice.onnx> --output_file voice.wav`, then mix bed per `build.ps1` pattern (swap SAPI step for Piper).
Upgrade path: ElevenLabs warmth later (NEEDS.md) — same script, better voice. Test on 5 moms before pack release.
