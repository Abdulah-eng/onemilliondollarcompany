import React from 'react';
import { MultiSelectButton } from './MultiSelectButton';

interface SkillsSelectorProps {
  selectedSkills: string[];
  onSkillsChange: (skills: string[]) => void;
}

const PREDEFINED_SKILLS = [
  // Fitness
  'Strength Training',
  'HIIT',
  'Yoga',
  'Pilates',
  'Bodybuilding',
  'Endurance',
  'Weight Loss',
  'Functional Training',
  
  // Nutrition
  'Meal Planning',
  'Sports Nutrition',
  'Weight Management',
  'Dietary Restrictions',
  'Supplements',
  'Macro Coaching',
  
  // Mental Health
  'Mindfulness',
  'Stress Management',
  'Motivation Coaching',
  'Habit Formation',
  'Work-Life Balance',
  'Goal Setting',
  
  // Specializations
  'Injury Rehabilitation',
  'Senior Fitness',
  'Youth Training',
  'Competition Prep',
  'Posture Correction',
  'Athletic Performance'
];

export const SkillsSelector: React.FC<SkillsSelectorProps> = ({
  selectedSkills,
  onSkillsChange,
}) => {
  const toggleSkill = (skill: string) => {
    if (selectedSkills.includes(skill)) {
      onSkillsChange(selectedSkills.filter(s => s !== skill));
    } else {
      onSkillsChange([...selectedSkills, skill]);
    }
  };

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
        {PREDEFINED_SKILLS.map((skill) => (
          <MultiSelectButton
            key={skill}
            selected={selectedSkills.includes(skill)}
            onClick={() => toggleSkill(skill)}
          >
            {skill}
          </MultiSelectButton>
        ))}
      </div>
    </div>
  );
};