import React from 'react';
import { BookOpen, Leaf, HeartPulse, HandHeart, CheckCircle, ArrowRight } from 'lucide-react';

interface AboutSectionProps {
  onOpenJoin: () => void;
}

export const AboutSection: React.FC<AboutSectionProps> = ({ onOpenJoin }) => {
  const pillars = [
    {
      icon: <BookOpen size={28} color="#b45309" />,
      title: 'Vidhya (Education)',
      description: 'Bridging the educational divide by supporting government schools, setting up smart digital labs, and conducting free weekend tutoring.',
    },
    {
      icon: <Leaf size={28} color="#78350f" />,
      title: 'Prakriti (Environment)',
      description: 'Championing high-density Miyawaki urban forests, lake restoration, rainwater harvesting drives, and single-use plastic eradication.',
    },
    {
      icon: <HeartPulse size={28} color="#92400e" />,
      title: 'Arogya (Healthcare)',
      description: 'Zero-cost screening camps for eyes, cardiac health, diabetes, and maintaining an emergency volunteer blood donation grid.',
    },
    {
      icon: <HandHeart size={28} color="#d97706" />,
      title: 'Seva (Relief & Nutrition)',
      description: 'Immediate flood and disaster relief packages, weekend nutritious meal distributions to attendants outside public hospitals.',
    },
  ];

  return (
    <section id="about" className="about-section">
      <div className="container">
        <div className="about-header text-center">
          <span className="section-tag gold">About RCE Movement</span>
          <h2 className="section-title">
            Empowering Youth to Serve with <span className="text-gradient">Heart & Integrity</span>
          </h2>
          <p className="section-subtitle">
            Just like <em>Kutumb</em> (Family), RCE is founded on the philosophy that true community development begins when we treat every citizen as family.
          </p>
        </div>

        {/* 2-Column Story Grid */}
        <div className="about-story-grid">
          <div className="about-story-content">
            <h3 className="story-heading">From a Small Campus Initiative to a Statewide Movement</h3>
            <p className="story-paragraph">
              RCE Social Service Club began with a handful of passionate students who believed that 
              youth energy should not be confined within classrooms. We witnessed rural children struggling 
              with textbooks, seniors suffering without basic eye care, and barren public plots longing for shade.
            </p>
            <p className="story-paragraph">
              Today, RCE connects thousands of students, working professionals, doctors, and community elders. 
              We do not just hand out charity; we build self-sustaining educational ecosystems, plant trees that live for decades, and empower families with dignity.
            </p>

            <div className="story-checklist">
              <div className="checklist-item">
                <CheckCircle size={18} color="#b45309" className="flex-shrink-0" />
                <span>100% of public donations go directly into on-ground drive supplies</span>
              </div>
              <div className="checklist-item">
                <CheckCircle size={18} color="#b45309" className="flex-shrink-0" />
                <span>Full financial transparency with publicly published expenditure audits</span>
              </div>
              <div className="checklist-item">
                <CheckCircle size={18} color="#b45309" className="flex-shrink-0" />
                <span>Active chapters across universities, colleges, and residential welfare bodies</span>
              </div>
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
                src="https://images.unsplash.com/photo-1593113598332-cd288d649433?auto=format&fit=crop&w=800&q=80" 
                alt="Community volunteers organizing relief supplies"
                className="story-main-img"
              />
              <div className="story-experience-card">
                <div className="experience-num">5+</div>
                <div className="experience-text">
                  <strong>Years of Active Service</strong>
                  <span>180+ Successful Drives</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* 4 Pillars Grid */}
        <div className="pillars-wrapper">
          <h3 className="pillars-title text-center">Our 4 Core Pillars of Service</h3>
          <div className="pillars-grid">
            {pillars.map((pillar, idx) => (
              <div key={idx} className="pillar-card card-hover">
                <div className="pillar-icon-box">{pillar.icon}</div>
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
