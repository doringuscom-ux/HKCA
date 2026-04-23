import { ScrollReveal } from '../common/Animations';
 import { 
  RiWaterFlashLine, 
  RiMedalLine, 
  RiShieldUserLine, 
  RiMapPinLine, 
  RiTrophyLine,
  RiStarLine
} from 'react-icons/ri';
 
 
const Objectives = () => {
    
  return (

     <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
          {/* Objectives */}
          <ScrollReveal variant="slideInLeft">
            <div className="space-y-8">
              <div className="flex items-center gap-4 border-b border-gray-200 pb-4">
                <div className="p-3 bg-red-50 text-red-500 rounded-xl">
                  <RiMedalLine size={28} />
                </div>
                <h3 className="text-2xl font-black text-slate-900 uppercase tracking-tighter">Objectives of HKCA</h3>
              </div>
              <ul className="space-y-4 text-slate-600 font-medium">
                <li className="flex items-start gap-3"><span className="text-red-400 mt-1">●</span> Promote and develop kayaking and canoeing in Haryana</li>
                <li className="flex items-start gap-3"><span className="text-red-400 mt-1">●</span> Organize state-level championships and competitions</li>
                <li className="flex items-start gap-3"><span className="text-red-400 mt-1">●</span> Provide coaching, training camps, and technical education</li>
                <li className="flex items-start gap-3"><span className="text-red-400 mt-1">●</span> Select and send teams for national championships</li>
                <li className="flex items-start gap-3"><span className="text-red-400 mt-1">●</span> Support athletes for participation in international events</li>
                <li className="flex items-start gap-3"><span className="text-red-400 mt-1">●</span> Spread awareness about water sports in rural and urban areas</li>
              </ul>
              <p className="text-sm italic text-slate-500 bg-red-50 p-4 rounded-xl border border-red-100/50">
                These objectives align with national guidelines of IKCA which focuses on promotion, training, and participation at all levels.
              </p>
            </div>
          </ScrollReveal>

          {/* Activities */}
          <ScrollReveal variant="slideInRight">
            <div className="space-y-8">
              <div className="flex items-center gap-4 border-b border-gray-200 pb-4">
                <div className="p-3 bg-emerald-50 text-emerald-500 rounded-xl">
                  <RiShieldUserLine size={28} />
                </div>
                <h3 className="text-2xl font-black text-slate-900 uppercase tracking-tighter">Activities</h3>
              </div>
              <ul className="space-y-4 text-slate-600 font-medium">
                <li className="flex items-start gap-3"><span className="text-emerald-400 mt-1">●</span> State Championships & District Competitions</li>
                <li className="flex items-start gap-3"><span className="text-emerald-400 mt-1">●</span> Coaching Camps & Training Programs</li>
                <li className="flex items-start gap-3"><span className="text-emerald-400 mt-1">●</span> Talent Identification Programs</li>
                <li className="flex items-start gap-3"><span className="text-emerald-400 mt-1">●</span> Participation in National Championships</li>
                <li className="flex items-start gap-3"><span className="text-emerald-400 mt-1">●</span> Water Sports Awareness Programs</li>
                <li className="flex items-start gap-3"><span className="text-emerald-400 mt-1">●</span> Collaboration with Government & Sports Authorities</li>
              </ul>
              <p className="text-sm italic text-slate-500 bg-emerald-50 p-4 rounded-xl border border-emerald-100/50">
                IKCA organizes similar national activities including sprint, slalom, and dragon boat events across India.
              </p>
            </div>
          </ScrollReveal>
        </div>
  )
}


export default Objectives
