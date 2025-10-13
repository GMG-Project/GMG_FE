import { useRouter } from "next/router";
import { useEffect, useMemo, useState } from "react";

function parseAreas(query: unknown): string[] {
  let raw = "";
  if (Array.isArray(query)) {
    raw = query.join(",");
  } else if (typeof query === "string") {
    raw = query;
  } else {
    raw = "";
  }

  return raw
    .split(",")
    .map((s: string) => decodeURIComponent(s).trim())
    .filter(Boolean);
}

function shuffle<T>(arr: T[]) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

export default function LadderPage() {
  const router = useRouter();
  const [items, setItems] = useState<string[]>([]);
  const [selectedIdx, setSelectedIdx] = useState<number | null>(null);
  const [rungs, setRungs] = useState<{ row: number; col: number }[]>([]);

  useEffect(() => {
    if (!router.isReady) return;
    const list = parseAreas(router.query.areas);
    setItems(list);
  }, [router.isReady, router.query.areas]);

  const canPlay = items.length >= 2;

  // 사다리 가로줄 생성 (겹치지 않게)
  const generateRungs = (cols: number, rows = 6) => {
    const generated: { row: number; col: number }[] = [];
    for (let r = 0; r < rows; r++) {
      // 각 행에서 몇 개의 가로줄을 만들지 결정 (0~cols-1 사이)
      const possibleCols: number[] = [];
      for (let c = 0; c < cols - 1; c++) possibleCols.push(c);
      // 섞고 인접 충돌 피하며 0~2개 배치
      const shuffled = shuffle(possibleCols);
      for (const c of shuffled) {
        if (generated.some(g => g.row === r && (g.col === c || g.col === c - 1 || g.col === c + 1))) continue;
        if (Math.random() < 0.5) continue;
        generated.push({ row: r, col: c });
        if (generated.filter(g => g.row === r).length >= Math.min(2, cols - 1)) break;
      }
    }
    return generated.sort((a, b) => a.row - b.row || a.col - b.col);
  };

  // 페이지 최초/아이템 변경 시 사다리 생성
  useEffect(() => {
    if (!canPlay) return;
    setRungs(generateRungs(items.length));
  }, [canPlay, items.length]);

  // 사다리 규칙으로 결과 매핑 계산
  const resultByIndex = useMemo(() => {
    if (!canPlay) return [] as string[];
    const rows = Math.max(6, new Set(rungs.map(r => r.row)).size || 6);
    const cols = items.length;
    const mapping: number[] = [];
    for (let start = 0; start < cols; start++) {
      let c = start;
      for (let r = 0; r < rows; r++) {
        const rung = rungs.find(x => x.row === r && (x.col === c || x.col === c - 1));
        if (!rung) continue;
        if (rung.col === c) c = c + 1; else if (rung.col === c - 1) c = c - 1;
      }
      mapping.push(c);
    }
    return mapping.map(i => items[i]);
  }, [canPlay, items, rungs]);

  const regenerate = () => setRungs(generateRungs(items.length));

  return (
    <main className="min-h-screen w-full bg-yellow-400 flex flex-col items-center justify-center p-6">
      <h1 className="mb-6 text-5xl sm:text-6xl font-extrabold text-white tracking-tight">즉행</h1>
      <section className="relative w-full max-w-5xl bg-white rounded-2xl shadow-xl p-6">
        <header className="mb-4 flex items-center justify-between">
          <h2 className="text-xl sm:text-2xl font-extrabold text-gray-900">사다리를 타서 여행지를 정해보세요.</h2>
          {canPlay && (
            <button onClick={regenerate} className="text-sm text-gray-400 hover:text-gray-500">사다리 재생성</button>
          )}
        </header>

        {!canPlay ? (
          <div className="rounded-xl border border-dashed border-gray-300 p-6 text-center text-gray-500">
            최소 2개 이상의 지역이 필요합니다.
          </div>
        ) : (
          <div className="relative">
            {/* 상단 번호 탭 */}
            <div className="mb-3 grid" style={{ gridTemplateColumns: `repeat(${items.length}, minmax(0, 1fr))` }}>
              {items.map((_, i) => (
                <button
                  key={`top-${i}`}
                  onClick={() => setSelectedIdx(i)}
                  className={[
                    "mx-auto h-9 px-4 rounded-md border text-sm font-semibold",
                    selectedIdx === i ? "bg-yellow-400 border-yellow-500 text-white" : "bg-white border-yellow-300 text-gray-800"
                  ].join(" ")}
                >
                  {i + 1}번
                </button>
              ))}
            </div>

            {/* 사다리 SVG */}
            <div className="mx-auto w-full overflow-hidden">
              <LadderSVG cols={items.length} rungs={rungs} selectedIdx={selectedIdx} />
            </div>

            {/* 하단 결과 라벨 */}
            <div className="mt-3 grid" style={{ gridTemplateColumns: `repeat(${items.length}, minmax(0, 1fr))` }}>
              {resultByIndex.map((label, i) => (
                <div key={`bottom-${i}`} className="mx-auto">
                  <span className="inline-block h-9 px-4 rounded-md border border-yellow-300 bg-white text-sm font-semibold text-gray-800">
                    {label}
                  </span>
                </div>
              ))}
            </div>

            {/* 좌우 화살표 내비게이션 */}
            <button
              onClick={() => router.push(`/GameMode?areas=${encodeURIComponent(items.map(encodeURIComponent).join(","))}`)}
              aria-label="이전"
              className="absolute -bottom-6 left-4 h-10 w-10 rounded-full bg-white shadow flex items-center justify-center hover:shadow-md"
            >
              <img src="/leftArrow.svg" alt="이전" className="h-5 w-5" />
            </button>
            <button
              onClick={regenerate}
              aria-label="다음"
              className="absolute -bottom-6 right-4 h-10 w-10 rounded-full bg-white shadow flex items-center justify-center hover:shadow-md"
            >
              <img src="/rightArrow.svg" alt="재생성" className="h-5 w-5" />
            </button>
          </div>
        )}
      </section>
    </main>
  );
}

