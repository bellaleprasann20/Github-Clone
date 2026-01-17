import React, { useState } from 'react';
import { Code, Copy, Download, Check } from 'lucide-react';

const CodeViewer = ({ file }) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(file.content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
    const blob = new Blob([file.content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = file.name;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const getLanguageColor = (language) => {
    const colors = {
      JavaScript: '#f1e05a',
      TypeScript: '#2b7489',
      Python: '#3572A5',
      Java: '#b07219',
      'C++': '#f34b7d',
      'C#': '#178600',
      Go: '#00ADD8',
      Rust: '#dea584',
      PHP: '#4F5D95',
      Ruby: '#701516',
      HTML: '#e34c26',
      CSS: '#563d7c',
      Markdown: '#083fa1',
      JSON: '#292929',
      SQL: '#e38c00'
    };
    return colors[language] || '#858585';
  };

  const highlightCode = (code, language) => {
    if (!code) return [];
    
    const lines = code.split('\n');
    return lines.map((line, index) => ({
      lineNumber: index + 1,
      content: line
    }));
  };

  const lines = highlightCode(file.content, file.language);

  return (
    <div className="bg-[#0d1117] border border-gray-700 rounded-md overflow-hidden">
      {/* File Header */}
      <div className="bg-[#161b22] border-b border-gray-700 px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Code size={16} className="text-gray-400" />
          <span className="text-white font-medium">{file.name}</span>
          <span
            className="text-xs px-2 py-0.5 rounded-full"
            style={{ backgroundColor: `${getLanguageColor(file.language)}20`, color: getLanguageColor(file.language) }}
          >
            {file.language}
          </span>
          <span className="text-gray-500 text-sm">
            {lines.length} lines • {(file.size / 1024).toFixed(2)} KB
          </span>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={handleCopy}
            className="p-2 text-gray-400 hover:text-white hover:bg-gray-800 rounded transition-colors"
            title="Copy content"
          >
            {copied ? <Check size={16} /> : <Copy size={16} />}
          </button>
          <button
            onClick={handleDownload}
            className="p-2 text-gray-400 hover:text-white hover:bg-gray-800 rounded transition-colors"
            title="Download file"
          >
            <Download size={16} />
          </button>
        </div>
      </div>

      {/* Code Content */}
      <div className="overflow-x-auto">
        <table className="w-full text-sm font-mono">
          <tbody>
            {lines.map((line) => (
              <tr
                key={line.lineNumber}
                className="hover:bg-[#161b22] group"
              >
                <td className="py-0 px-4 text-right select-none text-gray-600 bg-[#0d1117] border-r border-gray-800 sticky left-0 group-hover:bg-[#161b22] w-12">
                  {line.lineNumber}
                </td>
                <td className="py-0 px-4 text-gray-300 whitespace-pre">
                  <code>{line.content || ' '}</code>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default CodeViewer;