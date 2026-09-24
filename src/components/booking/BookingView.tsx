import React, { useState, useEffect } from "react";
import {
  Calendar as CalendarIcon,
  Clock,
  User,
  Phone,
  Mail,
  Loader2,
  CheckCircle2,
  X,
  AlertTriangle,
  Users,
  Activity,
  Sparkles,
  Stethoscope,
  Search,
  RefreshCw,
  Eye
} from "lucide-react";
import { type Language } from "../../i18n";
import "./booking.css";

interface BookingViewProps {
  currentLang?: Language;
  onNavigateHome?: () => void;
}

const APPOINTMENT_TYPES = [
  {
    id: "Ön Görüşme",
    icon: Users,
    label: { tr: "Ön Görüşme", en: "Consultation", ar: "استشارة أولية", de: "Erstberatung" },
    desc: {
      tr: "Süreci planlamak ve tanışmak için",
      en: "For process planning and initial introduction",
      ar: "لتخطيط خطة العلاج والتعارف الطبي",
      de: "Für Behandlungsplanung und Kennenlernen"
    }
  },
  {
    id: "Saç Analizi",
    icon: Activity,
    label: { tr: "Saç Analizi", en: "Hair Analysis", ar: "تحليل الشعر", de: "Haaranalyse" },
    desc: {
      tr: "Kök yapınızın detaylı incelenmesi",
      en: "Detailed examination of donor & graft density",
      ar: "فحص دقيق لكثافة البصيلات والمنطقة المانحة",
      de: "Detaillierte Analyse der Haardichte und Spenderzone"
    }
  },
  {
    id: "Bakım",
    icon: Sparkles,
    label: { tr: "Bakım (PRP vb.)", en: "Care & PRP", ar: "عناية وبلازما PRP", de: "Pflege & PRP" },
    desc: {
      tr: "PRP, Mezoterapi ve güçlendirme seansı",
      en: "PRP, Mesotherapy and revitalization",
      ar: "جلسات بلازما وميزوثيرابي لتقوية الجذور",
      de: "PRP, Mesotherapie und Stärkung"
    }
  },
  {
    id: "Kontrol",
    icon: Stethoscope,
    label: { tr: "Kontrol", en: "Post-op Checkup", ar: "فحص ما بعد العملية", de: "Nachkontrolle" },
    desc: {
      tr: "Ekim sonrası rutin takip ve inceleme",
      en: "Routine post-procedure checkup & guidance",
      ar: "متابعة دورية وفحص نتائج ما بعد الزراعة",
      de: "Routinemäßige Nachsorge und Auswertung"
    }
  }
];