type LadderSVGProps = {
  cols: number;
  rungs: { row: number; col: number }[];
  selectedIdx: number | null;
};

function LadderSVG({ cols, rungs, selectedIdx }: LadderSVGProps) {
  const width = Math.max(320, cols * 120);
  const height = 360;
  const paddingX = 40;
  const paddingY = 20;
  const innerW = width - paddingX * 2;
  const innerH = height - paddingY * 2;
  const colGap = innerW / (cols - 1);
  const rows = Math.max(6, new Set(rungs.map(r => r.row)).size || 6);

  const xOf = (c: number) => paddingX + c * colGap;
  const yOf = (r: number) => paddingY + (r / rows) * innerH;

  return (
    <svg viewBox={`0 0 ${width} ${height}`} className="w-full" preserveAspectRatio="xMidYMid meet">
      {/* 세로줄 */}
      {Array.from({ length: cols }).map((_, c) => (
        <line key={`v-${c}`} x1={xOf(c)} y1={paddingY} x2={xOf(c)} y2={height - paddingY} stroke="#D1D5DB" strokeWidth={6} />
      ))}

      {/* 가로줄 (약간 기울임) */}
      {rungs.map((g, idx) => {
        const y = yOf(g.row);
        const x1 = xOf(g.col);
        const x2 = xOf(g.col + 1);
        const tilt = (Math.random() - 0.5) * 12; // 기울기
        return (
          <line key={`h-${idx}`} x1={x1} y1={y + tilt} x2={x2} y2={y - tilt} stroke="#E5E7EB" strokeWidth={6} />
        );
      })}

      {/* 선택된 시작 인덱스 강조 경로 (단색 하이라이트) */}
      {selectedIdx != null && (
        <path d={buildHighlightPath(selectedIdx, cols, rows, rungs, xOf, yOf, paddingY, height - paddingY)} fill="none" stroke="#F59E0B" strokeWidth={6} strokeLinecap="round" />
      )}
    </svg>
  );
}

function buildHighlightPath(
  start: number,
  cols: number,
  rows: number,
  rungs: { row: number; col: number }[],
  xOf: (c: number) => number,
  yOf: (r: number) => number,
  topY: number,
  bottomY: number
) {
  let c = start;
  let d = `M ${xOf(c)} ${topY}`;
  for (let r = 0; r < rows; r++) {
    const y = yOf(r);
    d += ` L ${xOf(c)} ${y}`;
    const rung = rungs.find(x => x.row === r && (x.col === c || x.col === c - 1));
    if (rung) {
      if (rung.col === c) {
        d += ` L ${xOf(c + 1)} ${y}`;
        c = c + 1;
      } else if (rung.col === c - 1) {
        d += ` L ${xOf(c - 1)} ${y}`;
        c = c - 1;
      }
    }
  }
  d += ` L ${xOf(c)} ${bottomY}`;
  return d;
}
