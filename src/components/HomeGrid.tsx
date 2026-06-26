import React from 'react';
import { motion } from 'framer-motion';
import { Calculator, Video, Users, Target, Settings, BarChart3, Award, TrendingUp, DollarSign, Leaf, Globe, BookOpen, Zap, Phone, Monitor, ArrowRight, Play, Star, FileText, PieChart, LineChart, Table, Receipt, Percent, Calendar, Shield, Coins, TreeDeciduous, Sprout, Trees, Rocket, GraduationCap, Briefcase, Sliders, PiggyBank, Home, Sparkles, Repeat, Bike, Waves } from 'lucide-react';
import { getColorForCalculator, getColorKeyForCalculator } from '../utils/colorMapping';

interface GridCalculator {
  id: string;
  name: string;
  description: string;
  icon: React.ReactNode;
  features: string[];
  action: () => void;
}

interface HomeGridProps {
  calculators: GridCalculator[];
}

const HomeGrid: React.FC<HomeGridProps> = ({ calculators }) => {
  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.3,
      },
    },
  };

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: {
      opacity: 1,
      y: 0,
      transition: {
        type: 'spring',
        stiffness: 300,
        damping: 30,
      },
    },
  };

  return (
    <div className="w-full">
      <motion.div
        variants={container}
        initial="hidden"
        animate="show"
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-7xl mx-auto"
      >
        {calculators.map((calc, index) => {
          const colors = getColorForCalculator(index);
          const colorKey = getColorKeyForCalculator(index);

          return (
            <motion.div
              key={calc.id}
              variants={item}
              whileHover={{ y: -8, transition: { duration: 0.3 } }}
              whileTap={{ scale: 0.98 }}
              onClick={calc.action}
              className="group cursor-pointer h-full"
            >
              <div className="h-full bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-2xl transition-all duration-300 flex flex-col border border-gray-100">
                {/* Header with gradient */}
                <div className={`bg-gradient-to-br ${colors.gradient} p-6 text-white relative overflow-hidden`}>
                  <div className="absolute top-0 right-0 w-24 h-24 opacity-10">
                    <Waves className="w-full h-full" />
                  </div>
                  <div className="relative flex items-start justify-between">
                    <div className={`${colors.lightBg} p-3 rounded-2xl group-hover:scale-110 transition-transform duration-300`}>
                      <div className={`${colors.text}`}>
                        {calc.icon}
                      </div>
                    </div>
                    <ArrowRight className="w-5 h-5 opacity-0 group-hover:opacity-100 transform translate-x-2 group-hover:translate-x-0 transition-all duration-300" />
                  </div>
                </div>

                {/* Content */}
                <div className="p-6 flex-1 flex flex-col">
                  <h3 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-gray-800">
                    {calc.name}
                  </h3>
                  <p className="text-gray-600 text-sm mb-4 flex-grow">
                    {calc.description}
                  </p>

                  {/* Features */}
                  {calc.features.length > 0 && (
                    <div className="space-y-2 mb-6">
                      {calc.features.slice(0, 3).map((feature, idx) => (
                        <div key={idx} className="flex items-center gap-2 text-sm text-gray-600">
                          <div className={`w-1.5 h-1.5 rounded-full ${colors.bg}`}></div>
                          <span>{feature}</span>
                        </div>
                      ))}
                      {calc.features.length > 3 && (
                        <div className="text-xs text-gray-500 mt-2">
                          +{calc.features.length - 3} más...
                        </div>
                      )}
                    </div>
                  )}

                  {/* CTA Button */}
                  <button
                    onClick={calc.action}
                    className={`w-full bg-gradient-to-r ${colors.gradient} text-white font-semibold py-2 px-4 rounded-xl transition-all duration-300 group-hover:shadow-lg group-hover:shadow-current flex items-center justify-center gap-2`}
                  >
                    <span>Acceder</span>
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </button>
                </div>
              </div>
            </motion.div>
          );
        })}
      </motion.div>
    </div>
  );
};

export default HomeGrid;