export function BookingView({ currentLang = "tr", onNavigateHome }: BookingViewProps) {
  const [activeTab, setActiveTab] = useState<"book" | "manage" | "requests">("book");

  // Booking Flow State
  const [date, setDate] = useState<string>("");
  const [slots, setSlots] = useState<string[]>([]);
  const [loadingSlots, setLoadingSlots] = useState(false);
  const [selectedSlot, setSelectedSlot] = useState<string>("");
  const [formData, setFormData] = useState({ type: "Saç Analizi", name: "", phone: "", email: "" });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Patient Self-service Manage State
  const [managePhone, setManagePhone] = useState("");
  const [manageAppointments, setManageAppointments] = useState<any[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);
  const [cancelModalOpen, setCancelModalOpen] = useState<string | null>(null);
  const [isCancelling, setIsCancelling] = useState(false);

  // Clinic Requests Tracker State
  const [clinicRequests, setClinicRequests] = useState<any[]>([]);
  const [loadingRequests, setLoadingRequests] = useState(false);

  // Fetch slots whenever date changes
  useEffect(() => {
    if (!date) {
      setSlots([]);
      setSelectedSlot("");
      return;
    }

    let isMounted = true;
    setLoadingSlots(true);
    setSelectedSlot("");
    setErrorMessage(null);

    fetch(`/api/appointments/available?date=${date}&clinic=elifay`)
      .then((res) => {
        if (!res.ok) throw new Error("Slot hatası");
        return res.json();
      })
      .then((data) => {
        if (isMounted) {
          if (data.slots) setSlots(data.slots);
          else setSlots([]);
        }
      })
      .catch((err) => {
        if (isMounted) {
          console.error("Slot fetch error:", err);
          setSlots(["09:00", "10:00", "11:00", "12:00", "14:00", "15:00", "16:00", "17:00"]);
        }
      })
      .finally(() => {
        if (isMounted) setLoadingSlots(false);
      });

    return () => {
      isMounted = false;
    };
  }, [date]);

  // Load clinic requests when switching to requests tab
  const loadClinicRequests = () => {
    setLoadingRequests(true);
    fetch("/api/appointments?clinic=elifay")
      .then((res) => res.json())
      .then((data) => {
        if (data.success && data.appointments) {
          setClinicRequests(data.appointments);
        }
      })
      .catch((err) => console.error("Error loading clinic requests:", err))
      .finally(() => setLoadingRequests(false));
  };

  useEffect(() => {
    if (activeTab === "requests") {
      loadClinicRequests();
    }
  }, [activeTab]);

  // Handle Booking Submit
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    if (!formData.type) {
      setErrorMessage(currentLang === "en" ? "Please select an appointment type." : "Lütfen randevu türünü seçin.");
      return;
    }
    if (!date || !selectedSlot) {
      setErrorMessage(currentLang === "en" ? "Please select a date and time slot." : "Lütfen gün ve saat seçin.");
      return;
    }
    if (!formData.name.trim() || !formData.phone.trim()) {
      setErrorMessage(currentLang === "en" ? "Name and phone number are required." : "Ad ve telefon alanları zorunludur.");
      return;
    }

    try {
      setIsSubmitting(true);
      const [h, m] = selectedSlot.split(":").map(Number);
      const appointmentDate = new Date(date);
      appointmentDate.setHours(h, m, 0, 0);

      const res = await fetch("/api/appointments", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: formData.name.trim(),
          phone: formData.phone.trim(),
          email: formData.email.trim(),
          date: appointmentDate.toISOString(),
          type: formData.type,
          clinic: "elifay"
        })
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || "Randevu kaydı başarısız oldu.");
      }

      setIsSuccess(true);
    } catch (error: any) {
      console.error("Booking error:", error);
      setErrorMessage(error.message || (currentLang === "en" ? "Failed to create appointment." : "Randevu oluşturulamadı. Lütfen tekrar deneyiniz."));
    } finally {
      setIsSubmitting(false);
    }
  };

  // Patient Search by Phone
  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!managePhone.trim()) return;

    setIsSearching(true);
    setHasSearched(false);
    try {
      const res = await fetch(`/api/appointments?phone=${encodeURIComponent(managePhone.trim())}&clinic=elifay`);
      const data = await res.json();
      if (data.success && data.appointments) {
        setManageAppointments(data.appointments);
      } else {
        setManageAppointments([]);
      }
      setHasSearched(true);
    } catch (error) {
      console.error("Search error:", error);
      setManageAppointments([]);
      setHasSearched(true);
    } finally {
      setIsSearching(false);
    }
  };

  // Patient Cancel Appointment
  const handleCancelAppointment = async (id: string) => {
    try {
      setIsCancelling(true);
      const res = await fetch("/api/appointments/cancel", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, phone: managePhone })
      });
      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || "İptal işlemi başarısız.");
      }
      setManageAppointments((prev) =>
        prev.map((app) => (app.id === id ? { ...app, status: "CANCELLED_BY_PATIENT" } : app))
      );
      setCancelModalOpen(null);
    } catch (err: any) {
      alert(err.message || "İptal işlemi sırasında bir hata oluştu.");
    } finally {
      setIsCancelling(false);
    }
  };

  return (
    <div className="booking-wrapper">
      {/* Header Info */}
      <div className="booking-header">
        <span className="booking-badge">
          {currentLang === "en"
            ? "ONLINE APPOINTMENT & CONSULTATION"
            : currentLang === "ar"
            ? "حجز موعد واستشارة أونلاين"
            : currentLang === "de"
            ? "ONLINE TERMIN & BERATUNG"
            : "ONLINE RANDEVU & ÖN GÖRÜŞME"}
        </span>
        <h1>
          {currentLang === "en"
            ? "Book Your Consultation"
            : currentLang === "ar"
            ? "احجز موعد استشارتك مع إليف آي"
            : currentLang === "de"
            ? "Termin bei Elif Ay vereinbaren"
            : "Elif Ay ile Randevunuzu Oluşturun"}
        </h1>
        <p>
          {currentLang === "en"
            ? "Schedule your free hair analysis or consultation in Gaziantep. Instant SMS confirmation will be sent directly to your phone."
            : currentLang === "ar"
            ? "حدد موعدك للتحليل المجاني واستشارة زراعة الشعر في غازي عنتاب. ستصلك رسالة تأكيد فورية عبر SMS."
            : currentLang === "de"
            ? "Vereinbaren Sie Ihre kostenlose Haaranalyse oder Beratung in Gaziantep. Die SMS-Bestätigung erhalten Sie sofort auf Ihr Smartphone."
            : "Ücretsiz saç analizi ve ön görüşme randevunuzu kolayca planlayın. Randevu detaylarınız ve onay durumu SMS ile anında telefonunuza iletilir."}
        </p>
      </div>

      {/* Navigation Tabs */}
      <div className="booking-tabs">
        <button
          type="button"
          className={`booking-tab-btn ${activeTab === "book" ? "active" : ""}`}
          onClick={() => setActiveTab("book")}
        >
          <CalendarIcon style={{ width: 16, height: 16 }} />
          <span>{currentLang === "en" ? "Book Appointment" : "Randevu Al"}</span>
        </button>
        <button
          type="button"
          className={`booking-tab-btn ${activeTab === "manage" ? "active" : ""}`}
          onClick={() => setActiveTab("manage")}
        >
          <Search style={{ width: 16, height: 16 }} />
          <span>{currentLang === "en" ? "My Appointments" : "Randevumu Sorgula"}</span>
        </button>
        <button
          type="button"
          className={`booking-tab-btn ${activeTab === "requests" ? "active" : ""}`}
          onClick={() => setActiveTab("requests")}
        >
          <Eye style={{ width: 16, height: 16 }} />
          <span>{currentLang === "en" ? "View Requests" : "Talepleri Görüntüle"}</span>
        </button>
      </div>

      {/* Main Container Card */}
      <div className="booking-card">
        {/* SUCCESS VIEW */}
        {activeTab === "book" && isSuccess && (
          <div className="booking-success-box">
            <div className="booking-success-icon-wrap">
              <CheckCircle2 style={{ width: 44, height: 44 }} />
            </div>
            <h2>{currentLang === "en" ? "Appointment Received!" : "Randevunuz Alındı!"}</h2>
            <p>
              {currentLang === "en"
                ? "Your request has been successfully submitted to Elif Ay clinic. A confirmation SMS has been sent to your phone. We look forward to seeing you."
                : "Talebiniz başarıyla Elif Ay kliniğine ulaştı. İletişim numaranıza bilgilendirme SMS'i gönderilmiştir. En kısa sürede randevunuz incelenip uzmanlarımızca teyit edilecektir."}
            </p>
            <div style={{ display: "flex", gap: 12, justifyContent: "center", flexWrap: "wrap" }}>
              <button
                type="button"
                onClick={() => {
                  setIsSuccess(false);
                  setDate("");
                  setSelectedSlot("");
                  setFormData({ type: "Saç Analizi", name: "", phone: "", email: "" });
                }}
                className="booking-submit-btn"
                style={{ width: "auto" }}
              >
                Yeni Randevu Oluştur
              </button>
              {onNavigateHome && (
                <button
                  type="button"
                  onClick={onNavigateHome}
                  className="booking-tab-btn"
                  style={{
                    border: "1px solid var(--border-gold)",
                    padding: "14px 24px",
                    borderRadius: 16,
                    color: "var(--accent-gold)"
                  }}
                >
                  Anasayfaya Dön
                </button>
              )}
            </div>
          </div>
        )}

        {/* BOOKING FORM VIEW */}
        {activeTab === "book" && !isSuccess && (
          <form onSubmit={handleSubmit}>
            {errorMessage && (
              <div
                style={{
                  background: "rgba(239, 68, 68, 0.12)",
                  border: "1px solid rgba(239, 68, 68, 0.3)",
                  color: "#ef4444",
                  padding: "12px 18px",
                  borderRadius: 14,
                  fontSize: "0.9rem",
                  marginBottom: 24,
                  display: "flex",
                  alignItems: "center",
                  gap: 10
                }}
              >
                <AlertTriangle style={{ width: 18, height: 18, flexShrink: 0 }} />
                <span>{errorMessage}</span>
              </div>
            )}

            {/* Step 1: Type Selection */}
            <div>
              <h2 className="booking-section-title">
                <span className="booking-step-num">1</span>
                {currentLang === "en" ? "Select Appointment Type" : "Randevu Türü"}
              </h2>
              <div className="booking-types-grid">
                {APPOINTMENT_TYPES.map((type) => {
                  const isSelected = formData.type === type.id;
                  const Icon = type.icon;
                  return (
                    <button
                      key={type.id}
                      type="button"
                      onClick={() => setFormData((prev) => ({ ...prev, type: type.id }))}
                      className={`booking-type-card ${isSelected ? "selected" : ""}`}
                    >
                      <div className="booking-type-icon">
                        <Icon style={{ width: 22, height: 22 }} />
                      </div>
                      <div className="booking-type-info">
                        <h3>{type.label[currentLang] || type.label.tr}</h3>
                        <p>{type.desc[currentLang] || type.desc.tr}</p>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Step 2: Date Selection */}
            <div>
              <h2 className="booking-section-title">
                <span className="booking-step-num">2</span>
                {currentLang === "en" ? "Select Day" : "Gün Seçimi"}
              </h2>
              <div className="booking-dates-slider">
                {Array.from({ length: 30 }).map((_, i) => {
                  const d = new Date();
                  d.setDate(d.getDate() + i);
                  const year = d.getFullYear();
                  const month = String(d.getMonth() + 1).padStart(2, "0");
                  const day = String(d.getDate()).padStart(2, "0");
                  const dateStr = `${year}-${month}-${day}`;

                  const dayName = d.toLocaleDateString(currentLang === "en" ? "en-US" : "tr-TR", { weekday: "short" });
                  const dayNum = d.getDate();
                  const monthName = d.toLocaleDateString(currentLang === "en" ? "en-US" : "tr-TR", { month: "short" });
                  const isSelected = date === dateStr;

                  return (
                    <button
                      key={dateStr}
                      type="button"
                      onClick={() => setDate(dateStr)}
                      className={`booking-date-btn ${isSelected ? "selected" : ""}`}
                    >
                      <span className="booking-date-month">{monthName}</span>
                      <span className="booking-date-day">{dayNum}</span>
                      <span className="booking-date-weekday">{dayName}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Step 3: Slots Selection */}
            <div>
              <h2 className="booking-section-title">
                <span className="booking-step-num">3</span>
                {currentLang === "en" ? "Select Time Slot" : "Saat Seçimi"}
              </h2>

              {loadingSlots ? (
                <div style={{ display: "flex", alignItems: "center", gap: 10, padding: "16px 0", color: "var(--text-secondary)" }}>
                  <Loader2 className="animate-spin" style={{ width: 18, height: 18, color: "var(--accent-gold)" }} />
                  <span>{currentLang === "en" ? "Checking available slots..." : "Müsait saatler listeleniyor..."}</span>
                </div>
              ) : !date ? (
                <p style={{ color: "var(--text-muted)", fontSize: "0.9rem", margin: "10px 0 24px" }}>
                  {currentLang === "en" ? "Please select a day first." : "Önce yukarıdan bir gün seçmelisiniz."}
                </p>
              ) : slots.length === 0 ? (
                <p
                  style={{
                    color: "#f87171",
                    background: "rgba(248, 113, 113, 0.1)",
                    border: "1px solid rgba(248, 113, 113, 0.2)",
                    padding: "12px 16px",
                    borderRadius: 14,
                    fontSize: "0.88rem",
                    display: "inline-block",
                    margin: "10px 0 24px"
                  }}
                >
                  {currentLang === "en"
                    ? "No available slots for the selected day. Please try another day."
                    : "Seçtiğiniz gün için uygun randevu saati bulunmuyor. Lütfen başka bir gün deneyiniz."}
                </p>
              ) : (
                <div className="booking-slots-grid">
                  {slots.map((slot) => (
                    <button
                      key={slot}
                      type="button"
                      onClick={() => setSelectedSlot(slot)}
                      className={`booking-slot-btn ${selectedSlot === slot ? "selected" : ""}`}
                    >
                      <Clock style={{ width: 15, height: 15 }} />
                      <span>{slot}</span>
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Step 4: Contact Information */}
            <div style={{ marginTop: 10 }}>
              <h2 className="booking-section-title">
                <span className="booking-step-num">4</span>
                {currentLang === "en" ? "Contact Information" : "İletişim Bilgileri"}
              </h2>
              <div className="booking-form-grid">
                <div className="booking-input-wrapper">
                  <User className="booking-input-icon" />
                  <input
                    type="text"
                    required
                    placeholder={currentLang === "en" ? "Your Full Name" : "Adınız Soyadınız"}
                    value={formData.name}
                    onChange={(e) => setFormData((prev) => ({ ...prev, name: e.target.value }))}
                    className="booking-input"
                  />
                </div>
                <div className="booking-input-wrapper">
                  <Phone className="booking-input-icon" />
                  <input
                    type="tel"
                    required
                    placeholder={currentLang === "en" ? "Phone Number (e.g. 0530 000 0000)" : "Telefon Numaranız (Örn: 0530 000 0000)"}
                    value={formData.phone}
                    onChange={(e) => setFormData((prev) => ({ ...prev, phone: e.target.value }))}
                    className="booking-input"
                  />
                </div>
                <div className="booking-input-wrapper full-width">
                  <Mail className="booking-input-icon" />
                  <input
                    type="email"
                    placeholder={currentLang === "en" ? "Email Address (Optional)" : "E-posta Adresiniz (İsteğe bağlı)"}
                    value={formData.email}
                    onChange={(e) => setFormData((prev) => ({ ...prev, email: e.target.value }))}
                    className="booking-input"
                  />
                </div>
              </div>

              <button type="submit" disabled={isSubmitting} className="booking-submit-btn">
                {isSubmitting ? (
                  <>
                    <Loader2 className="animate-spin" style={{ width: 18, height: 18 }} />
                    <span>{currentLang === "en" ? "Booking..." : "Randevu Alınıyor..."}</span>
                  </>
                ) : (
                  <span>{currentLang === "en" ? "Complete Appointment" : "Randevuyu Tamamla"}</span>
                )}
              </button>
            </div>
          </form>
        )}

        {/* MANAGE (SELF-SERVICE PATIENT QUERY) VIEW */}
        {activeTab === "manage" && (
          <div>
            <div style={{ marginBottom: 20 }}>
              <h2 style={{ fontSize: "1.3rem", fontWeight: 600, margin: "0 0 6px" }}>
                {currentLang === "en" ? "Manage Your Appointments" : "Randevularınızı Yönetin ve Sorgulayın"}
              </h2>
              <p style={{ color: "var(--text-secondary)", fontSize: "0.88rem", margin: 0 }}>
                {currentLang === "en"
                  ? "Enter the phone number you used during booking to check your appointment status or cancel if needed."
                  : "Randevu oluştururken kullandığınız telefon numaranızı girerek onay durumunu görüntüleyebilir veya iptal edebilirsiniz."}
              </p>
            </div>

            <form onSubmit={handleSearch} className="booking-manage-form">
              <div className="booking-input-wrapper" style={{ flex: 1 }}>
                <Phone className="booking-input-icon" />
                <input
                  type="tel"
                  required
                  placeholder="0530 000 0000"
                  value={managePhone}
                  onChange={(e) => setManagePhone(e.target.value)}
                  className="booking-input"
                />
              </div>
              <button
                type="submit"
                disabled={isSearching}
                className="booking-submit-btn"
                style={{ padding: "14px 28px", borderRadius: 14 }}
              >
                {isSearching ? <Loader2 className="animate-spin" style={{ width: 16, height: 16 }} /> : <Search style={{ width: 16, height: 16 }} />}
                <span>{isSearching ? "Aranıyor..." : "Sorgula"}</span>
              </button>
            </form>

            {hasSearched && (
              <div style={{ marginTop: 20 }}>
                {manageAppointments.length === 0 ? (
                  <p style={{ textAlign: "center", color: "var(--text-muted)", padding: "30px 0" }}>
                    {currentLang === "en"
                      ? "No appointments found for this phone number."
                      : "Bu telefon numarasına ait aktif veya geçmiş randevu kaydı bulunamadı."}
                  </p>
                ) : (
                  manageAppointments.map((app) => {
                    const isUpcoming = new Date(app.date) > new Date();
                    const isCancelled = app.status === "REJECTED" || app.status === "CANCELLED_BY_PATIENT";
                    const isApproved = app.status === "APPROVED";

                    return (
                      <div key={app.id} className="booking-item-card">
                        <div>
                          <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 6 }}>
                            <span
                              className={`booking-badge-status ${
                                isCancelled ? "cancelled" : isApproved ? "approved" : "pending"
                              }`}
                            >
                              {isCancelled
                                ? "İptal Edildi"
                                : isApproved
                                ? "Onaylandı"
                                : "Onay Bekliyor"}
                            </span>
                            <span style={{ fontSize: "0.82rem", color: "var(--text-muted)" }}>
                              {new Date(app.date).toLocaleString("tr-TR", {
                                dateStyle: "long",
                                timeStyle: "short"
                              })}
                            </span>
                          </div>
                          <div style={{ fontWeight: 600, fontSize: "1rem" }}>{app.name}</div>
                          <div style={{ fontSize: "0.84rem", color: "var(--accent-gold)" }}>{app.type}</div>
                        </div>

                        {isUpcoming && !isCancelled && (
                          <button
                            type="button"
                            onClick={() => setCancelModalOpen(app.id)}
                            className="booking-cancel-btn"
                          >
                            <X style={{ width: 14, height: 14 }} />
                            <span>İptal Et</span>
                          </button>
                        )}
                      </div>
                    );
                  })
                )}
              </div>
            )}
          </div>
        )}

        {/* CLINIC REQUESTS (TALEPLER) TRACKING VIEW */}
        {activeTab === "requests" && (
          <div>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 20, flexWrap: "wrap", gap: 12 }}>
              <div>
                <h2 style={{ fontSize: "1.3rem", fontWeight: 600, margin: "0 0 6px" }}>
                  {currentLang === "en" ? "Incoming Appointment Requests" : "Elif Ay Randevu Talepleri"}
                </h2>
                <p style={{ color: "var(--text-secondary)", fontSize: "0.88rem", margin: 0 }}>
                  {currentLang === "en"
                    ? "Real-time list of consultation and hair restoration requests."
                    : "Elif Ay kliniğine internet sitesi üzerinden ulaşan güncel randevu talepleri."}
                </p>
              </div>
              <button
                type="button"
                onClick={loadClinicRequests}
                disabled={loadingRequests}
                className="booking-tab-btn"
                style={{
                  border: "1px solid var(--border-subtle)",
                  padding: "8px 16px",
                  borderRadius: 12,
                  fontSize: "0.82rem",
                  color: "var(--accent-gold)"
                }}
              >
                <RefreshCw
                  className={loadingRequests ? "animate-spin" : ""}
                  style={{ width: 14, height: 14 }}
                />
                <span>Yenile</span>
              </button>
            </div>

            {loadingRequests ? (
              <div style={{ textAlign: "center", padding: "40px 0", color: "var(--text-muted)" }}>
                <Loader2 className="animate-spin" style={{ width: 24, height: 24, margin: "0 auto 10px", color: "var(--accent-gold)" }} />
                <p style={{ margin: 0 }}>Talepler yükleniyor...</p>
              </div>
            ) : clinicRequests.length === 0 ? (
              <p style={{ textAlign: "center", color: "var(--text-muted)", padding: "40px 0" }}>
                Henüz kayıtlı bir randevu talebi bulunmuyor.
              </p>
            ) : (
              <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                {clinicRequests.map((req) => {
                  const isCancelled = req.status === "REJECTED" || req.status === "CANCELLED_BY_PATIENT";
                  const isApproved = req.status === "APPROVED";
                  return (
                    <div key={req.id} className="booking-item-card">
                      <div>
                        <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 6 }}>
                          <span
                            className={`booking-badge-status ${
                              isCancelled ? "cancelled" : isApproved ? "approved" : "pending"
                            }`}
                          >
                            {isCancelled ? "İptal Edildi" : isApproved ? "Onaylandı" : "Bekliyor"}
                          </span>
                          <span style={{ fontSize: "0.82rem", color: "var(--text-muted)" }}>
                            Randevu: {new Date(req.date).toLocaleString("tr-TR", { dateStyle: "medium", timeStyle: "short" })}
                          </span>
                        </div>
                        <div style={{ fontWeight: 600, fontSize: "0.98rem" }}>
                          {req.name} {req.phoneMasked ? <span style={{ fontWeight: 400, color: "var(--text-muted)", fontSize: "0.85rem" }}>({req.phoneMasked})</span> : null}
                        </div>
                        <div style={{ fontSize: "0.84rem", color: "var(--accent-gold)" }}>{req.type}</div>
                      </div>
                      <div style={{ fontSize: "0.78rem", color: "var(--text-muted)", textAlign: "right" }}>
                        Talep Tarihi: {new Date(req.createdAt).toLocaleDateString("tr-TR")}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}
      </div>

      {/* CANCEL MODAL */}
      {cancelModalOpen && (
        <div className="booking-modal-overlay">
          <div className="booking-modal-content">
            <div
              style={{
                width: 60,
                height: 60,
                borderRadius: "50%",
                background: "rgba(239, 68, 68, 0.12)",
                color: "#ef4444",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                margin: "0 auto 18px"
              }}
            >
              <AlertTriangle style={{ width: 28, height: 28 }} />
            </div>
            <h3 style={{ fontSize: "1.25rem", fontWeight: 600, margin: "0 0 10px" }}>Randevuyu İptal Et</h3>
            <p style={{ color: "var(--text-secondary)", fontSize: "0.88rem", lineHeight: 1.5, margin: "0 0 24px" }}>
              Bu randevuyu iptal etmek istediğinize emin misiniz? İptal edildikten sonra durum kliniğe iletilecektir.
            </p>
            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              <button
                type="button"
                disabled={isCancelling}
                onClick={() => handleCancelAppointment(cancelModalOpen)}
                style={{
                  background: "#ef4444",
                  color: "#fff",
                  border: "none",
                  padding: "13px",
                  borderRadius: 14,
                  fontWeight: 600,
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: 8
                }}
              >
                {isCancelling ? <Loader2 className="animate-spin" style={{ width: 16, height: 16 }} /> : null}
                <span>Evet, İptal Et</span>
              </button>
              <button
                type="button"
                disabled={isCancelling}
                onClick={() => setCancelModalOpen(null)}
                style={{
                  background: "transparent",
                  color: "var(--text-primary)",
                  border: "1px solid var(--border-subtle)",
                  padding: "13px",
                  borderRadius: 14,
                  fontWeight: 500,
                  cursor: "pointer"
                }}
              >
                Vazgeç
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
