"use client";

import React, { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { Search, CheckCircle2, Clock, Truck, Package, Home, Calendar, AlertCircle } from "lucide-react";

const STATUS_STAGES = [
  { key: "received", label: "Demande reçue", desc: "Ta demande a été enregistrée avec succès.", icon: Clock },
  { key: "quote_sent", label: "Devis envoyé", desc: "Le devis calculé t'a été transmis par WhatsApp.", icon: FileTextIcon },
  { key: "confirmed", label: "Confirmée / Payée", desc: "Commande validée et acompte enregistré.", icon: CheckCircle2 },
  { key: "purchased", label: "Achetée en Allemagne", desc: "Articles achetés par notre équipe sur place.", icon: Package },
  { key: "in_transit", label: "En route vers la Tunisie", desc: "Colis expédié et en cours de transport.", icon: Truck },
  { key: "arrived_tn", label: "Arrivée en Tunisie", desc: "Colis réceptionné au hub de Tunis.", icon: Home },
  { key: "delivered", label: "Livrée", desc: "Colis remis à la cliente en mains propres !", icon: CheckCircle2 },
];

function FileTextIcon(props: any) {
  return <Clock {...props} />;
}

export function TrackingView() {
  const searchParams = useSearchParams();
  const [refInput, setRefInput] = useState("");
  const [phoneInput, setPhoneInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [trackingData, setTrackingData] = useState<any | null>(null);

  useEffect(() => {
    const ref = searchParams.get("ref");
    const phone = searchParams.get("phone");
    if (ref) setRefInput(ref);
    if (phone) setPhoneInput(phone);
    if (ref && phone) {
      performSearch(ref, phone);
    }
  }, [searchParams]);

  const performSearch = async (ref: string, phone: string) => {
    setLoading(true);
    setError(null);
    setTrackingData(null);

    try {
      const res = await fetch(
        `/api/tracking?ref=${encodeURIComponent(ref)}&phone=${encodeURIComponent(phone)}`
      );
      const data = await res.json();

      if (data.success) {
        setTrackingData(data.data);
      } else {
        setError(data.error || "Aucune commande correspondant à ces identifiants.");
      }
    } catch (err) {
      console.error(err);
      setError("Erreur de connexion au serveur.");
    } finally {
      setLoading(false);
    }
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!refInput || !phoneInput) {
      setError("Veuillez saisir votre référence et numéro de téléphone.");
      return;
    }
    performSearch(refInput, phoneInput);
  };

  const getStageIndex = (statusKey: string) => {
    if (statusKey === "cancelled") return -1;
    return STATUS_STAGES.findIndex((s) => s.key === statusKey);
  };

  const currentStageIdx = trackingData ? getStageIndex(trackingData.status) : -1;

  return (
    <div className="space-y-8">
      {/* Search Input Box */}
      <form
        onSubmit={handleSearchSubmit}
        className="bg-white p-6 sm:p-8 rounded-3xl border border-[var(--color-powder-pink)] shadow-xl space-y-4"
      >
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-bold text-[var(--color-rose-brown)] mb-1">
              Numéro de Référence *
            </label>
            <input
              type="text"
              required
              value={refInput}
              onChange={(e) => setRefInput(e.target.value)}
              className="w-full px-4 py-3 text-xs rounded-2xl border border-[var(--color-powder-pink)] bg-[var(--color-ivory)]/50 focus:outline-none focus:ring-2 focus:ring-[var(--color-rose-gold)] uppercase"
              placeholder="Ex: VS-1001 ou VX-1002"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-[var(--color-rose-brown)] mb-1">
              Numéro Téléphone WhatsApp *
            </label>
            <input
              type="tel"
              required
              value={phoneInput}
              onChange={(e) => setPhoneInput(e.target.value)}
              className="w-full px-4 py-3 text-xs rounded-2xl border border-[var(--color-powder-pink)] bg-[var(--color-ivory)]/50 focus:outline-none focus:ring-2 focus:ring-[var(--color-rose-gold)]"
              placeholder="Ex: 21620123456"
            />
          </div>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full py-3.5 rounded-full bg-[var(--color-deep-rose-gold)] text-white text-xs font-bold flex items-center justify-center gap-2 hover:bg-[var(--color-rose-gold)] transition-colors shadow-md disabled:opacity-50"
        >
          <Search className="w-4 h-4" />
          <span>{loading ? "Recherche en cours..." : "Vérifier le statut de ma commande"}</span>
        </button>
      </form>

      {/* Error display */}
      {error && (
        <div className="p-4 bg-rose-50 border border-rose-200 text-rose-700 rounded-2xl text-xs flex items-center gap-3">
          <AlertCircle className="w-5 h-5 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* Tracking Timeline Output */}
      {trackingData && (
        <div className="bg-white rounded-3xl p-6 sm:p-10 border border-[var(--color-powder-pink)] shadow-xl space-y-8 animate-in fade-in duration-500">
          {/* Order Header Summary */}
          <div className="p-6 bg-[var(--color-powder-pink)]/30 rounded-2xl border border-[var(--color-blush-pink)]/60 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <span className="text-[10px] font-bold uppercase tracking-widest text-[var(--color-rose-gold)]">
                Commande {trackingData.type.toUpperCase()}
              </span>
              <h2 className="font-serif text-2xl font-bold text-[var(--color-rose-brown)]">
                Référence {trackingData.reference}
              </h2>
              <p className="text-xs text-[var(--color-rose-brown)]/80 mt-1">
                Client(e) : <span className="font-bold">{trackingData.customerName}</span> ({trackingData.city})
              </p>
            </div>

            <div className="text-left sm:text-right">
              {trackingData.status === "cancelled" ? (
                <span className="px-4 py-1.5 rounded-full bg-rose-100 text-rose-700 text-xs font-bold">
                  Commande Annulée
                </span>
              ) : (
                <span className="px-4 py-1.5 rounded-full bg-[var(--color-deep-rose-gold)] text-white text-xs font-bold shadow-xs">
                  Statut : {STATUS_STAGES.find((s) => s.key === trackingData.status)?.label || trackingData.status}
                </span>
              )}
              {trackingData.trackingNumber && (
                <p className="text-[11px] font-mono text-[var(--color-rose-gold)] mt-2">
                  Code Transport : {trackingData.trackingNumber}
                </p>
              )}
            </div>
          </div>

          {/* Vertical Timeline */}
          <div className="space-y-6">
            <h3 className="font-serif text-lg font-bold text-[var(--color-rose-brown)]">
              Chronologie d'expedition
            </h3>

            <div className="relative border-l-2 border-[var(--color-powder-pink)] ml-4 space-y-8 pl-6">
              {STATUS_STAGES.map((stage, idx) => {
                const Icon = stage.icon;
                const isCompleted = idx <= currentStageIdx;
                const isCurrent = idx === currentStageIdx;

                return (
                  <div key={stage.key} className="relative group">
                    {/* Circle Node */}
                    <div
                      className={`absolute -left-[35px] top-0 w-8 h-8 rounded-full border-2 flex items-center justify-center transition-all ${
                        isCompleted
                          ? "bg-[var(--color-deep-rose-gold)] border-[var(--color-deep-rose-gold)] text-white shadow-sm"
                          : "bg-white border-[var(--color-powder-pink)] text-[var(--color-rose-brown)]/40"
                      }`}
                    >
                      <Icon className="w-4 h-4" />
                    </div>

                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <h4
                          className={`text-sm font-bold ${
                            isCompleted ? "text-[var(--color-rose-brown)]" : "text-[var(--color-rose-brown)]/50"
                          }`}
                        >
                          {stage.label}
                        </h4>
                        {isCurrent && (
                          <span className="px-2 py-0.5 rounded-full bg-[var(--color-powder-pink)] text-[var(--color-deep-rose-gold)] text-[10px] font-bold animate-pulse">
                            En cours
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-[var(--color-rose-brown)]/70">{stage.desc}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
