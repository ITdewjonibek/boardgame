import React, { useEffect, useMemo, useState } from 'react';
import ScienceGameFrame from '../ScienceCore/ScienceGameFrame';
import type { BaseGameProps } from '../ScienceCore/ScienceTypes';
import { clamp } from '../ScienceCore/ScienceUtils';

type ObstacleType = 'asteroid' | 'energy';

interface Obstacle {
  id: number;
  lane: number;
  row: number;
  kind: ObstacleType;
}

const TRACK_ROWS = 7;
const LANE_COUNT = 3;
const ROUND_SECONDS = 45;

const OrbitRunner: React.FC<BaseGameProps> = () => {
  const [seed, setSeed] = useState(0);
  const [playerLane, setPlayerLane] = useState(1);
  const [obstacles, setObstacles] = useState<Obstacle[]>([]);
  const [health, setHealth] = useState(3);
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(ROUND_SECONDS);
  const [status, setStatus] = useState<'playing' | 'won' | 'lost'>('playing');
  const [tick, setTick] = useState(0);

  useEffect(() => {
    setPlayerLane(1);
    setObstacles([]);
    setHealth(3);
    setScore(0);
    setTimeLeft(ROUND_SECONDS);
    setStatus('playing');
    setTick(0);
  }, [seed]);

  useEffect(() => {
    if (status !== 'playing') {
      return;
    }
    const timer = window.setInterval(() => {
      setTick((prev) => prev + 1);
      setTimeLeft((prev) => prev - 1);
    }, 1000);
    return () => window.clearInterval(timer);
  }, [status]);

  useEffect(() => {
    if (status !== 'playing') {
      return;
    }
    if (timeLeft <= 0) {
      setStatus('won');
    }
  }, [status, timeLeft]);

  useEffect(() => {
    if (status !== 'playing') {
      return;
    }

    setObstacles((current) => {
      const moved = current
        .map((obstacle) => ({ ...obstacle, row: obstacle.row - 1 }))
        .filter((obstacle) => obstacle.row >= 0);

      let nextScore = score + 4;
      let nextHealth = health;
      const nextObstacles: Obstacle[] = [];

      moved.forEach((obstacle) => {
        if (obstacle.row === 0 && obstacle.lane === playerLane) {
          if (obstacle.kind === 'asteroid') {
            nextHealth -= 1;
          } else {
            nextScore += 16;
          }
          return;
        }
        nextObstacles.push(obstacle);
      });

      if (Math.random() < 0.82) {
        nextObstacles.push({
          id: tick + 1_000 + Math.floor(Math.random() * 9_999),
          lane: Math.floor(Math.random() * LANE_COUNT),
          row: TRACK_ROWS - 1,
          kind: Math.random() < 0.75 ? 'asteroid' : 'energy',
        });
      }

      if (nextHealth <= 0) {
        setStatus('lost');
      }

      setHealth(nextHealth);
      setScore(nextScore);
      return nextObstacles;
    });
  }, [health, playerLane, score, status, tick]);

  const moveLane = (delta: number) => {
    if (status !== 'playing') {
      return;
    }
    setPlayerLane((prev) => clamp(prev + delta, 0, LANE_COUNT - 1));
  };

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'ArrowLeft') {
        moveLane(-1);
      }
      if (event.key === 'ArrowRight') {
        moveLane(1);
      }
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  });

  const cells = useMemo(() => {
    const map = new Map<string, string>();
    obstacles.forEach((obstacle) => {
      const icon = obstacle.kind === 'asteroid' ? '☄' : '✦';
      map.set(`${obstacle.row}-${obstacle.lane}`, icon);
    });
    map.set(`0-${playerLane}`, '🚀');
    return map;
  }, [obstacles, playerLane]);

  return (
    <ScienceGameFrame
      title="Orbit Runner"
      subtitle="Kosmik yo'laklarda asteroidlardan qoching va energiya kristallarini yig'ing."
      badge="Astrophysics Arcade"
      tone="sunset"
      stats={[
        { label: 'Ball', value: score },
        { label: 'Qolgan Vaqt', value: `${Math.max(0, timeLeft)}s` },
        { label: 'Shit', value: health },
        { label: 'Status', value: status.toUpperCase() },
      ]}
      actions={
        <>
          <button type="button" className="science-btn" onClick={() => moveLane(-1)}>
            Chapga
          </button>
          <button type="button" className="science-btn" onClick={() => moveLane(1)}>
            O'ngga
          </button>
          <button type="button" className="science-btn science-btn-primary" onClick={() => setSeed((prev) => prev + 1)}>
            Yangi Yugurish
          </button>
        </>
      }
    >
      <div className="science-grid" style={{ gap: 12 }}>
        {(status === 'won' || status === 'lost') && (
          <div className="science-card">
            <h3>{status === 'won' ? 'Missiya yakunlandi.' : 'Kema shikastlandi.'}</h3>
            <p className="science-note">
              {status === 'won'
                ? `Siz ${score} ball bilan orbitani tozaladingiz.`
                : 'Asteroidga urildingiz. Qayta urinishda lane almashishni tezlashtiring.'}
            </p>
          </div>
        )}

        <div
          style={{
            display: 'grid',
            gridTemplateColumns: `repeat(${LANE_COUNT}, minmax(0, 1fr))`,
            gridTemplateRows: `repeat(${TRACK_ROWS}, 52px)`,
            gap: 8,
          }}
        >
          {Array.from({ length: TRACK_ROWS }).map((_, rowIndex) =>
            Array.from({ length: LANE_COUNT }).map((__, laneIndex) => {
              const viewRow = TRACK_ROWS - 1 - rowIndex;
              const icon = cells.get(`${viewRow}-${laneIndex}`) ?? '';
              const isPlayer = icon === '🚀';

              return (
                <div
                  key={`${rowIndex}-${laneIndex}`}
                  className="science-card"
                  style={{
                    display: 'grid',
                    placeItems: 'center',
                    fontSize: isPlayer ? '1.5rem' : '1.1rem',
                    background: isPlayer ? 'rgba(255, 143, 64, 0.24)' : 'rgba(255,255,255,0.03)',
                    borderColor: isPlayer ? 'rgba(255, 143, 64, 0.6)' : 'rgba(255,255,255,0.16)',
                  }}
                >
                  {icon}
                </div>
              );
            }),
          )}
        </div>
      </div>
    </ScienceGameFrame>
  );
};

export default OrbitRunner;
