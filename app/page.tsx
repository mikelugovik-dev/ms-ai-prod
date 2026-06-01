"use client";

import { useState, useRef, useEffect } from "react";

export default function Home() {
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    telegram: "",
    message: "",
  });
  const [phoneError, setPhoneError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [showreelMuted, setShowreelMuted] = useState(true);
  const showreelRef = useRef<HTMLVideoElement>(null);
  const [activeCase, setActiveCase] = useState<{ video: string; format: string } | null>(null);
  const popupVideoRef = useRef<HTMLVideoElement>(null);

  const formatPhone = (value: string) => {
    const digits = value.replace(/\D/g, "");
    if (digits.length === 0) return "";
    // If user typed 8 or 7 as first digit — treat as country code, take the rest
    let d: string;
    if (digits.length >= 2 && (digits[0] === "7" || digits[0] === "8")) {
      d = digits.slice(1, 11);
    } else {
      d = digits.slice(0, 10);
    }
    // If only "8" or "7" typed so far — show +7 ( and wait for more digits
    if (digits.length === 1 && (digits[0] === "7" || digits[0] === "8")) {
      return "+7 (";
    }
    if (d.length === 0) return "";
    if (d.length <= 3) return `+7 (${d}`;
    if (d.length <= 6) return `+7 (${d.slice(0, 3)}) ${d.slice(3)}`;
    if (d.length <= 8) return `+7 (${d.slice(0, 3)}) ${d.slice(3, 6)}-${d.slice(6)}`;
    return `+7 (${d.slice(0, 3)}) ${d.slice(3, 6)}-${d.slice(6, 8)}-${d.slice(8, 10)}`;
  };

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const raw = e.target.value;
    const formatted = formatPhone(raw);
    setFormData({ ...formData, phone: formatted });
    const digits = formatted.replace(/\D/g, "");
    if (digits.length > 0 && digits.length < 11) {
      setPhoneError("Введите 10 цифр номера");
    } else {
      setPhoneError("");
    }
  };

  const isPhoneValid = () => {
    const digits = formData.phone.replace(/\D/g, "");
    return digits.length === 11;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isPhoneValid()) {
      setPhoneError("Введите корректный номер телефона");
      return;
    }
    setIsSubmitting(true);

    try {
      await fetch("/api/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
    } catch {
      // silently continue — form still shows success
    }

    setIsSubmitting(false);
    setSubmitted(true);
    setFormData({ name: "", phone: "", telegram: "", message: "" });
  };

  const scrollToForm = () => {
    document.getElementById("order-form")?.scrollIntoView({ behavior: "smooth" });
  };

  const toggleShowreelSound = () => {
    if (showreelRef.current) {
      showreelRef.current.muted = !showreelRef.current.muted;
      setShowreelMuted(showreelRef.current.muted);
    }
  };

  const openCase = (video: string, format: string) => {
    setActiveCase({ video, format });
  };

  const closeCase = () => {
    setActiveCase(null);
  };

  const casesRef = useRef<HTMLDivElement>(null);
  const isDragging = useRef(false);
  const startX = useRef(0);
  const scrollLeft = useRef(0);

  const handleMouseDown = (e: React.MouseEvent) => {
    isDragging.current = true;
    startX.current = e.pageX - (casesRef.current?.offsetLeft || 0);
    scrollLeft.current = casesRef.current?.scrollLeft || 0;
    if (casesRef.current) {
      casesRef.current.style.cursor = "grabbing";
    }
  };

  const handleMouseUp = () => {
    isDragging.current = false;
    if (casesRef.current) {
      casesRef.current.style.cursor = "grab";
    }
  };

  const handleMouseLeave = () => {
    isDragging.current = false;
    if (casesRef.current) {
      casesRef.current.style.cursor = "grab";
    }
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging.current || !casesRef.current) return;
    e.preventDefault();
    const x = e.pageX - (casesRef.current?.offsetLeft || 0);
    const walk = (x - startX.current) * 1.5;
    casesRef.current.scrollLeft = scrollLeft.current - walk;
  };

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("animate-in");
          }
        });
      },
      { threshold: 0.15 }
    );
    document.querySelectorAll(".scroll-animate").forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  const services = [
    {
      title: "AI-креативы",
      description: "Создаем уникальный визуал, который собирает охваты",
      number: "01",
    },
    {
      title: "Рилсы",
      description: "Создаем короткие видео для соцсетей для вашего бизнеса",
      number: "02",
    },
    {
      title: "Рекламные видео",
      description: "Рекламные видео, промо видео для ваших социальных сетей",
      number: "03",
    },
    {
      title: "ИИ анимация",
      description: "Анимация карточек товаров, постов в социальные сети",
      number: "04",
    },
  ];

  const processSteps = [
    {
      number: "1",
      title: "Обсуждение",
      description: "Определяем цели и задачи проекта, обсуждаем концепцию и формат видео, слушаем ваши идеи и пожелания",
    },
    {
      number: "2",
      title: "Сценарий",
      description: "Разрабатываем детальное техническое задание, прописываем сценарий и утверждаем финальную структуру",
    },
    {
      number: "3",
      title: "Раскадровка",
      description: "Создаём покадровую визуализацию сценария, согласовываем каждую сцену перед запуском производства",
    },
    {
      number: "4",
      title: "Генерация",
      description: "Производим финальный монтаж, добавляем графику и звук, сдаём готовый проект в срок",
    },
  ];

  const cases = [
    { id: 1, format: "vertical", title: "Кейс 1", video: "/case-1-vertical.mp4" },
    { id: 2, format: "horizontal", title: "Кейс 2", video: "/case-2-horizontal.mp4" },
    { id: 3, format: "vertical", title: "Кейс 3", video: "/case-3-vertical.mp4" },
    { id: 4, format: "horizontal", title: "Кейс 4", video: "/case-4-horizontal.mp4" },
    { id: 5, format: "vertical", title: "Кейс 5", video: "/case-5-vertical.mp4" },
    { id: 6, format: "vertical", title: "Кейс 6", video: "/case-6-vertical.mp4" },
    { id: 7, format: "vertical", title: "Кейс 7", video: "/case-7-vertical.mp4" },
    { id: 8, format: "vertical", title: "Кейс 8", video: "/case-8-vertical.mp4" },
    { id: 9, format: "vertical", title: "Кейс 9", video: "/case-9-vertical.mp4" },
    { id: 10, format: "vertical", title: "Кейс 10", video: "/case-10-vertical.mp4" },
    { id: 11, format: "vertical", title: "Кейс 11", video: "/case-11-vertical.mp4" },
    { id: 12, format: "vertical", title: "Кейс 12", video: "/case-12-vertical.mp4" },
    { id: 13, format: "vertical", title: "Кейс 13", video: "/case-13-vertical.mp4" },
  ];

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Navigation */}
      <nav className="bg-black">
        <div className="max-w-[1400px] mx-auto px-8 py-6 flex items-center justify-between">
          <div className="text-2xl md:text-3xl font-bold tracking-tight">MS AI</div>
          <button
            onClick={scrollToForm}
            className="px-8 py-3 bg-white text-black text-base font-medium rounded-full hover:bg-white/80 transition-colors"
          >
            Заказать
          </button>
        </div>
      </nav>

      {/* Showreel */}
      <section className="pt-8 pb-12 px-6">
        <div className="max-w-6xl mx-auto scroll-animate">
          <div className="relative aspect-[16/9] rounded-2xl overflow-hidden group">
            <video
              ref={showreelRef}
              className="w-full h-full object-cover"
              autoPlay
              muted
              loop
              playsInline
            >
              <source src="/showreel.mp4" type="video/mp4" />
            </video>
            <button
              onClick={toggleShowreelSound}
              className="absolute bottom-4 right-4 w-12 h-12 bg-black/60 backdrop-blur-sm rounded-full flex items-center justify-center opacity-100 md:opacity-0 md:group-hover:opacity-100 transition-opacity hover:bg-black/80"
            >
              {showreelMuted ? (
                <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2" />
                </svg>
              ) : (
                <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.536 8.464a5 5 0 010 7.072M18.364 5.636a9 9 0 010 12.728M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" />
                </svg>
              )}
            </button>
          </div>
        </div>
      </section>

      {/* Hero Text */}
      <section className="py-16 px-6">
        <div className="max-w-5xl mx-auto scroll-animate">
          <h1 className="text-3xl md:text-5xl lg:text-6xl font-medium leading-[1.15] tracking-tight">
            Создаем ИИ-креативы, рилсы,
            <br className="hidden md:block" />
            видео для социальных сетей.
          </h1>
          <p className="text-xl md:text-2xl text-white/40 mt-8 max-w-2xl">
            И превращаем ваши идеи в вирусный контент
          </p>
          <button
            onClick={scrollToForm}
            className="mt-12 px-10 py-4 bg-white text-black font-medium rounded-full hover:bg-white/80 transition-colors"
          >
            Заказать ИИ видео
          </button>
        </div>
      </section>

      {/* Cases */}
      <section className="py-16">
        <div className="px-6 mb-8">
          <div className="max-w-7xl mx-auto scroll-animate">
            <p className="text-sm text-white/40 uppercase tracking-widest mb-2">Кейсы</p>
            <h2 className="text-2xl md:text-3xl font-medium">Наши работы</h2>
          </div>
        </div>

        <div
          ref={casesRef}
          className="flex gap-4 overflow-x-auto px-6 pb-4 cursor-grab select-none items-center"
          style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
          onMouseDown={handleMouseDown}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseLeave}
          onMouseMove={handleMouseMove}
        >
          <div className="flex-shrink-0 w-8" />
          {cases.map((item) => (
            <div
              key={item.id}
              onClick={() => openCase(item.video, item.format)}
              className={`flex-shrink-0 bg-white/5 rounded-2xl overflow-hidden cursor-pointer group/case ${
                item.format === "vertical"
                  ? "w-[225px] md:w-[281px] h-[400px] md:h-[500px]"
                  : "w-[85vw] sm:w-[75vw] md:w-[711px] lg:w-[889px] h-[240px] sm:h-[300px] md:h-[400px] lg:h-[500px]"
              }`}
            >
              <div className="relative w-full h-full">
                <video
                  className="w-full h-full object-cover"
                  autoPlay
                  muted
                  loop
                  playsInline
                >
                  <source src={item.video} type="video/mp4" />
                </video>
                <div className="absolute inset-0 bg-black/0 group-hover/case:bg-black/30 transition-colors flex items-center justify-center">
                  <svg className="w-14 h-14 text-white opacity-0 group-hover/case:opacity-100 transition-opacity drop-shadow-lg" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M8 5v14l11-7z" />
                  </svg>
                </div>
              </div>
            </div>
          ))}
          <div className="flex-shrink-0 w-8" />
        </div>
      </section>

      {/*
      <section id="services" className="py-16 px-6">
        <div className="max-w-5xl mx-auto scroll-animate">
          <p className="text-sm text-white/40 uppercase tracking-widest mb-4">Услуги</p>
          <h2 className="text-2xl md:text-3xl font-medium mb-12">Что мы делаем</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {services.map((service, index) => (
              <div
                key={index}
                className="group relative aspect-[4/3] bg-white/10 rounded-xl overflow-hidden cursor-pointer"
              >
                
                <div className="absolute inset-0 bg-white/5" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
                <div className="absolute bottom-0 left-0 right-0 p-6 md:p-8">
                  <h3 className="text-xl md:text-2xl font-medium text-white group-hover:text-white/80 transition-colors">
                    {service.title}
                  </h3>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
      */}
      
      {/* Pipeline */}
      <section className="py-16 px-6">
        <div className="max-w-5xl mx-auto scroll-animate">
          <p className="text-sm text-white/40 uppercase tracking-widest mb-4">Процесс</p>
          <h2 className="text-2xl md:text-3xl font-medium mb-16">Как мы работаем</h2>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-6">
            {processSteps.map((step, index) => (
              <div key={index} className="flex flex-col items-center relative">
                <div className="w-20 h-20 md:w-24 md:h-24 rounded-full bg-white text-black flex items-center justify-center text-lg md:text-xl font-medium">
                  {step.number}
                </div>
                <h3 className="mt-4 text-sm font-medium text-center">{step.title}</h3>
                <p className="mt-2 text-xs text-white/50 text-center max-w-[140px]">{step.description}</p>
                {index < processSteps.length - 1 && (
                  <svg
                    className="w-6 h-6 text-white/20 hidden md:block absolute top-10 -right-[18px]"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5l7 7-7 7" />
                  </svg>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Order Form */}
      <section id="order-form" className="py-6 px-6">
        <div className="max-w-xl mx-auto bg-white text-black rounded-2xl p-10 md:p-16 scroll-animate">
          <p className="text-sm text-black/40 uppercase tracking-widest mb-4">Заказать</p>
          <h2 className="text-2xl md:text-3xl font-medium mb-2">Оставьте заявку</h2>
          <p className="text-black/50 mb-12">Мы свяжемся с вами в течение часа</p>

          {submitted ? (
            <div className="p-8 bg-black/5 rounded-lg text-center">
              <p className="text-xl font-medium">Заявка отправлена</p>
              <p className="text-black/50 mt-2">Мы скоро свяжемся с вами</p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-0 py-4 bg-transparent border-b border-black/10 focus:border-black focus:outline-none transition-colors placeholder:text-black/40"
                  placeholder="Имя"
                />
              </div>

              <div>
                <input
                  type="tel"
                  inputMode="numeric"
                  required
                  value={formData.phone}
                  onChange={handlePhoneChange}
                  className={`w-full px-0 py-4 bg-transparent border-b focus:outline-none transition-colors placeholder:text-black/40 ${
                    phoneError ? "border-red-400 focus:border-red-500" : "border-black/10 focus:border-black"
                  }`}
                  placeholder="+7 (___) ___-__-__"
                />
                {phoneError && (
                  <p className="text-red-500 text-xs mt-1">{phoneError}</p>
                )}
              </div>

              <div>
                <input
                  type="text"
                  required
                  value={formData.telegram}
                  onChange={(e) => setFormData({ ...formData, telegram: e.target.value })}
                  className="w-full px-0 py-4 bg-transparent border-b border-black/10 focus:border-black focus:outline-none transition-colors placeholder:text-black/40"
                  placeholder="Telegram"
                />
              </div>

              <div>
                <textarea
                  rows={4}
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  className="w-full px-0 py-4 bg-transparent border-b border-black/10 focus:border-black focus:outline-none transition-colors resize-none placeholder:text-black/40"
                  placeholder="Расскажите о проекте"
                />
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full mt-8 py-4 bg-black text-white font-medium rounded-full hover:bg-black/80 transition-colors disabled:opacity-50"
              >
                {isSubmitting ? "Отправка..." : "Отправить"}
              </button>
            </form>
          )}
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 px-6">
        <div className="max-w-5xl mx-auto">
          <p className="text-white/50 text-sm">© 2025 MS AI</p>
        </div>
      </footer>

      {/* Case Popup */}
      {activeCase && (
        <div
          className="fixed inset-0 z-[100] bg-black/80 backdrop-blur-sm flex items-center justify-center p-6"
          onClick={closeCase}
        >
          <div
            className={`relative ${
              activeCase.format === "vertical"
                ? "max-w-sm w-full max-h-[85vh]"
                : "max-w-4xl w-full max-h-[85vh]"
            }`}
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={closeCase}
              className="absolute -top-12 right-0 w-10 h-10 bg-white/10 rounded-full flex items-center justify-center hover:bg-white/20 transition-colors z-10"
            >
              <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
            <div className="rounded-2xl overflow-hidden bg-black">
              <video
                ref={popupVideoRef}
                className="w-full max-h-[85vh] object-contain"
                autoPlay
                controls
                playsInline
                loop
              >
                <source
                  src={activeCase.video}
                  type={activeCase.video.endsWith(".mov") ? "video/quicktime" : "video/mp4"}
                />
              </video>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}