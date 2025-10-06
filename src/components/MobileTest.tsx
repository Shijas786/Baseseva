export function MobileTest() {
  return (
    <div className="min-h-screen bg-red-500 flex items-center justify-center p-4">
      <div className="bg-white p-8 rounded-lg shadow-lg text-center">
        <h1 className="text-2xl font-bold text-gray-900 mb-4">Mobile Test</h1>
        <p className="text-gray-600 mb-4">If you can see this, the app is working on mobile!</p>
        <div className="bg-green-100 p-4 rounded-lg">
          <p className="text-green-800 font-medium">✅ Mobile rendering successful!</p>
        </div>
      </div>
    </div>
  );
}
