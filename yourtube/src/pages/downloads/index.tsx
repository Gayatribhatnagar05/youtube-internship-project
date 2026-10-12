import DownloadsList from "@/components/DownloadsList";

export default function DownloadsPage() {
  return (
    <main className="flex-1 p-6 max-w-6xl mx-auto">
      <h1 className="text-2xl font-bold mb-6 text-gray-900 dark:text-white">Your Downloads</h1>
      <DownloadsList />
    </main>
  );
}
