'use client';
import { useEffect, useState } from 'react';

const CHARS = 'αβγδεζηθικλμνξοπρστυφχψωΑΒΓΔΕΖΗΘΙΚΛΜΝΞΟΠΡΣΤΥΦΧΨΩกขฃคฅฆงจฉชซฌญฎฏฐฑฒณดตถทธนบปผฝพฟภมยรลวศษสหฬอฮअआइईउऊऋएऐओऔकखगघङचछजझञटठडढणतथदधनपफबभमयरलवशषसह';

export function SlotText({
  text,
  className,
  style,
}: {
  text: string;
  className?: string;
  style?: React.CSSProperties;
}) {
  const [chars, setChars] = useState<string[]>(() => text.split(''));
  const [glitching, setGlitching] = useState(false);

  useEffect(() => {
    function runScramble() {
      const cleanups: (() => void)[] = [];
      const letters = text.split('');
      const TICK_MS  = 100;   // how long each random char shows
      const STAGGER  = 220;   // delay between each letter starting
      const BASE_TICKS = 18;  // min ticks before a letter settles
      const RAMP     = 7;     // extra ticks per letter index

      const lastSettleMs = (letters.length - 1) * STAGGER + (BASE_TICKS + (letters.length - 1) * RAMP) * TICK_MS;

      setGlitching(true);
      const stopGlitch = setTimeout(() => setGlitching(false), lastSettleMs + 120);
      cleanups.push(() => clearTimeout(stopGlitch));

      letters.forEach((target, i) => {
        let ticks = 0;
        const totalTicks = BASE_TICKS + i * RAMP;

        const t = setTimeout(() => {
          const iv = setInterval(() => {
            ticks++;
            setChars(prev => {
              const next = [...prev];
              next[i] = ticks >= totalTicks
                ? target
                : CHARS[Math.floor(Math.random() * CHARS.length)];
              return next;
            });
            if (ticks >= totalTicks) clearInterval(iv);
          }, TICK_MS);
          cleanups.push(() => clearInterval(iv));
        }, i * STAGGER);

        cleanups.push(() => clearTimeout(t));
      });

      return () => cleanups.forEach(fn => fn());
    }

    const stopFirst = runScramble();
    const loop = setInterval(runScramble, 10_000);

    return () => {
      stopFirst();
      clearInterval(loop);
    };
  }, [text]);

  return (
    <span className={`${className ?? ''} ${glitching ? 'glitch-active' : ''}`.trim()} style={style}>
      {chars.map((c, i) => (
        <span key={i} style={{ display: 'inline-block' }}>{c}</span>
      ))}
    </span>
  );
}
