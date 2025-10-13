"use client";

import { useEffect, useMemo, useState } from "react";
import { Map, MapMarker, Polyline } from "react-kakao-maps-sdk";
import useKakaoLoader from "@/components/UseKaKaoLoader";
import { getSampleTripData, TripDetailData } from "@/data/sampleTripData";

export default function ScheduleSummaryPage() {
  useKakaoLoader();

  // TODO: 선택한 일정(여행지/일자)을 상태/서버에서 받아오도록 교체
  const [trip, setTrip] = useState<TripDetailData | null>(null);
  const [currentDay, setCurrentDay] = useState<number>(1);
  const [showConfirm, setShowConfirm] = useState(false);

  useEffect(() => {
    setTrip(getSampleTripData(1));
  }, []);

  const dayItems = useMemo(() => {
    if (!trip) return [] as TripDetailData["days"][number]["items"];
    return trip.days.find(d => d.day === currentDay)?.items || [];
  }, [trip, currentDay]);

  const positions = useMemo(() => {
    return dayItems
      .filter(p => typeof p.lat === "number" && typeof p.lng === "number")
      .map(p => ({ lat: p.lat as number, lng: p.lng as number, name: p.name }));
  }, [dayItems]);

  const center = useMemo(() => {
    if (positions.length === 0) return { lat: 37.5665, lng: 126.9780 };
    return positions[Math.floor(positions.length / 2)];
  }, [positions]);

  return (
    <main className="min-h-screen w-full bg-gray-50">
      {/* 상단 바 대체: 로고/정보 */}
      <div className="sticky top-0 z-10 bg-white border-b">
        <div className="mx-auto max-w-7xl px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <img src="/yellologo.png" alt="logo" className="h-7 w-auto" />
            <h1 className="text-lg font-bold">일정 요약</h1>
            {trip && (
              <span className="text-gray-500 text-sm">{trip.title}</span>
            )}
          </div>
          <div className="flex items-center gap-2">
            <button onClick={() => setShowConfirm(true)} className="h-9 px-3 rounded-md border bg-white text-sm">일정 확정</button>
          </div>
        </div>
      </div>

      {/* 본문 2컬럼 레이아웃 */}
      <div className="mx-auto max-w-7xl grid grid-cols-1 lg:grid-cols-12 gap-4 p-4">
        {/* 좌측: 검색/리스트 */}
        <section className="lg:col-span-4 bg-white rounded-xl shadow-sm border p-3">
          <div className="mb-3">
            <div className="text-sm text-gray-500">오늘부터 <span className="text-yellow-600 font-semibold">{trip ? trip.days.length : 0}</span>일간</div>
            <div className="mt-2">
              <input className="w-full h-10 rounded-md border px-3 text-sm" placeholder="장소 검색" />
            </div>
          </div>

          <div className="flex gap-2 mb-3">
            {trip?.days.map(d => (
              <button
                key={d.day}
                onClick={() => setCurrentDay(d.day)}
                className={["h-8 rounded-md px-3 text-sm border", currentDay === d.day ? "bg-yellow-100 border-yellow-300" : "bg-white"].join(" ")}
              >
                {d.day}일차
              </button>
            ))}
          </div>

          <ul className="space-y-3 max-h-[520px] overflow-auto pr-1">
            {dayItems.map((item, idx) => (
              <li key={item.id} className="flex gap-3">
                <img src={item.image} alt={item.name} className="h-16 w-24 rounded object-cover border" />
                <div className="flex-1">
                  <div className="text-sm font-semibold">{item.name}</div>
                  {item.description && (
                    <div className="text-xs text-gray-500 line-clamp-2">{item.description}</div>
                  )}
                  <div className="mt-1 text-[11px] text-gray-400">{idx + 1}번째· {item.tel || "연락처 없음"}</div>
                </div>
                <button className="self-start h-8 px-2 rounded border text-xs">추가</button>
              </li>
            ))}
          </ul>
        </section>

        {/* 우측: 지도 + 경로 요약 */}
        <section className="lg:col-span-8 bg-white rounded-xl shadow-sm border p-3">
          <div className="mb-2 text-gray-800 font-semibold">일정 요약</div>
          <div className="h-[520px] w-full rounded-md overflow-hidden">
            <Map center={center} level={6} style={{ width: "100%", height: "100%" }}>
              {positions.map((pos, i) => (
                <MapMarker key={`${pos.lat}-${pos.lng}-${i}`} position={{ lat: pos.lat, lng: pos.lng }}>
                  <div className="text-xs font-semibold">{pos.name}</div>
                </MapMarker>
              ))}
              {positions.length >= 2 && (
                <Polyline
                  path={[positions.map(p => ({ lat: p.lat, lng: p.lng }))]}
                  strokeWeight={4}
                  strokeColor="#f59e0b"
                  strokeOpacity={0.9}
                  strokeStyle="solid"
                />
              )}
            </Map>
          </div>

          {trip && (
            <div className="mt-3">
              <div className="text-sm font-bold">여행일정 {currentDay}</div>
              <ol className="mt-2 text-sm text-gray-700 list-decimal list-inside space-y-1">
                {positions.map((p, i) => (
                  <li key={i}>{p.name}</li>
                ))}
              </ol>
            </div>
          )}
        </section>
      </div>

      {/* 일정 확정 모달 */}
      {showConfirm && trip && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="absolute inset-0 bg-black/30" onClick={() => setShowConfirm(false)} />
          <div className="relative bg-white rounded-2xl shadow-xl w-[min(720px,92vw)] max-h-[80vh] overflow-auto">
            <div className="flex items-center justify-between px-6 py-4 border-b">
              <div className="text-lg font-extrabold">여행이름1</div>
              <button onClick={() => setShowConfirm(false)} aria-label="닫기" className="h-8 w-8 rounded-full hover:bg-gray-100 flex items-center justify-center">✕</button>
            </div>
            <div className="px-6 py-4 text-sm text-gray-600">{trip.destination} · 일정: 2025. 9. 14. - 2025. 9. 15.</div>
            <div className="px-6 pb-2 space-y-4">
              {trip.days.map(d => (
                <div key={d.day} className="flex gap-4 items-start text-gray-800">
                  <div className="w-16 shrink-0 font-semibold">Day {d.day}</div>
                  <div className="flex-1">
                    {d.items.map(i => i.name).join(" - ")}
                  </div>
                </div>
              ))}
            </div>
            <div className="px-6 py-5 border-t">
              <button onClick={() => setShowConfirm(false)} className="w-full h-11 rounded-md bg-yellow-400 text-white font-semibold shadow hover:brightness-95">여행 일정 확정하기</button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}

