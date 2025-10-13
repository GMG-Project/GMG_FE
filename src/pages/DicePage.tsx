import { useRouter } from "next/router";
import { useEffect, useState } from "react";

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

export default function DicePage() {
  const router = useRouter();
  const [items, setItems] = useState<string[]>([]);
  const [rollIndex, setRollIndex] = useState<number | null>(null);

  useEffect(() => {
    if (!router.isReady) return;
    setItems(parseAreas(router.query.areas));
  }, [router.isReady, router.query.areas]);

  const canPlay = items.length >= 2;
  const faces = items.length; // N면체

  const roll = () => {
    if (!canPlay) return;
    const i = Math.floor(Math.random() * items.length);
    setRollIndex(i);
  };

  const resultLabel = rollIndex !== null ? items[rollIndex] : null;

  return (
    <main className="min-h-screen w-full bg-yellow-400 flex flex-col items-center justify-center p-6">
      <h1 className="mb-6 text-5xl sm:text-6xl font-extrabold text-white tracking-tight">주행</h1>
      <section className="relative w-full max-w-4xl bg-white rounded-2xl shadow-xl p-6">
        <header className="mb-4 flex items-center justify-between">
          <h2 className="text-xl sm:text-2xl font-extrabold text-gray-900">주사위를 굴려 여행지를 정해보세요.</h2>
          {canPlay && <span className="text-sm text-gray-400">{faces}면체</span>}
        </header>

        {!canPlay ? (
          <div className="rounded-xl border border-dashed border-gray-300 p-6 text-center text-gray-500">
            최소 2개 이상의 지역이 필요합니다.
          </div>
        ) : (
          <div className="relative">
            {/* 결과 디스플레이 영역 */}
            <div className="mx-auto h-64 sm:h-72 bg-yellow-500/80 rounded-md flex items-center justify-center select-none">
              {resultLabel ? (
                <span className="text-white text-2xl sm:text-4xl font-extrabold drop-shadow">{resultLabel}!</span>
              ) : (
                <div className="h-16 w-16 rounded-lg bg-white/90 shadow flex items-center justify-center text-2xl font-bold text-gray-700">?</div>
              )}
            </div>

            {/* 중앙 버튼들 */}
            <div className="mt-4 flex items-center justify-center gap-3">
              <button onClick={roll} className="h-9 px-5 rounded-md border border-yellow-300 bg-white text-sm font-semibold text-gray-800 hover:shadow">
                굴리기
              </button>
              <button onClick={() => setRollIndex(null)} className="h-9 px-5 rounded-md border border-yellow-300 bg-white text-sm font-semibold text-gray-800 hover:shadow">
                새 게임
              </button>
            </div>

            {/* 좌우 화살표 */}
            <button
              onClick={() => router.push(`/GameMode?areas=${encodeURIComponent(items.map(encodeURIComponent).join(","))}`)}
              aria-label="이전"
              className="absolute -bottom-6 left-4 h-10 w-10 rounded-full bg-white shadow flex items-center justify-center hover:shadow-md"
            >
              <img src="/leftArrow.svg" alt="이전" className="h-5 w-5" />
            </button>
            <button
              onClick={roll}
              aria-label="다음"
              className="absolute -bottom-6 right-4 h-10 w-10 rounded-full bg-white shadow flex items-center justify-center hover:shadow-md"
            >
              <img src="/rightArrow.svg" alt="굴리기" className="h-5 w-5" />
            </button>
          </div>
        )}
      </section>
    </main>
  );
}
