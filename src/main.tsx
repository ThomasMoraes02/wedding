import * as React from "react";
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { CalendarDays, Clock, Heart, MapPin, Mic2, Music2, Sparkles, Volume2 } from "lucide-react";
import "./styles.css";

const weddingDate = new Date("2026-10-18T11:00:00-03:00");

type Countdown = {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
};

function getCountdown(): Countdown {
  const now = new Date();
  const diff = Math.max(weddingDate.getTime() - now.getTime(), 0);

  const seconds = Math.floor(diff / 1000) % 60;
  const minutes = Math.floor(diff / (1000 * 60)) % 60;
  const hours = Math.floor(diff / (1000 * 60 * 60)) % 24;
  const days = Math.floor(diff / (1000 * 60 * 60 * 24));

  return { days, hours, minutes, seconds };
}

function useCountdown() {
  const [countdown, setCountdown] = React.useState<Countdown>(getCountdown);

  React.useEffect(() => {
    const timer = window.setInterval(() => setCountdown(getCountdown()), 1000);
    return () => window.clearInterval(timer);
  }, []);

  return countdown;
}

function CountdownTile({ label, value }: { label: string; value: number }) {
  return (
    <div className="countdown-tile">
      <strong>{String(value).padStart(2, "0")}</strong>
      <span>{label}</span>
    </div>
  );
}

function App() {
  const countdown = useCountdown();
  const audioRef = React.useRef<HTMLAudioElement>(null);
  const shellRef = React.useRef<HTMLElement>(null);
  const audioSrc = `${import.meta.env.BASE_URL}audio/cant-help-falling-in-love.mp3`;
  const [isOpen, setIsOpen] = React.useState(false);
  const [audioState, setAudioState] = React.useState<"ready" | "playing" | "missing">("ready");

  function updatePointerGlow(event: React.PointerEvent<HTMLElement>) {
    const shell = shellRef.current;
    if (!shell) return;

    const rect = shell.getBoundingClientRect();
    const x = ((event.clientX - rect.left) / rect.width) * 100;
    const y = ((event.clientY - rect.top) / rect.height) * 100;

    shell.style.setProperty("--pointer-x", `${x.toFixed(2)}%`);
    shell.style.setProperty("--pointer-y", `${y.toFixed(2)}%`);
  }

  async function openInvite() {
    setIsOpen(true);

    try {
      const audio = audioRef.current;
      if (!audio) return;

      audio.volume = 0.68;
      await audio.play();
      setAudioState("playing");
    } catch {
      setAudioState("missing");
    }
  }

  return (
    <main
      ref={shellRef}
      className={`page-shell ${isOpen ? "invite-open" : ""}`}
      onPointerMove={updatePointerGlow}
    >
      <audio ref={audioRef} src={audioSrc} preload="auto" loop />

      <div className="garden-frame" aria-hidden="true">
        <span className="table-felt" />
        <span className="playing-card card-one" />
        <span className="playing-card card-two" />
        <span className="casino-chip chip-one" />
        <span className="casino-chip chip-two" />
        <span className="vegas-strip" />
        <span className="palm palm-one" />
        <span className="palm palm-two" />
        <span className="chapel-glow" />
        <span className="chapel-mark">
          <span>Welcome to Fabulous</span>
          <strong>Las Vegas</strong>
          <em>Thomas & Joice Wedding</em>
        </span>
        <span className="flower flower-one" />
        <span className="flower flower-two" />
        <span className="flower flower-three" />
        <span className="leaf leaf-one" />
        <span className="leaf leaf-two" />
      </div>

      <section className="invite-scene" aria-label="Convite de casamento de Thomas e Joice">
        <button
          className="envelope-stage"
          type="button"
          onClick={openInvite}
          aria-expanded={isOpen}
          aria-label={isOpen ? "Convite aberto" : "Abrir convite de casamento"}
        >
          <span className="tap-hint" aria-hidden={isOpen}>
            <span className="hint-bouquet">
              <span />
              <span />
              <span />
            </span>
            <span>Abrir convite</span>
            <Sparkles size={16} />
          </span>
          <span className="envelope" aria-hidden="true">
            <span className="envelope-back" />
            <span className="hidden-letter" />
            <span className="envelope-left" />
            <span className="envelope-right" />
            <span className="envelope-front" />
            <span className="envelope-flap" />
            <span className="wax-seal">
              <span className="crest-top" />
              <span className="crest-monogram">
                <span>T</span>
                <span>J</span>
              </span>
              <span className="crest-bottom" />
            </span>
          </span>
        </button>

        <article className="invite-card" aria-hidden={!isOpen} aria-live="polite">
          <div className="card-flourish">
            <Heart size={18} />
            <span>Welcome to our Sunday morning chapel</span>
          </div>

          <h1>Thomas & Joice</h1>
          <p className="invite-copy">
            Com brilho, delicadeza e a magia de Las Vegas, convidamos você para
            celebrar nosso casamento em Gramado com um celebrante vestido de Elvis Presley.
          </p>

          <div className="info-strip">
            <div>
              <CalendarDays size={20} />
              <span>18/10/2026</span>
            </div>
            <div>
              <Clock size={20} />
              <span>11:00 da manhã</span>
            </div>
            <div>
              <MapPin size={20} />
              <span>Av. das Hortênsias, 765</span>
            </div>
          </div>

          <div className="elvis-note">
            <Mic2 size={18} />
            <span>Cerimonia com celebrante Elvis Presley</span>
          </div>

          <div className="countdown" aria-label="Contador para o casamento">
            <CountdownTile label="dias" value={countdown.days} />
            <CountdownTile label="horas" value={countdown.hours} />
            <CountdownTile label="min" value={countdown.minutes} />
            <CountdownTile label="seg" value={countdown.seconds} />
          </div>

          <div className="music-note">
            {audioState === "playing" ? <Volume2 size={18} /> : <Music2 size={18} />}
            <span>
              {audioState === "playing"
                ? "Tocando: Can't Help Falling in Love"
                : "Adicione o MP3 licenciado em public/audio/cant-help-falling-in-love.mp3."}
            </span>
          </div>
        </article>
      </section>
    </main>
  );
}

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
