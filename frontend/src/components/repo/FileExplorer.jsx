import React, { useState } from 'react';
import { File, Folder, ChevronRight, ChevronDown } from 'lucide-react';

const FileExplorer = ({ files, onFileSelect, selectedFile }) => {
  const [expandedFolders, setExpandedFolders] = useState(new Set(['root']));

  const toggleFolder = (path) => {
    const newExpanded = new Set(expandedFolders);
    if (newExpanded.has(path)) {
      newExpanded.delete(path);
    } else {
      newExpanded.add(path);
    }
    setExpandedFolders(newExpanded);
  };

  const buildFileTree = (files) => {
    const tree = { name: 'root', type: 'directory', children: {} };

    files.forEach(file => {
      const parts = file.path ? file.path.split('/') : [file.name];
      let current = tree;

      parts.forEach((part, index) => {
        if (index === parts.length - 1) {
          current.children[part] = { ...file, type: 'file' };
        } else {
          if (!current.children[part]) {
            current.children[part] = { name: part, type: 'directory', children: {} };
          }
          current = current.children[part];
        }
      });
    });

    return tree;
  };

  const renderTree = (node, path = '', level = 0) => {
    if (node.type === 'file') {
      return (
        <div
          key={path}
          onClick={() => onFileSelect(node)}
          className={`flex items-center gap-2 px-3 py-1.5 cursor-pointer hover:bg-gray-800 rounded transition-colors ${
            selectedFile?.name === node.name ? 'bg-gray-800 text-white' : 'text-gray-300'
          }`}
          style={{ paddingLeft: `${level * 16 + 12}px` }}
        >
          <File size={16} className="text-gray-400 flex-shrink-0" />
          <span className="text-sm truncate">{node.name}</span>
        </div>
      );
    }

    const isExpanded = expandedFolders.has(path);
    const children = Object.entries(node.children || {});

    return (
      <div key={path}>
        <div
          onClick={() => toggleFolder(path)}
          className="flex items-center gap-2 px-3 py-1.5 cursor-pointer hover:bg-gray-800 rounded text-gray-300 transition-colors"
          style={{ paddingLeft: `${level * 16 + 12}px` }}
        >
          {isExpanded ? (
            <ChevronDown size={16} className="text-gray-400 flex-shrink-0" />
          ) : (
            <ChevronRight size={16} className="text-gray-400 flex-shrink-0" />
          )}
          <Folder size={16} className="text-gray-400 flex-shrink-0" />
          <span className="text-sm font-medium truncate">{node.name}</span>
        </div>
        {isExpanded && (
          <div>
            {children.map(([name, child]) =>
              renderTree(child, `${path}/${name}`, level + 1)
            )}
          </div>
        )}
      </div>
    );
  };

  const tree = buildFileTree(files);

  return (
    <div className="bg-[#0d1117] border border-gray-700 rounded-md p-2">
      <div className="text-white font-semibold text-sm mb-2 px-3 py-2">Files</div>
      <div className="space-y-0.5">
        {Object.entries(tree.children).map(([name, node]) =>
          renderTree(node, name, 0)
        )}
      </div>
    </div>
  );
};

export default FileExplorer;