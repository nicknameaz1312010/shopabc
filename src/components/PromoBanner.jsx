import { useEffect, useState } from 'react'

export default function PromoBanner({ targetDate = '2026-07-31T23:59:59' }) {
  const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 })

  useEffect(() => {
    function tick() {
      const diff = new Date(targetDate).getTime() - Date.now()
      if (diff <= 0) return setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 })
      setTimeLeft({
        days: Math.floor(diff / (1000 * 60 * 60 * 24)),
        hours: Math.floor((diff / (1000 * 60 * 60)) % 24),
        minutes: Math.floor((diff / (1000 * 60)) % 60),
        seconds: Math.floor((diff / 1000) % 60),
      })
    }
    tick()
    const id = setInterval(tick, 1000)
    return () => clearInterval(id)
  }, [targetDate])

  return (
    <div className="relative overflow-hidden bg-gradient-to-r from-red-600 to-rose-700 text-white text-center py-2.5 px-4">
      <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'repeating-linear-gradient(45deg, transparent, transparent 10px, rgba(255,255,255,0.1) 10px, rgba(255,255,255,0.1) 20px)' }} />
      <div className="relative z-10 flex items-center justify-center gap-3 flex-wrap text-xs md:text-sm">
        <span className="font-semibold">🔥 SIÊU SALE CUỐI THÁNG</span>
        <span className="hidden md:inline">•</span>
        <span>Giảm đến 30% + Miễn phí vận chuyển</span>
        <span className="hidden md:inline">•</span>
        <div className="flex items-center gap-1">
          <span>Kết thúc trong:</span>
          <span className="inline-flex items-center gap-0.5 font-mono font-bold">
            <TimeBlock value={timeLeft.days} unit="Ngày" />
            <span className="mx-0.5">:</span>
            <TimeBlock value={timeLeft.hours} unit="Giờ" />
            <span className="mx-0.5">:</span>
            <TimeBlock value={timeLeft.minutes} unit="Phút" />
            <span className="mx-0.5">:</span>
            <TimeBlock value={timeLeft.seconds} unit="Giây" />
          </span>
        </div>
      </div>
    </div>
  )
}

function TimeBlock({ value, unit }) {
  return (
    <span className="inline-flex items-center justify-center min-w-[22px] h-5 rounded bg-white/20 text-[11px] font-bold px-1" title={unit}>
      {String(value).padStart(2, '0')}
    </span>
  )
}
