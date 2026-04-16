/**
 * A simple SQL formatter logic that cleans up tabs and applies 2-space indentation.
 * It processes line by line to avoid automatic line wrapping.
 */

export function formatSQL(sql: string): string {
  // 1. Replace tabs with 2 spaces
  let processed = sql.replace(/\t/g, '  ');

  const lines = processed.split('\n');
  let indentLevel = 0;
  const result: string[] = [];

  // Keywords that increase indentation
  const increaseKeywords = [
    /\bBEGIN\b/i,
    /\bCASE\b/i,
    /\bDECLARE\b/i,
    /\bIF\b/i,
    /\bLOOP\b/i,
    /\bWHILE\b/i,
    /\bFOR\b/i,
    /\bTHEN\b/i,
    /\bEXCEPTION\b/i,
    /\bELSE\b/i,
    /\bELSIF\b/i,
    /\bWHEN\b/i,
  ];

  // Keywords that decrease indentation
  const decreaseKeywords = [
    /\bEND\b/i,
    /\bELSE\b/i,
    /\bELSIF\b/i,
    /\bWHEN\b/i,
    /\bEXCEPTION\b/i,
  ];

  // Keywords that should be at the same level as the block start but are usually inside
  const middleKeywords = [
    /\bELSE\b/i,
    /\bELSIF\b/i,
    /\bWHEN\b/i,
    /\bEXCEPTION\b/i,
  ];

  for (let line of lines) {
    let trimmedLine = line.trim();
    if (trimmedLine === '') {
      result.push('');
      continue;
    }

    // Check if this line starts with a decrease keyword
    let decrease = false;
    for (const kw of decreaseKeywords) {
      if (kw.test(trimmedLine)) {
        decrease = true;
        break;
      }
    }

    if (decrease) {
      indentLevel = Math.max(0, indentLevel - 1);
    }

    // Add the line with current indentation
    result.push('  '.repeat(indentLevel) + trimmedLine);

    // After adding the line, check if we should increase for the NEXT line
    // But if it starts with END, we don't want to increase even if it contains IF/CASE
    let increase = false;
    if (!/\bEND\b/i.test(trimmedLine)) {
      for (const kw of increaseKeywords) {
        if (kw.test(trimmedLine)) {
          increase = true;
          break;
        }
      }
    }

    if (increase) {
      indentLevel++;
    }
  }

  return result.join('\n');
}
