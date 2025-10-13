// pages/NoticePage.tsx
import React, { useMemo, useState } from "react";

type Notice = {
  id: number;
  title: string;
  isImportant?: boolean;
  date: string;   // YYYY-MM-DD
  views: number;
  category: "전체" | "중요 공지" | "자주 묻는 질문";
};

const mockNotices: Notice[] = [
  { id: 1,  title: "리카커피숍",         isImportant: false, date: "2025-09-07", views: 5, category: "전체" },
  { id: 2,  title: "덕수궁",             isImportant: false, date: "2025-09-07", views: 5, category: "전체" },
  { id: 3,  title: "통인시장",           isImportant: false, date: "2025-09-07", views: 5, category: "전체" },
  { id: 4,  title: "롯데시티호텔 명동",  isImportant: true,  date: "2025-09-07", views: 5, category: "중요 공지" },
  { id: 5,  title: "덕수궁",             isImportant: true,  date: "2025-09-07", views: 5, category: "중요 공지" },
  { id: 6,  title: "통인시장",           isImportant: false, date: "2025-09-07", views: 5, category: "전체" },
  { id: 7,  title: "롯데시티호텔 명동",  isImportant: false, date: "2025-09-07", views: 5, category: "전체" },
  { id: 8,  title: "덕수궁",             isImportant: false, date: "2025-09-07", views: 5, category: "전체" },
  { id: 9,  title: "통인시장",           isImportant: false, date: "2025-09-07", views: 5, category: "전체" },
  { id: 10, title: "롯데시티호텔 명동",  isImportant: false, date: "2025-09-07", views: 5, category: "전체" },
];

const Star = ({ filled=false }: { filled?: boolean }) => (
  <svg aria-hidden className="w-5 h-5" viewBox="0 0 24 24" fill={filled ? "#FFC107" : "none"} stroke="#FFC107" strokeWidth="2">
    <path d="M12 .75l3.09 6.26 6.91 1.01-5 4.87 1.18 6.86L12 16.98 5.82 20.75 7 13.89 2 8.02l6.91-1.01L12 .75z"/>
  </svg>
);

const PersonIcon = () => (
  <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor"><path d="M12 12a5 5 0 1 0-5-5 5 5 0 0 0 5 5zm0 2c-5 0-9 2.5-9 5.5V22h18v-2.5C21 16.5 17 14 12 14z"/></svg>
);

const MenuIcon = () => (
  <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor"><path d="M3 6h18v2H3zm0 5h18v2H3zm0 5h18v2H3z"/></svg>
);

const Arrow = ({ dir = "right" }: { dir?: "left" | "right" }) => (
  <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor"
       style={{ transform: dir === "left" ? "rotate(180deg)" : undefined }}>
    <path d="M10 17l5-5-5-5v10z" />
  </svg>
);

export default function NoticePage() {
  const [tab, setTab] = useState<Notice["category"] | "전체">("전체");
  const [page, setPage] = useState(1);
  const pageSize = 10;

  const tabs: Array<Notice["category"]> = ["전체", "중요 공지", "자주 묻는 질문"];

  const filtered = useMemo(() => {
    if (tab === "전체") return mockNotices;
    return mockNotices.filter(n => n.category === tab);
  }, [tab]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / pageSize));
  const current = filtered.slice((page - 1) * pageSize, page * pageSize);

  return (
    <div className="min-h-screen bg-white">
      {/* 상단 헤더 */}
      <header className="sticky top-0 z-10 bg-white/80 backdrop-blur border-b">
        <div className="mx-auto max-w-5xl px-4 h-14 flex items-center justify-between">
          <div className="flex items-center gap-2">
            {/* 로고 대체 텍스트 */}
            <span className="text-2xl font-extrabold text-yellow-500 select-none">즉행</span>
          </div>
          <div className="flex items-center gap-4 text-gray-600">
            <PersonIcon />
            <MenuIcon />
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-5xl px-4 py-10">
        {/* 페이지 타이틀 */}
        <h1 className="text-3xl font-extrabold text-center mb-8">공지사항</h1>

        {/* 탭 */}
        <div className="w-full overflow-x-auto">
          <div className="inline-flex rounded-md border bg-white">
            {tabs.map(t => {
              const active = t === tab;
              return (
                <button
                  key={t}
                  onClick={() => { setTab(t); setPage(1); }}
                  className={`px-5 py-2 text-sm md:text-base border-r last:border-r-0
                    ${active ? "bg-gray-100 font-semibold" : "bg-white hover:bg-gray-50"}`}
                >
                  {t}
                </button>
              );
            })}
          </div>
        </div>

        {/* 리스트 헤더 (그리드) */}
        <div className="mt-6 border rounded-lg overflow-hidden">
          <div className="grid grid-cols-[64px_1fr_64px_120px_72px] items-center px-4 py-3 text-sm text-gray-500 bg-gray-50">
            <span className="text-center">#</span>
            <span>제목</span>
            <span className="text-center">중요</span>
            <span className="text-center">작성일</span>
            <span className="text-center">조회</span>
          </div>

          {/* 항목들 */}
          <ul className="divide-y">
            {current.map((n) => (
              <li key={n.id} className="grid grid-cols-[64px_1fr_64px_120px_72px] items-center px-4 py-4">
                <span className="text-center text-gray-500">{n.id}</span>
                <button className="text-left truncate hover:underline">
                  {n.title}
                </button>
                <div className="flex justify-center">{n.isImportant ? <Star filled /> : <Star />}</div>
                <span className="text-center text-gray-700">
                  {new Date(n.date).toLocaleDateString("ko-KR", { year: "numeric", month: "numeric", day: "numeric" })}
                </span>
                <span className="text-center text-gray-700">조회 {n.views}</span>
              </li>
            ))}
            {current.length === 0 && (
              <li className="px-4 py-10 text-center text-gray-500">게시물이 없습니다.</li>
            )}
          </ul>
        </div>

        {/* 페이지네이션 */}
        <div className="mt-8 flex items-center justify-center gap-1 text-gray-500">
          <button
            className="px-2 py-1 rounded hover:bg-gray-100 disabled:opacity-40"
            disabled={page === 1}
            onClick={() => setPage(p => Math.max(1, p - 1))}
            aria-label="이전"
          >
            <Arrow dir="left" />
          </button>

          {Array.from({ length: totalPages }).map((_, idx) => {
            const p = idx + 1;
            const active = p === page;
            return (
              <button
                key={p}
                onClick={() => setPage(p)}
                className={`w-8 h-8 rounded-full text-sm 
                  ${active ? "bg-yellow-400 text-white" : "hover:bg-gray-100"}`}
              >
                {p}
              </button>
            );
          })}

          <button
            className="px-2 py-1 rounded hover:bg-gray-100 disabled:opacity-40"
            disabled={page === totalPages}
            onClick={() => setPage(p => Math.min(totalPages, p + 1))}
            aria-label="다음"
          >
            <Arrow />
          </button>
        </div>
      </main>
    </div>
  );
}
