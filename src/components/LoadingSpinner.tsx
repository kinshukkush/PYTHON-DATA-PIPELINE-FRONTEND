export default function LoadingSpinner() {
  return (
    <div className="flex items-center justify-center py-20">
      <div className="relative">
        {/* Outer ring */}
        <div className="w-16 h-16 border-4 border-cyan-500/30 border-t-cyan-500 rounded-full animate-spin"></div>
        {/* Middle ring */}
        <div className="absolute top-2 left-2 w-12 h-12 border-4 border-blue-500/30 border-t-blue-500 rounded-full animate-spin" style={{ animationDirection: 'reverse', animationDuration: '1s' }}></div>
        {/* Inner ring */}
        <div className="absolute top-4 left-4 w-8 h-8 border-4 border-purple-500/30 border-t-purple-500 rounded-full animate-spin" style={{ animationDuration: '0.75s' }}></div>
        {/* Center dot */}
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-2 h-2 bg-gradient-to-r from-cyan-400 to-purple-500 rounded-full pulse-glow"></div>
      </div>
    </div>
  );
}
