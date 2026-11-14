/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import {
  X,
  Printer,
  Download,
  Copy,
  Check,
  FileText,
  Shield,
  Calendar,
  Layers,
  ArrowUpRight,
  ExternalLink,
  Wrench
} from 'lucide-react';
import {
  EXECUTIVE_DOCUMENTS,
  SAMPLE_DOCUMENT_NOTICE,
  type ExecutiveDocument,
} from '../data/executiveDocuments';

interface ExecutiveDocumentViewerProps {
  isOpen: boolean;
  onClose: () => void;
  initialDocId?: string;
}

export const ExecutiveDocumentViewer: React.FC<ExecutiveDocumentViewerProps> = ({
  isOpen,
  onClose,
  initialDocId,
}) => {
  const [selectedDocId, setSelectedDocId] = useState<string>(
    initialDocId || EXECUTIVE_DOCUMENTS[0].id
  );
  const [copied, setCopied] = useState<boolean>(false);

  useEffect(() => {
    if (initialDocId) {
      setSelectedDocId(initialDocId);
    }
  }, [initialDocId, isOpen]);

  if (!isOpen) return null;

  const activeDoc: ExecutiveDocument =
    EXECUTIVE_DOCUMENTS.find((d) => d.id === selectedDocId) || EXECUTIVE_DOCUMENTS[0];

  const handleCopy = () => {
    const textContent = activeDoc.sections
      .map((s) => `${s.heading}\n${s.subheading ? s.subheading + '\n' : ''}\n${s.bodyMarkdown}`)
      .join('\n\n---\n\n');
    const fullText = `${activeDoc.title}\nRef: ${activeDoc.refCode}\nClassification: ${activeDoc.classification}\nAttribution: ${activeDoc.toolAttribution}\n\n${textContent}`;

    if (navigator.clipboard) {
      navigator.clipboard.writeText(fullText).catch(() => {});
    }
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex items-center justify-center p-2 sm:p-4 md:p-6 overflow-y-auto">
      <div className="relative bg-[#0A0D14] border border-[var(--dim2)] max-w-5xl w-full max-h-[92vh] flex flex-col shadow-2xl overflow-hidden font-mono-clean">
        {/* Architectural Corners */}
        <div className="el-corner tl" />
        <div className="el-corner tr" />
        <div className="el-corner bl" />
        <div className="el-corner br" />

        {/* Modal Top Bar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between p-4 md:p-6 border-b border-[var(--dim1)] bg-white/[0.01] gap-4">
          <div>
            <div className="flex flex-wrap items-center gap-2 mb-1.5">
              <span className="font-mono-clean text-[10px] uppercase tracking-wider text-accent font-bold">
                {activeDoc.refCode}
              </span>
              <span className="inline-flex items-center gap-1 px-2 py-0.5 border border-rose-500/40 bg-rose-500/10 text-[9px] font-mono-clean text-rose-300">
                <Shield className="w-2.5 h-2.5" />
                <span>{activeDoc.classification}</span>
              </span>
              <span className="text-[10px] text-[var(--muted)]">
                {activeDoc.dateLabel}
              </span>
            </div>
            <h2 className="font-editorial text-xl sm:text-2xl text-white font-medium">
              {activeDoc.title}
            </h2>
            <p className="font-mono-clean text-xs text-[var(--muted)] max-w-2xl mt-0.5">
              {activeDoc.subtitle}
            </p>
          </div>

          {/* Action Toolbar */}
          <div className="flex flex-wrap items-center gap-2 self-start sm:self-center shrink-0">
            <button
              type="button"
              onClick={handleCopy}
              className="px-3 py-1.5 border border-[var(--dim2)] bg-white/[0.02] hover:bg-white/[0.06] text-white text-xs flex items-center gap-1.5 transition-colors cursor-pointer"
              title="Copy Document Text"
            >
              {copied ? (
                <>
                  <Check className="w-3.5 h-3.5 text-emerald-400" />
                  <span className="text-emerald-400">Copied</span>
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5 text-[var(--muted)]" />
                  <span>Copy</span>
                </>
              )}
            </button>

            <button
              type="button"
              onClick={handlePrint}
              className="px-3 py-1.5 border border-[var(--dim2)] bg-white/[0.02] hover:bg-white/[0.06] text-white text-xs flex items-center gap-1.5 transition-colors cursor-pointer"
              title="Print to PDF"
            >
              <Printer className="w-3.5 h-3.5 text-[var(--muted)]" />
              <span>Print / PDF</span>
            </button>

            {/* Native Tool Export Download Buttons */}
            {activeDoc.exportFiles.map((file, fIdx) => (
              <a
                key={fIdx}
                href={file.url}
                download
                className={
                  fIdx === 0
                    ? 'btn-main text-xs py-1.5 px-3 flex items-center gap-1.5 cursor-pointer shadow-sm'
                    : 'px-3 py-1.5 border border-[var(--dim2)] bg-white/[0.02] hover:bg-white/[0.06] text-white text-xs flex items-center gap-1.5 transition-colors cursor-pointer'
                }
                title={file.label}
              >
                <Download className="w-3.5 h-3.5" />
                <span>{file.formatBadge}</span>
              </a>
            ))}

            <button
              type="button"
              onClick={onClose}
              className="p-1.5 border border-[var(--dim2)] text-[var(--muted)] hover:text-white hover:border-white transition-colors cursor-pointer ml-1"
              title="Close Viewer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Portfolio Sample Disclosure */}
        <div className="flex items-start gap-2 border-b border-amber-400/30 bg-amber-400/10 px-4 sm:px-6 py-2.5 text-xs text-amber-200">
          <Shield className="w-3.5 h-3.5 mt-0.5 shrink-0 text-amber-400" />
          <span>{SAMPLE_DOCUMENT_NOTICE}</span>
        </div>

        {/* Tool Attribution & Native Format Banner */}
        <div className="bg-gradient-to-r from-accent/15 via-white/[0.02] to-transparent border-b border-[var(--dim1)] px-4 sm:px-6 py-2.5 flex flex-wrap items-center justify-between gap-2 text-xs">
          <div className="flex items-center gap-2">
            <span className="text-accent font-bold">🛠️ TOOL ATTRIBUTION:</span>
            <span className="text-white font-medium">{activeDoc.toolAttribution}</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-[10px] text-[var(--muted)] uppercase tracking-wider">Target Format:</span>
            <span className="text-emerald-400 font-mono-clean text-[11px] font-semibold border border-emerald-500/30 bg-emerald-500/10 px-2 py-0.5">
              {activeDoc.exportableTo}
            </span>
          </div>
        </div>

        {/* Document Selector Navigation Tabs */}
        <div className="flex border-b border-[var(--dim1)] bg-black/60 overflow-x-auto text-xs shrink-0">
          {EXECUTIVE_DOCUMENTS.map((doc, idx) => {
            const isSelected = doc.id === activeDoc.id;
            return (
              <button
                key={doc.id}
                type="button"
                onClick={() => setSelectedDocId(doc.id)}
                className={`px-4 py-3 border-b-2 whitespace-nowrap cursor-pointer transition-all flex items-center gap-2 text-left ${
                  isSelected
                    ? 'border-accent bg-accent/10 text-white font-medium'
                    : 'border-transparent text-[var(--muted)] hover:text-white hover:bg-white/[0.02]'
                }`}
              >
                <span className="font-mono-clean text-[10px] text-accent font-bold">
                  0{idx + 1}
                </span>
                <span className="truncate max-w-[200px]">{doc.title}</span>
              </button>
            );
          })}
        </div>

        {/* Scrollable Document Body */}
        <div className="flex-1 overflow-y-auto p-6 md:p-8 space-y-8 bg-black/30 print:bg-white print:text-black">
          {/* Metadata Ledger Strip */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 p-4 border border-[var(--dim2)] bg-white/[0.01] text-xs">
            <div>
              <span className="block text-[9px] uppercase tracking-wider text-[var(--muted)] mb-0.5">
                Target Principal
              </span>
              <span className="text-white font-medium text-[11px] block truncate">
                {activeDoc.principal}
              </span>
            </div>

            <div>
              <span className="block text-[9px] uppercase tracking-wider text-[var(--muted)] mb-0.5">
                Executive Partner
              </span>
              <span className="text-accent font-medium text-[11px] block">
                Alex Morgan (Lead VA)
              </span>
            </div>

            <div>
              <span className="block text-[9px] uppercase tracking-wider text-[var(--muted)] mb-0.5">
                Document Category
              </span>
              <span className="text-white text-[11px] block">
                {activeDoc.category}
              </span>
            </div>

            <div>
              <span className="block text-[9px] uppercase tracking-wider text-[var(--muted)] mb-0.5">
                Verified Tools
              </span>
              <span className="text-emerald-400 text-[10px] block truncate">
                {activeDoc.tools.join(' · ')}
              </span>
            </div>
          </div>

          {/* Formatted Sections */}
          <div className="space-y-6">
            {activeDoc.sections.map((sec, sIdx) => (
              <div
                key={sIdx}
                className="border border-[var(--dim1)] bg-white/[0.01] p-5 sm:p-6 space-y-3"
              >
                <div className="border-b border-[var(--dim2)] pb-2 flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                  <h3 className="font-editorial text-lg sm:text-xl text-white">
                    {sec.heading}
                  </h3>
                  {sec.subheading && (
                    <span className="font-mono-clean text-[10px] uppercase text-accent tracking-wider">
                      {sec.subheading}
                    </span>
                  )}
                </div>

                <div className="font-mono-clean text-xs text-[var(--muted)] leading-relaxed whitespace-pre-wrap">
                  {sec.bodyMarkdown}
                </div>
              </div>
            ))}
          </div>

          {/* Document Sign-Off Banner */}
          <div className="border-t border-[var(--dim1)] pt-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 text-xs text-[var(--muted)]">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-400" />
              <span>{activeDoc.toolAttribution} · Ready for direct workspace import</span>
            </div>
            <div className="flex flex-wrap items-center gap-3">
              {activeDoc.exportFiles.map((f, i) => (
                <a
                  key={i}
                  href={f.url}
                  download
                  className="text-accent hover:underline flex items-center gap-1 font-mono-clean text-xs"
                >
                  <span>{f.label}</span>
                  <ArrowUpRight className="w-3 h-3" />
                </a>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
