# Build track-01-shutdown.mp3: SAPI narration (slow) + brown-noise bed + 60s outro fade.
$here = Split-Path -Parent $MyInvocation.MyCommand.Path
Add-Type -AssemblyName System.Speech
$text = Get-Content -LiteralPath (Join-Path $here "narration.txt") -Raw
$wav = Join-Path $here "voice.wav"
$mp3 = Join-Path $here "track-01-shutdown.mp3"
$sp = New-Object System.Speech.Synthesis.SpeechSynthesizer
$sp.Rate = -3
$sp.SetOutputToWaveFile($wav)
$sp.Speak($text)
$sp.Dispose()
& ffmpeg -y -v error -i $wav -f lavfi -i "anoisesrc=color=brown:duration=520:seed=7" -filter_complex "[1:a]volume=0.16,afade=t=out:st=460:d=60[bed];[0:a][bed]amix=inputs=2:duration=longest,alimiter=limit=0.95[a]" -map "[a]" -c:a libmp3lame -b:a 128k $mp3
Remove-Item $wav -ErrorAction SilentlyContinue
Write-Output "built $mp3"
