import React from 'react';
import { RefreshCw, History } from 'lucide-react';
import { NoteSection as NoteSectionType } from '../types';
import { cn } from '../utils/cn';

interface NoteSectionProps {
  section: NoteSectionType;
  onRegenerate: (sectionId: string) => void;
  onVersionChange: (sectionId: string, versionId: number) => void;
}

export function NoteSection({ section, onRegenerate, onVersionChange }: NoteSectionProps) {
  const hasMultipleVersions = section.versions.length > 1;

  return (
    <div className="border rounded-lg bg-white shadow-sm overflow-hidden">
      <div className="flex items-center justify-between px-4 py-3 bg-gray-50 border-b">
        <h3 className="font-medium text-gray-900">{section.heading}</h3>
        <div className="flex items-center gap-2">
          {hasMultipleVersions && (
            <select
              value={section.currentVersion}
              onChange={(e) => {
                const version = parseInt(e.target.value);
                onVersionChange(section.id, version);
              }}
              className="text-sm border border-gray-200 rounded-md px-2 py-1 bg-white"
              disabled={section.isProcessing}
            >
              {section.versions.map((version, index) => (
                <option key={version.id} value={version.id}>
                  {index === 0 ? 'Original' : `Version ${index}`}
                </option>
              ))}
            </select>
          )}
          <button
            onClick={() => onRegenerate(section.id)}
            disabled={section.isProcessing}
            className="flex items-center gap-2 px-3 py-1 text-sm text-gray-600 hover:text-gray-900 disabled:text-gray-400 disabled:cursor-not-allowed transition-colors"
          >
            <RefreshCw className={cn(
              "w-4 h-4",
              section.isProcessing && "animate-spin"
            )} />
            {section.isProcessing ? 'Processing...' : 'Regenerate'}
          </button>
        </div>
      </div>
      <div className={cn(
        "p-4",
        section.isProcessing && "animate-pulse"
      )}>
        {section.error ? (
          <p className="text-red-600">{section.error}</p>
        ) : (
          <div className="prose max-w-none whitespace-pre-wrap">
            {section.versions[section.currentVersion]?.content}
          </div>
        )}
      </div>
    </div>
  );
}