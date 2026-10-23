"use client";

import { useEffect } from "react";
import { X, Vote } from "lucide-react";
import CitizenOpinionBox from "./CitizenOpinionBox";

interface CitizenVoteModalProps {
  isOpen: boolean;
  onClose: () => void;
  onVoteSubmitted?: () => void;
  activeTopic?: string;
}

export default function CitizenVoteModal({
  isOpen,
  onClose,
  onVoteSubmitted,
  activeTopic,
}: CitizenVoteModalProps) {
  // ESC key to close
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    if (isOpen) {
      window.addEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "hidden";
    }
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "";
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 2500,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "1rem",
        backgroundColor: "rgba(0, 0, 0, 0.65)",
        backdropFilter: "blur(8px)",
        animation: "fadeIn 0.2s ease-out",
      }}
      onClick={e => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div
        style={{
          width: "100%",
          maxWidth: "580px",
          maxHeight: "92vh",
          overflowY: "auto",
          background: "var(--card-bg)",
          borderRadius: "20px",
          border: "1px solid var(--glass-border)",
          boxShadow: "0 25px 60px rgba(0,0,0,0.45)",
          position: "relative",
        }}
      >
        {/* Close button */}
        <button
          onClick={onClose}
          aria-label="Cerrar modal"
          style={{
            position: "absolute",
            top: "1.25rem",
            right: "1.25rem",
            zIndex: 10,
            background: "var(--glass-hover)",
            border: "1px solid var(--glass-border)",
            color: "var(--heading-color)",
            width: "36px",
            height: "36px",
            borderRadius: "50%",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            cursor: "pointer",
            transition: "all 0.2s ease",
          }}
          onMouseEnter={e => {
            e.currentTarget.style.color = "var(--accent-primary)";
            e.currentTarget.style.borderColor = "var(--accent-primary)";
          }}
          onMouseLeave={e => {
            e.currentTarget.style.color = "var(--heading-color)";
            e.currentTarget.style.borderColor = "var(--glass-border)";
          }}
        >
          <X size={18} />
        </button>

        {/* Embedded CitizenOpinionBox */}
        <CitizenOpinionBox
          onVoteSubmitted={() => {
            if (onVoteSubmitted) onVoteSubmitted();
          }}
          activeTopic={activeTopic}
          isModal={true}
        />
      </div>

      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: scale(0.97); }
          to { opacity: 1; transform: scale(1); }
        }
      `}</style>
    </div>
  );
}
