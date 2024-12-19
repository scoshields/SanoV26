import { SESSION_SECTIONS, ASSESSMENT_SECTIONS } from './responseProcessor/constants';
import type { NoteSection } from '../types';

function cleanContent(content: string, isAssessment: boolean): string {
  const sections = isAssessment ? ASSESSMENT_SECTIONS : SESSION_SECTIONS;
  let cleanedContent = content
    .replace(/^\s+|\s+$/g, '')     // Trim start/end whitespace
    .replace(/\n{3,}/g, '\n\n')    // Normalize multiple newlines
    .replace(/\[\s*|\s*\]/g, '');  // Remove square brackets

  // Ensure all section headers are properly formatted
  sections.forEach(section => {
    const sectionRegex = new RegExp(`${escapeRegExp(section)}:?\\s*`, 'gi');
    cleanedContent = cleanedContent.replace(sectionRegex, `${section}:\n`);
  });

  return content
    .trim();
}

function escapeRegExp(string: string): string {
  return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

function findSectionContent(content: string, heading: string, sections: readonly string[]): string | null {
  const headingRegex = new RegExp(`${escapeRegExp(heading)}:[ \\t]*(?:\\r?\\n|$)`, 'i');
  const startMatch = content.match(headingRegex);
  
  if (!startMatch) return null;
  
  const startIndex = startMatch.index! + startMatch[0].length;
  const remainingContent = content.slice(startIndex);
  
  // Find the next section heading
  const nextHeadingPattern = sections
    .map(section => `${escapeRegExp(section)}:`)
    .join('|');
  const nextHeadingRegex = new RegExp(`(?:^|\\n)(${nextHeadingPattern})`, 'i');
  const endMatch = remainingContent.match(nextHeadingRegex);
  
  const endIndex = endMatch 
    ? startIndex + endMatch.index! 
    : content.length;
  
  return content.slice(startIndex, endIndex).trim();
}

export function parseSections(content: string, isAssessment: boolean): NoteSection[] {
  const sections = isAssessment ? ASSESSMENT_SECTIONS : SESSION_SECTIONS;
  const cleanedContent = cleanContent(content, isAssessment);
  const result: NoteSection[] = [];
  const timestamp = Date.now();

  sections.forEach(heading => {
    const sectionContent = findSectionContent(cleanedContent, heading, sections);

    if (sectionContent) {
      const formattedContent = sectionContent.replace(/\n{2,}/g, '\n\n');
      const initialVersion = {
        id: 0,
        content: formattedContent,
        timestamp
      };

      result.push({
        id: heading.toLowerCase().replace(/\s+/g, '-'),
        heading,
        content: formattedContent,
        versions: [initialVersion],
        currentVersion: 0,
        isProcessing: false
      });
    }
  });

  return result;
}