import React from 'react';
import { BookOpen, Leaf, HeartPulse, HandHeart, CheckCircle, ArrowRight } from 'lucide-react';
import type { AboutContent } from '../services/api';

interface AboutSectionProps {
  content?: AboutContent;
  onOpenJoin: () => void;
}

export const AboutSection: React.FC<AboutSectionProps> = ({ content, onOpenJoin }) => {
  const tag = content?.tag || 'About RCE Movement';
  const title = content?.title ?? 'Empowering Youth to Serve with ';
  const titleGradient = content?.titleGradient || 'Heart & Integrity';
  const subtitle = content?.subtitle || 
    'Just like Kutumb (Family), RCE is founded on the philosophy that true community development begins when we treat every citizen as family.';
  const storyHeading = content?.storyHeading || 'From a Small Campus Initiative to a Statewide Movement';
  const storyParagraph1 = content?.storyParagraph1 || 
    'RCE Social Service Club began with a handful of passionate students who believed that youth energy should not be confined within classrooms. We witnessed rural children struggling with textbooks, seniors suffering without basic eye care, and barren public plots longing for shade.';
  const storyParagraph2 = content?.storyParagraph2 || 
    'Today, RCE connects thousands of students, working professionals, doctors, and community elders. We do not just hand out charity; we build self-sustaining educational ecosystems, plant trees that live for decades, and empower families with dignity.';
  
  const checklist1 = content?.checklist1 || '100% of public donations go directly into on-ground drive supplies';
  const checklist2 = content?.checklist2 || 'Full financial transparency with publicly published expenditure audits';
  const checklist3 = content?.checklist3 || 'Active chapters across universities, colleges, and residential welfare bodies';
  
  const yearsExperience = content?.yearsExperience || '5+';
  const yearsExperienceLabel = content?.yearsExperienceLabel || 'Years of Active Service';
  const drivesExperience = content?.drivesExperience || '180+ Successful Drives';
  const imageUrl = content?.imageUrl || 'https://images.unsplash.com/photo-1593113598332-cd288d649433?auto=format&fit=crop&w=800&q=80';
  const pillarsTitle = content?.pillarsTitle || 'Our 4 Core Pillars of Service';

  // Map pillar icons
  const pillarIcons = [
    <BookOpen size={28} color="#b45309" key="p1" />,
    <Leaf size={28} color="#78350f" key="p2" />,
    <HeartPulse size={28} color="#92400e" key="p3" />,
    <HandHeart size={28} color="#d97706" key="p4" />
  ];

  const pillarsData = content?.pillars?.length
    ? content.pillars
    : [
        {
          id: 'pillar-1',
          title: 'Vidhya (Education)',
          description: 'Bridging the educational divide by supporting government schools, setting up smart digital labs, and conducting free weekend tutoring.',
        },
        {
          id: 'pillar-2',
          title: 'Prakriti (Environment)',
          description: 'Championing high-density Miyawaki urban forests, lake restoration, rainwater harvesting drives, and single-use plastic eradication.',
        },
        {
          id: 'pillar-3',
          title: 'Arogya (Healthcare)',
          description: 'Zero-cost screening camps for eyes, cardiac health, diabetes, and maintaining an emergency volunteer blood donation grid.',
        },
        {
          id: 'pillar-4',
          title: 'Seva (Relief & Nutrition)',
          description: 'Immediate flood and disaster relief packages, weekend nutritious meal distributions to attendants outside public hospitals.',
        },
      ];

  return (
    <section id="about" className="about-section">
      <div className="container">
        <div className="about-header text-center">
          <span className="section-tag gold">{tag}</span>
          <h2 className="section-title">
            {title}<span className="text-gradient">{titleGradient}</span>
          </h2>
          <p className="section-subtitle">
            {subtitle}
          </p>
        </div>

        {/* 2-Column Story Grid */}
        <div className="about-story-grid">
          <div className="about-story-content">
            <h3 className="story-heading">{storyHeading}</h3>
            <p className="story-paragraph">
              {storyParagraph1}
            </p>
            <p className="story-paragraph">
              {storyParagraph2}
            </p>

            <div className="story-checklist">
              {checklist1 && (
                <div className="checklist-item">
                  <CheckCircle size={18} color="#b45309" className="flex-shrink-0" />
                  <span>{checklist1}</span>
                </div>
              )}
              {checklist2 && (
                <div className="checklist-item">
                  <CheckCircle size={18} color="#b45309" className="flex-shrink-0" />
                  <span>{checklist2}</span>
                </div>
              )}
              {checklist3 && (
                <div className="checklist-item">
                  <CheckCircle size={18} color="#b45309" className="flex-shrink-0" />
                  <span>{checklist3}</span>
                </div>
              )}
            </div>

            <div className="about-cta-row">
              <button type="button" onClick={onOpenJoin} className="btn-secondary">
                <span>Become A Member</span>
                <ArrowRight size={16} />
              </button>
              <a href="#projects" className="btn-outline">
                <span>View Our Projects</span>
              </a>
            </div>
          </div>

          <div className="about-story-visual">
            <div className="story-image-wrapper">
              <img 
                src={imageUrl} 
                alt="Community volunteers organizing relief supplies"
                className="story-main-img"
              />
              <div className="story-experience-card">
                <div className="experience-num">{yearsExperience}</div>
                <div className="experience-text">
                  <strong>{yearsExperienceLabel}</strong>
                  <span>{drivesExperience}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* 4 Pillars Grid */}
        <div className="pillars-wrapper">
          <h3 className="pillars-title text-center">{pillarsTitle}</h3>
          <div className="pillars-grid">
            {pillarsData.map((pillar, idx) => (
              <div key={pillar.id || idx} className="pillar-card card-hover">
                <div className="pillar-icon-box">{pillarIcons[idx % pillarIcons.length]}</div>
                <h4 className="pillar-name">{pillar.title}</h4>
                <p className="pillar-desc">{pillar.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};
