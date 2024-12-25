import React from 'react';
import { Link } from 'react-router-dom';
import { ClipboardCheck, Shield, Clock, BarChart } from 'lucide-react';
import HeroSection from '../components/home/HeroSection';
import FeatureCard from '../components/home/FeatureCard';

export default function HomePage() {
  const features = [
    {
      icon: <ClipboardCheck className="w-8 h-8 text-blue-500" />,
      title: "Efficient Data Entry",
      description: "Split-screen interface with PDF viewer and rich text editor for maximum productivity"
    },
    {
      icon: <Shield className="w-8 h-8 text-green-500" />,
      title: "Secure & Reliable",
      description: "Enterprise-grade security with role-based access control and data encryption"
    },
    {
      icon: <Clock className="w-8 h-8 text-purple-500" />,
      title: "Deadline Management",
      description: "Smart task prioritization and deadline tracking to keep projects on schedule"
    },
    {
      icon: <BarChart className="w-8 h-8 text-orange-500" />,
      title: "Performance Analytics",
      description: "Detailed metrics and scoring system to measure and improve productivity"
    }
  ];

  return (
    <div className="flex flex-col min-h-screen">
      <HeroSection />
      
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 sm:text-4xl">
              Features that empower your team
            </h2>
            <p className="mt-4 text-lg text-gray-600">
              Everything you need to manage data entry operations efficiently
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <FeatureCard key={index} {...feature} />
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}