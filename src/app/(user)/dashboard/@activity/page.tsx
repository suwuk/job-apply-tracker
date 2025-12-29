import { CheckCircle2 } from "lucide-react";

const ACTIVITIES = [
  { text: "You added a new job at Gojek", time: "2h ago" },
  { text: "Recruiter from Tokopedia viewed your profile", time: "5h ago" },
  { text: "Andi has an interview scheduled with Traveloka", time: "1d ago" },
];

export default function ActivityPage() {
  return (
    <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-50 h-full">
      <h3 className="text-lg font-bold mb-6 text-gray-800">Recent Activity</h3>
      <div className="space-y-6">
        {ACTIVITIES.map((activity, index) => (
          <div key={index} className="flex items-start gap-4 group">
            <div className="mt-1">
              <CheckCircle2 size={18} className="text-[#48A98E]" />
            </div>
            <div className="flex-1 flex justify-between items-start border-b border-gray-50 pb-4 last:border-0">
              <p className="text-sm text-gray-700 leading-tight pr-4">
                {activity.text}
              </p>
              <span className="text-xs text-gray-400 whitespace-nowrap italic">
                {activity.time}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
