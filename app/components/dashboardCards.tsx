import { Users, Calendar, Hourglass, AlertCircle, TrendingUp, TrendingDown } from 'lucide-react';

export default function DashboardCards() {
  const cards = [
    {
      icon: <Users className="w-8 h-8 text-white" />,
      title: "Total Patients",
      value: "1,284",
      percentage: "100%",
      trend: "up",
      bgColor: "bg-purple-100",
      iconBg: "bg-purple-600"
    },
    {
      icon: <Calendar className="w-8 h-8 text-white" />,
      title: "Today's Appointments",
      value: "42",
      percentage: "100%",
      trend: "up",
      bgColor: "bg-teal-100",
      iconBg: "bg-teal-500"
    },
    {
      icon: <Hourglass className="w-8 h-8 text-white" />,
      title: "Pending Lab Results",
      value: "18",
      percentage: "46%",
      trend: "up",
      bgColor: "bg-blue-100",
      iconBg: "bg-blue-500"
    },
    {
      icon: <AlertCircle className="w-8 h-8 text-white" />,
      title: "Critical Patients",
      value: "6",
      percentage: "4%",
      trend: "down",
      bgColor: "bg-red-100",
      iconBg: "bg-red-500"
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {cards.map((card, index) => (
        <div
          key={index}
          className={`${card.bgColor} rounded-3xl p-6 `}
        >
          <div className={`${card.iconBg} w-16 h-16 rounded-full flex items-center justify-center mb-4`}>
            {card.icon}
          </div>

          <h3 className="text-gray-600 text-sm font-medium mb-2">
            {card.title}
          </h3>

          <div className="flex items-end justify-between">
            <p className="text-4xl  text-gray-800">
              {card.value}
            </p>

            <div className={`flex items-center ${card.trend === 'up' ? 'text-green-600' : 'text-red-500'}`}>
              {card.trend === 'up' ? (
                <TrendingUp className="w-5 h-5 mr-1" />
              ) : (
                <TrendingDown className="w-5 h-5 mr-1" />
              )}
              <span className="text-sm font-semibold">{card.percentage}</span>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}