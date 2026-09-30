"use client";

import React, { useState } from "react";
import Link from "next/link";
import { ArrowLeft, Save, MessageCircle, DollarSign, Calculator, Clock, Send, ShieldCheck, CheckCircle2 } from "lucide-react";

interface RequestDetailClientProps {
  request: any;
  items: any[];
  history: any[];
  shipments: any[];
  user: any;
}

export function RequestDetailClient({
  request,
  items,
  history,
  shipments,
  user,
}: RequestDetailClientProps) {
  const [status, setStatus] = useState(request.status);
  const [totalEur, setTotalEur] = useState((request.totalEur / 100).toFixed(2));
  const [purchaseCostEur, setPurchaseCostEur] = useState(
    ((request.purchaseCostEur || 0) / 100).toFixed(2)
  );
  const [serviceFeeEur, setServiceFeeEur] = useState(
    ((request.serviceFeeEur || 0) / 100).toFixed(2)
  );
  const [depositPaidEur, setDepositPaidEur] = useState(
    ((request.depositPaidEur || 0) / 100).toFixed(2)
  );
  const [trackingNumber, setTrackingNumber] = useState(request.trackingNumber || "");
  const [shipmentId, setShipmentId] = useState(request.shipmentId || "");
  const [notes, setNotes] = useState(request.notes || "");
  const [statusNote, setStatusNote] = useState("");
  const [isSaving, setIsSaving] = useState(false);

  const parsedTotalEur = parseFloat(totalEur) || 0;
  const parsedCostEur = parseFloat(purchaseCostEur) || 0;
  const autoMarginEur = Math.max(0, parsedTotalEur - parsedCostEur);
  const parsedTotalTnd = (parsedTotalEur * 3.45).toFixed(2);

  const handleSave = async () => {
    setIsSaving(true);
    try {
      const res = await fetch(`/api/admin/requests/${request.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          status,
          totalEur: Math.round(parsedTotalEur * 100),
          purchaseCostEur: Math.round(parsedCostEur * 100),
          serviceFeeEur: Math.round((parseFloat(serviceFeeEur) || 0) * 100),
          depositPaidEur: Math.round((parseFloat(depositPaidEur) || 0) * 100),
          trackingNumber,
          shipmentId: shipmentId ? parseInt(shipmentId, 10) : null,
          notes,
          statusNote,
        }),
      });

      const data = await res.json();
      if (data.success) {
        alert("Demande et devis sauvegardés avec succès !");
        window.location.reload();
      } else {
        alert(data.error || "Erreur de sauvegarde.");
      }
    } catch (err) {
      console.error(err);
      alert("Erreur de sauvegarde.");
    } finally {
      setIsSaving(false);
    }
  };

  const handleSendWhatsAppQuote = () => {
    const cleanPhone = request.phone.replace(/[^0-9]/g, "");
    const trackingLink = `${window.location.origin}/tracking?ref=${request.reference}&phone=${encodeURIComponent(request.phone)}`;

    let msg = `Bonjour ${request.customerName} ! 🌸\n\nVoici les détails de votre demande Veloria (*${request.reference}*) :\n\n`;
    msg += `💰 *Montant Total :* ${parsedTotalEur.toFixed(2)} € (~ ${parsedTotalTnd} TND)\n`;
    if (parseFloat(depositPaidEur) > 0) {
      msg += `💳 *Acompte enregistré :* ${depositPaidEur} €\n`;
    }
    msg += `📦 *Statut actuel :* ${status.toUpperCase()}\n`;
    msg += `🔗 *Suivi en direct :* ${trackingLink}\n\n`;
    msg += `Merci de nous confirmer votre accord pour procéder à l'achat en Allemagne !`;

    const url = `https://wa.me/${cleanPhone}?text=${encodeURIComponent(msg)}`;
    window.open(url, "_blank");
  };

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <Link
            href="/admin/requests"
            className="p-2 rounded-xl bg-slate-900 border border-slate-800 text-slate-400 hover:text-slate-100"
          >
            <ArrowLeft className="w-4 h-4" />
          </Link>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-mono text-xl font-bold text-rose-400">
                {request.reference}
              </span>
              <span className="px-2.5 py-0.5 rounded-md bg-slate-800 text-slate-300 text-[10px] uppercase font-bold">
                {request.type}
              </span>
            </div>
            <p className="text-xs text-slate-400">
              Demande reçue le {new Date(request.createdAt).toLocaleDateString()}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={handleSendWhatsAppQuote}
            className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold flex items-center gap-2 shadow-md transition-colors"
          >
            <MessageCircle className="w-4 h-4" />
            <span>Envoyer Devis par WhatsApp</span>
          </button>

          <button
            onClick={handleSave}
            disabled={isSaving}
            className="px-5 py-2 rounded-xl bg-rose-600 hover:bg-rose-500 text-white text-xs font-bold flex items-center gap-2 shadow-md transition-colors disabled:opacity-50"
          >
            <Save className="w-4 h-4" />
            <span>{isSaving ? "Sauvegarde..." : "Enregistrer les modifications"}</span>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Customer & Items */}
        <div className="lg:col-span-2 space-y-6">
          {/* Customer Info */}
          <div className="bg-slate-900 rounded-2xl border border-slate-800 p-6 space-y-4">
            <h3 className="font-serif text-lg font-bold text-slate-100 border-b border-slate-800 pb-2">
              Informations du Client
            </h3>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 text-xs">
              <div>
                <span className="text-slate-500 block">Nom complet</span>
                <span className="font-bold text-slate-200">{request.customerName}</span>
              </div>
              <div>
                <span className="text-slate-500 block">Téléphone WhatsApp</span>
                <span className="font-mono font-bold text-rose-400">{request.phone}</span>
              </div>
              <div>
                <span className="text-slate-500 block">Ville</span>
                <span className="font-bold text-slate-200">{request.city}</span>
              </div>
              <div>
                <span className="text-slate-500 block">Email</span>
                <span className="text-slate-300">{request.email || "Non renseigné"}</span>
              </div>
              <div>
                <span className="text-slate-500 block">Emballage Cadeau</span>
                <span className="font-bold text-slate-200">
                  {request.isGiftWrapped ? "Oui (+5 TND)" : "Non"}
                </span>
              </div>
            </div>
          </div>

          {/* Submitted Items */}
          <div className="bg-slate-900 rounded-2xl border border-slate-800 p-6 space-y-4">
            <h3 className="font-serif text-lg font-bold text-slate-100 border-b border-slate-800 pb-2">
              Articles Soumis ({items.length})
            </h3>
            <div className="space-y-3">
              {items.map((item) => (
                <div
                  key={item.id}
                  className="p-4 bg-slate-950 rounded-xl border border-slate-800 flex flex-col sm:flex-row justify-between gap-3 text-xs"
                >
                  <div className="space-y-1">
                    <p className="font-bold text-slate-200">{item.productName}</p>
                    {item.productUrl && (
                      <a
                        href={item.productUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-rose-400 hover:underline text-[11px] block truncate max-w-md"
                      >
                        {item.productUrl}
                      </a>
                    )}
                    {item.screenshotUrl && (
                      <a
                        href={item.screenshotUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-sky-400 hover:underline text-[11px] block"
                      >
                        🖼️ Voir capture d'écran
                      </a>
                    )}
                    {item.itemNotes && (
                      <p className="text-[11px] text-slate-400 italic">"{item.itemNotes}"</p>
                    )}
                  </div>
                  <div className="text-right">
                    <span className="font-bold text-slate-100">x{item.quantity}</span>
                    <span className="block text-rose-400 font-bold">
                      {((item.priceEur * item.quantity) / 100).toFixed(2)} €
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Timeline History Log */}
          <div className="bg-slate-900 rounded-2xl border border-slate-800 p-6 space-y-4">
            <h3 className="font-serif text-lg font-bold text-slate-100 border-b border-slate-800 pb-2">
              Historique des Changements de Statut
            </h3>
            <div className="space-y-3">
              {history.map((h) => (
                <div
                  key={h.id}
                  className="p-3 bg-slate-950 rounded-xl border border-slate-800/60 text-xs flex justify-between items-center"
                >
                  <div>
                    <span className="font-bold text-rose-400">{h.newStatus.toUpperCase()}</span>
                    <p className="text-slate-400 text-[11px]">{h.note}</p>
                  </div>
                  <div className="text-right text-[10px] text-slate-500 font-mono">
                    <p>{new Date(h.createdAt).toLocaleString()}</p>
                    <p>Par: {h.changedBy}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column: Quote Builder & Pricing Calculator */}
        <div className="space-y-6">
          {/* Quote Builder */}
          <div className="bg-slate-900 rounded-2xl border border-slate-800 p-6 space-y-4">
            <h3 className="font-serif text-lg font-bold text-slate-100 border-b border-slate-800 pb-2 flex items-center gap-2">
              <Calculator className="w-5 h-5 text-rose-400" />
              <span>Calculateur de Devis & Marge</span>
            </h3>

            <div className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-400 mb-1 font-semibold">
                  Statut de la Commande
                </label>
                <select
                  value={status}
                  onChange={(e) => setStatus(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-rose-400 font-bold"
                >
                  <option value="received">received (Reçue)</option>
                  <option value="quote_sent">quote_sent (Devis envoyé)</option>
                  <option value="confirmed">confirmed (Confirmée)</option>
                  <option value="purchased">purchased (Achetée en Allemagne)</option>
                  <option value="in_transit">in_transit (En route TN)</option>
                  <option value="arrived_tn">arrived_tn (Arrivée TN)</option>
                  <option value="delivered">delivered (Livrée)</option>
                  <option value="cancelled">cancelled (Annulée)</option>
                </select>
              </div>

              <div>
                <label className="block text-slate-400 mb-1 font-semibold">
                  Prix de Vente Total (EUR €)
                </label>
                <input
                  type="number"
                  step="0.01"
                  value={totalEur}
                  onChange={(e) => setTotalEur(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-slate-100 font-bold"
                />
              </div>

              <div>
                <label className="block text-slate-400 mb-1 font-semibold">
                  Prix d'Achat Interne (Cout EUR €)
                </label>
                <input
                  type="number"
                  step="0.01"
                  value={purchaseCostEur}
                  onChange={(e) => setPurchaseCostEur(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-slate-100 font-bold"
                />
              </div>

              {/* Auto Marge Box */}
              <div className="p-4 bg-emerald-950/40 border border-emerald-800/60 rounded-xl space-y-1">
                <span className="text-[11px] font-bold text-emerald-400 uppercase tracking-wider block">
                  Marge Nette Auto-Calculée
                </span>
                <span className="text-xl font-bold font-serif text-emerald-300">
                  {autoMarginEur.toFixed(2)} €
                </span>
                <span className="text-[10px] text-emerald-400/70 block">
                  Total TND estimé : ~ {parsedTotalTnd} TND
                </span>
              </div>

              <div>
                <label className="block text-slate-400 mb-1 font-semibold">
                  Acompte Reçu (EUR €)
                </label>
                <input
                  type="number"
                  step="0.01"
                  value={depositPaidEur}
                  onChange={(e) => setDepositPaidEur(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-slate-100 font-bold"
                />
              </div>

              <div>
                <label className="block text-slate-400 mb-1 font-semibold">
                  Code Suivi Transporteur
                </label>
                <input
                  type="text"
                  value={trackingNumber}
                  onChange={(e) => setTrackingNumber(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-slate-100 font-mono"
                  placeholder="Ex: VEL-TN-88219"
                />
              </div>

              <div>
                <label className="block text-slate-400 mb-1 font-semibold">
                  Note d'historique (pour le log)
                </label>
                <input
                  type="text"
                  value={statusNote}
                  onChange={(e) => setStatusNote(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-slate-100"
                  placeholder="Ex: Acompte 20 EUR reçu par Dinar"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
