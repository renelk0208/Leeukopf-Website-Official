import { useEffect, useState } from 'react';
import { FileText, Send, X } from 'lucide-react';

export type ChoosableDoc = { slot: string; title: string; uploaded: boolean };

interface SendDocumentsDialogProps {
  email: string;
  company: string | null;
  documents: ChoosableDoc[];
  /** Documents ticked when the dialog opens (the client's current selection, if any). */
  initial: string[] | null;
  alreadyApproved: boolean;
  sending: boolean;
  onSend: (slots: string[]) => void;
  onClose: () => void;
}

/** Admin: choose which trade documents a client gets, then email them their personal link. */
export default function SendDocumentsDialog({
  email,
  company,
  documents,
  initial,
  alreadyApproved,
  sending,
  onSend,
  onClose,
}: SendDocumentsDialogProps) {
  const [selected, setSelected] = useState<Set<string>>(
    () => new Set(initial ?? documents.filter((d) => d.uploaded).map((d) => d.slot)),
  );

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && !sending) onClose();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [onClose, sending]);

  const toggle = (slot: string) =>
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(slot)) next.delete(slot);
      else next.add(slot);
      return next;
    });

  const chosen = documents.filter((d) => selected.has(d.slot)).map((d) => d.slot);

  return (
    <div
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/60 p-4"
      onClick={() => !sending && onClose()}
      role="presentation"
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="send-docs-title"
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-lg rounded-2xl border border-cyan-500/30 bg-slate-900 p-6 shadow-2xl"
      >
        <div className="flex items-start justify-between gap-4">
          <div className="min-w-0">
            <h2 id="send-docs-title" className="text-xl font-bold text-white">
              {alreadyApproved ? 'Change documents / resend' : 'Approve & send documents'}
            </h2>
            <p className="mt-1 text-sm text-gray-400 truncate">
              {company ? `${company} · ` : ''}
              {email}
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            disabled={sending}
            className="rounded-lg p-1.5 text-gray-400 hover:bg-slate-800 hover:text-white"
            aria-label="Close"
          >
            <X size={20} />
          </button>
        </div>

        <p className="mt-5 text-sm text-gray-300">Choose what this client can download:</p>
        <div className="mt-3 space-y-2">
          {documents.map((doc) => (
            <label
              key={doc.slot}
              className={`flex items-center gap-3 rounded-xl border px-4 py-3 cursor-pointer transition-colors ${
                selected.has(doc.slot) ? 'border-cyan-400/60 bg-cyan-500/10' : 'border-slate-700 bg-slate-800/40'
              } ${!doc.uploaded ? 'opacity-60' : ''}`}
            >
              <input
                type="checkbox"
                checked={selected.has(doc.slot)}
                onChange={() => toggle(doc.slot)}
                className="h-5 w-5 accent-cyan-500"
              />
              <FileText size={18} className="text-cyan-400 shrink-0" />
              <span className="min-w-0 flex-1">
                <span className="block text-white">{doc.title}</span>
                {!doc.uploaded && <span className="block text-xs text-amber-300">Not uploaded yet</span>}
              </span>
            </label>
          ))}
        </div>

        <p className="mt-4 text-xs text-gray-500">
          The client is emailed a personal link and will only see the documents ticked here. You can change this later.
        </p>

        <div className="mt-5 flex flex-wrap justify-end gap-3">
          <button
            type="button"
            onClick={onClose}
            disabled={sending}
            className="px-4 py-2.5 rounded-lg border border-slate-600 text-gray-300 hover:bg-slate-800"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={() => onSend(chosen)}
            disabled={sending || chosen.length === 0}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-gradient-to-r from-emerald-500 to-teal-700 text-white font-semibold disabled:opacity-50"
          >
            <Send size={16} />
            {sending ? 'Sending…' : `Send ${chosen.length === documents.length ? 'all documents' : `${chosen.length} document${chosen.length === 1 ? '' : 's'}`}`}
          </button>
        </div>
      </div>
    </div>
  );
}
