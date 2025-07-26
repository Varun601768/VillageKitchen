import React, { useState } from 'react';
import { Package, Leaf, ShoppingCart, ChefHat } from 'lucide-react';
import { LoginForm } from './LoginForm';
import { RegisterForm } from './RegisterForm';

export const AuthPage: React.FC = () => {
  const [isLogin, setIsLogin] = useState(true);

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-blue-50 flex">
      {/* Left Side - Branding */}
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-green-600 to-green-700 p-12 flex-col justify-center relative overflow-hidden">
        <div className="absolute inset-0 bg-black bg-opacity-10"></div>
        <div className="relative z-10">
          <div className="flex items-center space-x-3 mb-8">
            <div className="bg-white bg-opacity-20 p-3 rounded-xl">
              <Package className="w-8 h-8 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-white">Smart Pantry</h1>
              <p className="text-green-100">Reduce waste, cook smarter</p>
            </div>
          </div>

          <div className="space-y-6 mb-12">
            <h2 className="text-4xl font-bold text-white leading-tight">
              Transform Your Kitchen Into a Smart, Waste-Free Zone
            </h2>
            <p className="text-xl text-green-100 leading-relaxed">
              Track your pantry inventory, get recipe suggestions based on what you have, 
              and never let food go to waste again.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-6">
            <div className="bg-white bg-opacity-10 backdrop-blur-sm rounded-lg p-4">
              <div className="flex items-center space-x-3 mb-2">
                <Leaf className="w-6 h-6 text-green-200" />
                <h3 className="font-semibold text-white">Reduce Waste</h3>
              </div>
              <p className="text-green-100 text-sm">
                Get alerts before items expire and suggestions for using them up
              </p>
            </div>

            <div className="bg-white bg-opacity-10 backdrop-blur-sm rounded-lg p-4">
              <div className="flex items-center space-x-3 mb-2">
                <ChefHat className="w-6 h-6 text-green-200" />
                <h3 className="font-semibold text-white">Smart Recipes</h3>
              </div>
              <p className="text-green-100 text-sm">
                Discover recipes based on ingredients you already have at home
              </p>
            </div>

            <div className="bg-white bg-opacity-10 backdrop-blur-sm rounded-lg p-4">
              <div className="flex items-center space-x-3 mb-2">
                <Package className="w-6 h-6 text-green-200" />
                <h3 className="font-semibold text-white">Digital Inventory</h3>
              </div>
              <p className="text-green-100 text-sm">
                Keep track of everything in your pantry with expiry dates
              </p>
            </div>

            <div className="bg-white bg-opacity-10 backdrop-blur-sm rounded-lg p-4">
              <div className="flex items-center space-x-3 mb-2">
                <ShoppingCart className="w-6 h-6 text-green-200" />
                <h3 className="font-semibold text-white">Smart Shopping</h3>
              </div>
              <p className="text-green-100 text-sm">
                Generate shopping lists for missing recipe ingredients
              </p>
            </div>
          </div>
        </div>

        {/* Decorative elements */}
        <div className="absolute top-20 right-20 w-32 h-32 bg-white bg-opacity-5 rounded-full"></div>
        <div className="absolute bottom-20 left-20 w-24 h-24 bg-white bg-opacity-5 rounded-full"></div>
        <div className="absolute top-1/2 right-10 w-16 h-16 bg-white bg-opacity-5 rounded-full"></div>
      </div>

      {/* Right Side - Auth Forms */}
      <div className="flex-1 flex items-center justify-center p-8">
        <div className="w-full max-w-md">
          {/* Mobile Logo */}
          <div className="lg:hidden flex items-center justify-center space-x-3 mb-8">
            <div className="bg-green-600 p-2 rounded-lg">
              <Package className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Smart Pantry</h1>
              <p className="text-gray-600 text-sm">Reduce waste, cook smarter</p>
            </div>
          </div>

          {isLogin ? (
            <LoginForm onSwitchToRegister={() => setIsLogin(false)} />
          ) : (
            <RegisterForm onSwitchToLogin={() => setIsLogin(true)} />
          )}
        </div>
      </div>
    </div>
  );
};