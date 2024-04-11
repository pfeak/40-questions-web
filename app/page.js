import Link from "next/link";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <div>主页</div>

      <Link href="/year">每年</Link><br />

      <Link href="/decade">每10年</Link>

    </main>
  );
}
