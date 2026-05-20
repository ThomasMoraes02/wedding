import * as React from "react";
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
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

function App() {
  const countdown = useCountdown();
  const audioRef = React.useRef<HTMLAudioElement>(null);
  const shellRef = React.useRef<HTMLElement>(null);
  const audioSrc = `${import.meta.env.BASE_URL}audio/cant-help-falling-in-love.mp3`;
  const model4EnvelopeSrc = `${import.meta.env.BASE_URL}images/modelo-4-envelope-las-vegas.png`;
  const vegasBackgroundSrc = `${import.meta.env.BASE_URL}images/fundo-10-vegas-romantico.png`;
  const autoralTemplateSrc = `${import.meta.env.BASE_URL}images/autoral-1-template.png`;
  const [isOpen, setIsOpen] = React.useState(false);
  const [audioState, setAudioState] = React.useState<"ready" | "playing" | "missing">("ready");
  const countdownItems = [
    { label: "dias", value: countdown.days },
    { label: "horas", value: countdown.hours },
    { label: "min", value: countdown.minutes },
    { label: "seg", value: countdown.seconds },
  ];

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
      style={{ "--vegas-background": `url(${vegasBackgroundSrc})` } as React.CSSProperties}
      onPointerMove={updatePointerGlow}
    >
      <audio ref={audioRef} src={audioSrc} preload="auto" loop />

      <section className="invite-scene" aria-label="Convite de casamento de Thomas e Joice">
        <button
          className="paper-envelope-stage"
          type="button"
          onClick={openInvite}
          aria-expanded={isOpen}
          aria-label={isOpen ? "Convite aberto" : "Abrir convite"}
        >
          <span className="paper-envelope" style={{ backgroundImage: `url(${model4EnvelopeSrc})` }} />
        </button>

        <article
          className="invite-card autoral1-template-card"
          style={{ "--autoral-template": `url(${autoralTemplateSrc})` } as React.CSSProperties}
          aria-hidden={!isOpen}
          aria-live="polite"
        >
          <section className="autoral1-countdown-live" aria-label="Contagem regressiva">
            <span>Contagem regressiva</span>
            <div>
              {countdownItems.map((item, index) => (
                <React.Fragment key={item.label}>
                  {index > 0 && <i aria-hidden="true">♥</i>}
                  <strong>
                    <b>{String(item.value).padStart(2, "0")}</b>
                    <small>{item.label}</small>
                  </strong>
                </React.Fragment>
              ))}
            </div>
          </section>

          <p className="autoral1-verse-live">
            Onde Deus une dois corações nasce uma história eterna.
          </p>

          <p className="autoral1-music-live">
            {audioState === "playing"
              ? "Tocando: Can't Help Falling in Love - Elvis Presley"
              : "Can’t Help Falling in Love - Elvis Presley"}
          </p>

          <span className="autoral1-screen-reader">
            Thomas e Joice. 18 de outubro de 2026, às 11:00 da manhã.
            Av. das Hortênsias, 765 - Gramado, RS.
          </span>
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
