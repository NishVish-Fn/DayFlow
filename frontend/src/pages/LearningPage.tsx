import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import {
  GraduationCap,
  BookOpen,
  Award,
  Sparkles,
  CheckCircle2,
  Clock,
  ArrowRight,
  TrendingUp,
  Flame,
  Search,
  Zap,
} from 'lucide-react';
import { Button } from '../components/common/Button';
import { Badge } from '../components/common/Badge';

interface Skill {
  name: string;
  category: string;
  proficiency: number; // 0 - 100
  level: 'BEGINNER' | 'INTERMEDIATE' | 'ADVANCED' | 'EXPERT';
  gapForPromotion: boolean;
}

interface Course {
  id: string;
  title: string;
  provider: string;
  duration: string;
  skillsCovered: string[];
  enrolled: boolean;
  progress: number;
  badgeUrl: string;
}

export const LearningPage: React.FC = () => {
  const { user } = useAuth();

  const [skills, setSkills] = useState<Skill[]>([
    { name: 'PostgreSQL Relational DB Design', category: 'Backend', proficiency: 92, level: 'EXPERT', gapForPromotion: false },
    { name: 'TypeScript & React Architecture', category: 'Frontend', proficiency: 88, level: 'ADVANCED', gapForPromotion: false },
    { name: 'Distributed Caching & Redis', category: 'Infrastructure', proficiency: 58, level: 'INTERMEDIATE', gapForPromotion: true },
    { name: 'SOC-2 Compliance & Infosec', category: 'Security', proficiency: 45, level: 'INTERMEDIATE', gapForPromotion: true },
    { name: 'Engineering Leadership & Mentorship', category: 'Leadership', proficiency: 75, level: 'ADVANCED', gapForPromotion: false },
  ]);

  const [courses, setCourses] = useState<Course[]>([
    {
      id: '1',
      title: 'Advanced PostgreSQL 3NF Index Tuning & Connection Pooling',
      provider: 'Dayflow Enterprise Academy',
      duration: '4.5 Hours',
      skillsCovered: ['PostgreSQL', 'Performance', 'DBA'],
      enrolled: true,
      progress: 75,
      badgeUrl: '🐘',
    },
    {
      id: '2',
      title: 'Enterprise Distributed Systems & Redis Caching Patterns',
      provider: 'Cloud Infrastructure Institute',
      duration: '6.0 Hours',
      skillsCovered: ['Redis', 'Distributed Systems', 'Caching'],
      enrolled: true,
      progress: 30,
      badgeUrl: '⚡',
    },
    {
      id: '3',
      title: 'SOC-2 Type II Audit Readiness & Cryptographic Token Rotation',
      provider: 'Corporate Security Standards',
      duration: '3.0 Hours',
      skillsCovered: ['Infosec', 'Compliance', 'Audit'],
      enrolled: false,
      progress: 0,
      badgeUrl: '🛡️',
    },
    {
      id: '4',
      title: 'High-Velocity Technical Management & Sprint Planning',
      provider: 'Executive Leadership School',
      duration: '5.0 Hours',
      skillsCovered: ['Leadership', 'Agile', 'Mentorship'],
      enrolled: false,
      progress: 0,
      badgeUrl: '👑',
    },
  ]);

  const handleEnroll = (id: string) => {
    setCourses((prev) =>
      prev.map((c) => (c.id === id ? { ...c, enrolled: true, progress: 10 } : c))
    );
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2 font-display">
            <GraduationCap className="w-5 h-5 text-blue-600" /> Personalized Learning & Skill Matrix
          </h2>
          <p className="text-xs text-slate-500 mt-0.5 font-medium">
            AI-powered skill gap analyzer, personalized training pathways, and verified certification tracker.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="px-3 py-1 rounded-full bg-blue-50 text-blue-700 border border-blue-200 text-xs font-bold flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-blue-600" /> AI Skill Engine
          </span>
        </div>
      </div>

      {/* AI Skill Gap Recommendation Banner */}
      <div className="bg-gradient-to-r from-blue-900 via-indigo-950 to-slate-900 rounded-3xl p-6 text-white shadow-lg flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-1.5 max-w-xl">
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-blue-500/20 text-blue-300 text-[11px] font-bold border border-blue-400/30">
            <Zap className="w-3.5 h-3.5" /> Career Ladder Path: Staff Architect
          </div>
          <h3 className="text-lg font-extrabold text-white">2 Skill Gaps Identified for Next Band Promotion</h3>
          <p className="text-xs text-slate-300 leading-relaxed font-medium">
            Based on your role in <strong className="text-white">{user?.profile?.department || 'Engineering'}</strong>, completing the recommended Redis & Infosec certifications will fulfill 100% of the promotion band requirements.
          </p>
        </div>

        <div className="shrink-0">
          <Button variant="primary" size="md" className="bg-blue-600 hover:bg-blue-700 text-white font-bold shadow-md">
            View Promotion Pathway &rarr;
          </Button>
        </div>
      </div>

      {/* Main Grid: Skill Matrix on Left, Course Catalog on Right */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left: Skill Matrix (5 cols) */}
        <div className="lg:col-span-5 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <Award className="w-4 h-4 text-amber-500" /> Current Competency Matrix
            </h3>
            <span className="text-xs text-slate-400 font-medium">5 Skills Evaluated</span>
          </div>

          <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm space-y-4">
            {skills.map((skill, idx) => (
              <div key={idx} className="space-y-1.5 pb-3 border-b border-slate-100 last:border-b-0 last:pb-0">
                <div className="flex items-center justify-between text-xs">
                  <div>
                    <span className="font-bold text-slate-900">{skill.name}</span>
                    <span className="text-[10px] text-slate-400 block">{skill.category}</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    {skill.gapForPromotion && (
                      <span className="text-[10px] bg-rose-50 text-rose-600 font-extrabold px-1.5 py-0.5 rounded border border-rose-200">
                        Gap
                      </span>
                    )}
                    <span className="font-mono font-bold text-slate-700 text-xs">{skill.proficiency}%</span>
                  </div>
                </div>

                {/* Progress bar */}
                <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full ${
                      skill.proficiency >= 85
                        ? 'bg-emerald-500'
                        : skill.proficiency >= 70
                        ? 'bg-blue-600'
                        : skill.proficiency >= 50
                        ? 'bg-amber-500'
                        : 'bg-rose-500'
                    }`}
                    style={{ width: `${skill.proficiency}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right: Curated Course Catalog & Enrollment (7 cols) */}
        <div className="lg:col-span-7 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <BookOpen className="w-4 h-4 text-blue-600" /> AI-Curated Learning Pathways
            </h3>
            <span className="text-xs text-slate-400 font-medium">Free Organization Access</span>
          </div>

          <div className="space-y-3.5">
            {courses.map((course) => (
              <div
                key={course.id}
                className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm space-y-3 hover:border-slate-300 transition-all flex flex-col justify-between"
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex items-start gap-3.5">
                    <div className="text-2xl p-2.5 rounded-2xl bg-slate-50 border border-slate-200 shrink-0">
                      {course.badgeUrl}
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-slate-900">{course.title}</h4>
                      <p className="text-xs text-slate-500 mt-0.5">
                        {course.provider} &bull; <Clock className="w-3 h-3 inline text-slate-400" /> {course.duration}
                      </p>

                      <div className="flex flex-wrap gap-1.5 mt-2">
                        {course.skillsCovered.map((s, idx) => (
                          <span
                            key={idx}
                            className="text-[10px] font-semibold bg-slate-100 text-slate-600 px-2 py-0.5 rounded-md"
                          >
                            {s}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>

                  <div className="shrink-0">
                    {course.enrolled ? (
                      <Badge variant="success" size="sm">Enrolled ({course.progress}%)</Badge>
                    ) : (
                      <Button
                        variant="secondary"
                        size="sm"
                        onClick={() => handleEnroll(course.id)}
                        className="text-xs"
                      >
                        Enroll Now
                      </Button>
                    )}
                  </div>
                </div>

                {course.enrolled && (
                  <div className="pt-2 border-t border-slate-100 space-y-1">
                    <div className="flex justify-between text-[11px] font-bold text-slate-600">
                      <span>Course Completion</span>
                      <span>{course.progress}%</span>
                    </div>
                    <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden">
                      <div className="bg-blue-600 h-full rounded-full" style={{ width: `${course.progress}%` }} />
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
};
