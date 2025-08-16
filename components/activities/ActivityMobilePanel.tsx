"use client"

import { motion } from 'framer-motion';

interface Activity {
  id: string;
  name: string;
  emoji: string;
  color: string;
}

interface ActionItem {
  id: string;
  name: string;
  emoji: string;
  color: string;
  description: string;
  reward?: string;
}

interface ActivityMobilePanelProps {
  currentActivity: string;
  activities: Activity[];
  onActivityClick: (activityId: string) => void;
  actionItems?: ActionItem[];
  onActionClick?: (actionId: string) => void;
  isActionDisabled?: boolean;
  className?: string;
}

const ActivityMobilePanel = ({
  currentActivity,
  activities,
  onActivityClick,
  actionItems,
  onActionClick,
  isActionDisabled = false,
  className = ""
}: ActivityMobilePanelProps) => {
  
  // Show action items if we have them and we're in the specific activity mode
  const showActions = actionItems && actionItems.length > 0;

  return (
    <div className={`grid grid-cols-1 gap-2 mt-4 ${className}`}>
      {showActions ? (
        // Show action items
        actionItems.map((action, index) => (
          <motion.button
            key={action.id}
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.4, delay: 0.7 + index * 0.1 }}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => onActionClick?.(action.id)}
            disabled={isActionDisabled}
            className={`w-full flex items-center gap-3 p-3 rounded-lg border transition-all duration-300 ${
              isActionDisabled
                ? 'border-gray-300 bg-gray-100/80 opacity-50 cursor-not-allowed'
                : 'border-white/40 bg-gradient-to-r from-white/90 to-white/80 backdrop-blur-lg hover:border-purple-200 hover:shadow-lg'
            }`}
          >
            <div className={`h-10 w-10 rounded-lg bg-gradient-to-r ${action.color} flex items-center justify-center shadow-md transition-all duration-300`}>
              <span className="text-lg leading-none">{action.emoji}</span>
            </div>
            <div className="flex-1 text-left">
              <span className="text-sm font-bold text-gray-700 block">
                {action.name}
              </span>
              <span className="text-xs text-gray-500">
                {action.description}
              </span>
            </div>
            {action.reward && (
              <div className="text-right">
                <span className="text-xs font-bold text-yellow-600">
                  +{action.reward}
                </span>
                <span className="text-xs text-gray-500 block">coins</span>
              </div>
            )}
          </motion.button>
        ))
      ) : (
        // Show regular activities (limit to 4 for mobile)
        activities.slice(0, 4).map((activity, index) => {
          const isActive = currentActivity === activity.id;
          return (
            <motion.button
              key={activity.id}
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.4, delay: 0.7 + index * 0.1 }}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => onActivityClick(activity.id)}
              className={`w-full flex items-center gap-3 p-3 rounded-lg border transition-all duration-300 ${
                isActive
                  ? 'border-purple-300 bg-gradient-to-r from-purple-100/80 to-pink-100/80 shadow-xl scale-105'
                  : 'border-white/40 bg-gradient-to-r from-white/90 to-white/80 backdrop-blur-lg hover:border-purple-200 hover:shadow-lg'
              }`}
            >
              <div className={`h-10 w-10 rounded-lg bg-gradient-to-r ${activity.color} flex items-center justify-center shadow-md transition-all duration-300`}>
                <span className="text-lg leading-none">{activity.emoji}</span>
              </div>
              <span className={`text-sm font-bold ${
                isActive ? 'text-purple-700' : 'text-gray-700'
              }`}>
                {activity.name}
              </span>

              {isActive && (
                <motion.div
                  className="ml-auto w-5 h-5 bg-gradient-to-r from-purple-400 to-pink-400 rounded-full flex items-center justify-center"
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ duration: 0.3 }}
                >
                  <span className="text-white text-xs leading-none">✓</span>
                </motion.div>
              )}
            </motion.button>
          );
        })
      )}
    </div>
  );
};

export default ActivityMobilePanel;
