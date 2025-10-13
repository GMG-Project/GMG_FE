"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import SelectArea from "@/components/SelectArea";

export default function SelectAreaPage() {
    const router = useRouter();
    const [selectedAreas, setSelectedAreas] = useState<string[]>([]);

    const handleAreaSelect = (area: string) => {
        if (area === "전체 선택") {
            setSelectedAreas(selectedAreas.length === 17 ? [] : [
                "서울특별시", "부산광역시", "대구광역시", "인천광역시",
                "광주광역시", "대전광역시", "울산광역시", "세종특별자치시",
                "경기도", "강원특별자치도", "충청북도", "충청남도",
                "전북특별자치도", "전라남도", "경상북도", "경상남도",
                "제주특별자치도"
            ]);
        } else {
            setSelectedAreas(prev => 
                prev.includes(area) 
                    ? prev.filter(a => a !== area)
                    : [...prev, area]
            );
        }
    };

    const handleNext = () => {
        if (selectedAreas.length === 0) {
            alert("최소 하나의 지역을 선택해주세요.");
            return;
        }
        
        // 선택된 지역들을 쿼리 파라미터로 GameMode 페이지로 이동
        const areasParam = selectedAreas.map(area => encodeURIComponent(area)).join(",");
        router.push(`/GameMode?areas=${areasParam}`);
    };

    return (
        <main className="min-h-screen w-full bg-yellow-400 flex flex-col items-center justify-center p-6">
            {/* 상단 로고/타이틀 */}
            <h1 className="mb-6 text-5xl sm:text-6xl font-extrabold text-white tracking-tight">즉행</h1>

            {/* 컨테이너 카드 */}
            <section className="relative w-full max-w-4xl bg-white rounded-2xl shadow-xl p-6">
                <header className="mb-6">
                    <h2 className="text-xl sm:text-2xl font-extrabold tracking-tight text-gray-900">
                        게임에 포함할 지역을 선택하세요.
                    </h2>
                </header>

                <div className="mb-2">
                    <SelectArea selected={selectedAreas} onSelect={handleAreaSelect} />
                </div>

                {/* 우하단 진행 버튼 */}
                <button
                    onClick={handleNext}
                    disabled={selectedAreas.length === 0}
                    aria-label="다음 단계"
                    className="absolute -bottom-5 -right-5 h-12 w-12 rounded-full bg-yellow-400 shadow-lg flex items-center justify-center hover:bg-yellow-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                    <img src="/rightArrow.svg" alt="다음" className="h-6 w-6" />
                </button>
            </section>
        </main>
    );
}
