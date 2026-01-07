
import React, { useContext } from 'react';
import { ContentContext } from '../App';

interface Props {
  contentKey: string;
  className?: string;
  tagName?: keyof React.JSX.IntrinsicElements;
  multiline?: boolean;
}

const EditableText: React.FC<Props> = ({ contentKey, className = "", tagName = "span", multiline = false }) => {
  const context = useContext(ContentContext);
  if (!context) return null;

  const { content, isEditMode, updateContent } = context;
  
  // CRITICAL FIX: Properly traverse deep keys like 'products.0.title'
  const getValue = (key: string) => {
    return key.split('.').reduce((obj: any, i) => (obj ? obj[i] : null), content);
  };

  const val = getValue(contentKey);
  const Tag = tagName as any;

  // Ensure we never try to render an object
  const displayValue = typeof val === 'object' ? JSON.stringify(val) : (val || "");

  if (!isEditMode) {
    return <Tag className={className}>{displayValue}</Tag>;
  }

  return (
    <Tag 
      className={`${className} border-2 border-dashed border-amber-400 bg-amber-50/50 cursor-text outline-none focus:ring-2 focus:ring-amber-500 min-h-[1em] min-w-[10px] inline-block`}
      contentEditable
      suppressContentEditableWarning
      onBlur={(e: React.FocusEvent<HTMLElement>) => updateContent(contentKey, e.currentTarget.innerText)}
    >
      {displayValue}
    </Tag>
  );
};

export default EditableText;
