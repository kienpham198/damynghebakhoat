
import React, { useContext } from 'react';
import { ContentContext } from '../App';
import EditableText from './EditableText';
import EditableImage from './EditableImage';

const AboutSection: React.FC = () => {
  const context = useContext(ContentContext);
  if (!context) return null;

  const { content } = context;

  return (
    <div className="flex flex-col lg:flex-row items-center gap-12 bg-white rounded-2xl shadow-xl overflow-hidden">
      <div className="lg:w-1/2 h-[500px]">
        <EditableImage contentKey="aboutImage" className="w-full h-full" />
      </div>
      <div className="lg:w-1/2 p-8 lg:p-12">
        <div className="relative inline-block mb-6">
          <EditableText tagName="h2" contentKey="aboutTitle" className="text-3xl font-serif font-bold text-stone-800" />
          <div className="absolute -bottom-2 left-0 w-1/2 h-1 bg-amber-600"></div>
        </div>
        <EditableText tagName="div" contentKey="aboutContent" className="text-stone-600 mb-6 leading-relaxed whitespace-pre-wrap" />
        
        <div className="space-y-4 mb-8">
          {content.aboutFeatures.map((feature, idx) => (
            <div key={idx} className="flex items-start gap-4">
              <div className="bg-amber-100 text-amber-600 p-3 rounded-full flex-shrink-0">
                <i className={`fas ${idx === 0 ? 'fa-check' : idx === 1 ? 'fa-hammer' : 'fa-truck'}`}></i>
              </div>
              <div>
                <EditableText tagName="h4" contentKey={`aboutFeatures.${idx}.title`} className="font-bold text-stone-800 block" />
                <EditableText tagName="p" contentKey={`aboutFeatures.${idx}.desc`} className="text-sm text-stone-500 block" />
              </div>
            </div>
          ))}
        </div>
        {/* Nút hành trình phát triển đã bị loại bỏ theo yêu cầu */}
      </div>
    </div>
  );
};

export default AboutSection;
