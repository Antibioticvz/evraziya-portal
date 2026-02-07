export default function DashboardLoading() {
  return (
    <div className="flex items-center justify-center py-24">
      <div className="flex flex-col items-center gap-4">
        <div className="h-10 w-10 animate-spin rounded-full border-4 border-gray-200 border-t-evraziya-purple" />
        <p className="text-sm text-gray-500">Загрузка...</p>
      </div>
    </div>
  )
}
