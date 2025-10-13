"use client";

import { useState } from "react";

export default function MyInfoPage() {
  const [name, setName] = useState("곽서원");
  const [nickname, setNickname] = useState("보라색");
  const [email, setEmail] = useState("abc@gmail.com");
  const [password, setPassword] = useState("********");
  const [phone, setPhone] = useState("010-1234-1231");

  return (
    <main className="min-h-screen bg-white">
      <div className="mx-auto max-w-5xl px-4 py-10">
        <header className="flex items-start justify-between mb-8">
          <div>
            <h1 className="text-3xl font-extrabold">내 정보 관리</h1>
            <p className="mt-2 text-gray-400">프로필 수정</p>
          </div>
          <div className="flex items-center justify-center h-28 w-28 rounded-full border-4 border-yellow-400">
            <div className="h-16 w-16 rounded-full bg-yellow-400/90 flex items-center justify-center text-white text-3xl">👤</div>
          </div>
        </header>

        <section className="space-y-6">
          <LabeledInput label="이름" value={name} onChange={setName} placeholder="이름" />
          <LabeledInput label="닉네임" value={nickname} onChange={setNickname} placeholder="닉네임" />
          <LabeledInput label="이메일 주소" value={email} onChange={setEmail} type="email" placeholder="email@example.com" />
          <LabeledInput label="비밀번호" value={password} onChange={setPassword} type="password" placeholder="********" />
          <LabeledInput label="휴대폰 번호" value={phone} onChange={setPhone} placeholder="010-0000-0000" />

          <div className="pt-2 flex gap-3">
            <button className="h-10 px-5 rounded-md bg-yellow-400 text-white font-semibold shadow hover:brightness-95">저장</button>
            <button className="h-10 px-5 rounded-md border">취소</button>
          </div>
        </section>

        <footer className="mt-16 grid gap-2 text-sm text-gray-400 justify-end">
          <button className="text-right hover:underline">계정 삭제</button>
          <button className="text-right hover:underline">약관 및 정책</button>
          <button className="text-right hover:underline">개인정보처리방침</button>
        </footer>
      </div>
    </main>
  );
}

type LabeledInputProps = {
  label: string;
  value: string;
  onChange: (v: string) => void;
  type?: string;
  placeholder?: string;
};

function LabeledInput({ label, value, onChange, type = "text", placeholder }: LabeledInputProps) {
  return (
    <div>
      <div className="mb-2 text-sm text-gray-600">{label}</div>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full h-12 rounded-md border px-4 text-gray-800 focus:outline-none focus:ring-2 focus:ring-yellow-400"
      />
    </div>
  );
}