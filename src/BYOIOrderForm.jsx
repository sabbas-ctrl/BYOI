import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, Check, X, Calendar, Clock, MapPin, CreditCard } from 'lucide-react';

const BYOIOrderForm = () => {
  const [currentStep, setCurrentStep] = useState(0);
  const [orderData, setOrderData] = useState({
    name: '',
    email: '',
    phone: '',
    base: null,
    milkProtein: null,
    mixIns: [],
    sweetener: null,
    extraRich: false,
    consistency: null,
    pickupDate: ''
  });

  // Configuration data
  const baseOptions = [
    { id: 'vanilla', name: 'Classic Vanilla', price: 8.99, description: 'Our signature Madagascar vanilla base - creamy, smooth, and perfectly balanced' },
    { id: 'chocolate', name: 'Rich Chocolate', price: 9.99, description: 'Decadent Belgian cocoa blend with hints of dark chocolate' },
    { id: 'strawberry', name: 'Fresh Strawberry', price: 9.49, description: 'Made with real strawberry puree and natural fruit pieces' },
    { id: 'mint', name: 'Cool Mint', price: 8.99, description: 'Refreshing peppermint base with a cooling sensation' }
  ];

  const milkProteinOptions = [
    { id: 'dairy', name: 'Classic Dairy', price: 0, description: 'Traditional whole milk for the creamiest texture' },
    { id: 'oat', name: 'Oat Milk', price: 1.50, description: 'Creamy oat milk alternative with natural sweetness' },
    { id: 'almond', name: 'Almond Milk', price: 1.25, description: 'Light and nutty almond milk base' }
  ];

  const mixInOptions = [
    { id: 'chocolate-chips', name: 'Chocolate Chips', price: 1.50, description: 'Premium dark chocolate chips' },
    { id: 'cookie-dough', name: 'Cookie Dough', price: 2.00, description: 'Edible vanilla cookie dough chunks' },
    { id: 'nuts', name: 'Mixed Nuts', price: 1.75, description: 'Roasted almonds, pecans, and walnuts' },
    { id: 'caramel', name: 'Caramel Swirl', price: 1.25, description: 'Rich salted caramel ribbons' },
    { id: 'berries', name: 'Fresh Berries', price: 2.25, description: 'Seasonal berry medley' },
    { id: 'sprinkles', name: 'Rainbow Sprinkles', price: 0.75, description: 'Colorful rainbow sprinkles' }
  ];

  const sweetenerOptions = [
    { id: 'sugar', name: 'Classic Sugar', price: 0, description: 'Traditional cane sugar sweetness' },
    { id: 'honey', name: 'Pure Honey', price: 0.50, description: 'Natural wildflower honey' },
    { id: 'maple', name: 'Maple Syrup', price: 0.75, description: 'Grade A maple syrup from Vermont' },
    { id: 'agave', name: 'Agave Nectar', price: 0.60, description: 'Natural agave sweetener' },
    { id: 'stevia', name: 'Stevia Extract', price: 0.25, description: 'Zero-calorie natural stevia' }
  ];

  const consistencyOptions = [
    { 
      id: 'scoop', 
      name: 'Scoop Style', 
      description: 'Firm, scoopable ice cream perfect for cones and bowls. Dense texture that holds its shape beautifully.',
      image: '🍨'
    },
    { 
      id: 'soft', 
      name: 'Soft Serve', 
      description: 'Creamy, smooth soft-serve texture that\'s lighter and airier. Perfect for swirls and toppings.',
      image: '🍦'
    }
  ];

  const steps = [
    'Contact Info',
    'Ice Cream Base',
    'Milk Choice',
    'Mix-Ins',
    'Sweetener',
    'Richness',
    'Consistency',
    'Pickup Date',
    'Order Summary'
  ];

  const calculateTotal = () => {
    let total = 0;
    if (orderData.base) total += baseOptions.find(b => b.id === orderData.base)?.price || 0;
    if (orderData.milkProtein) total += milkProteinOptions.find(m => m.id === orderData.milkProtein)?.price || 0;
    orderData.mixIns.forEach(mixIn => {
      total += mixInOptions.find(m => m.id === mixIn)?.price || 0;
    });
    if (orderData.sweetener) total += sweetenerOptions.find(s => s.id === orderData.sweetener)?.price || 0;
    if (orderData.extraRich) total += 1.50;
    return total;
  };

  const updateOrderData = (key, value) => {
    setOrderData(prev => ({ ...prev, [key]: value }));
  };

  const nextStep = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const canProceed = () => {
    switch (currentStep) {
      case 0: return orderData.name && orderData.email && orderData.phone;
      case 1: return orderData.base;
      case 2: return orderData.milkProtein;
      case 3: return true; // Mix-ins are optional
      case 4: return orderData.sweetener;
      case 5: return true; // Extra rich is optional
      case 6: return orderData.consistency;
      case 7: return orderData.pickupDate;
      default: return true;
    }
  };

  const renderStep = () => {
    switch (currentStep) {
      case 0:
        return (
          <div className="space-y-6">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold text-white mb-4">Let's Get Started!</h2>
              <p className="text-orange-100 text-lg">Tell us a bit about yourself so we can create your perfect ice cream experience.</p>
            </div>
            <div className="space-y-4">
              <div>
                <label className="block text-white font-medium mb-2">Full Name</label>
                <input
                  type="text"
                  value={orderData.name}
                  onChange={(e) => updateOrderData('name', e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border border-orange-200 focus:ring-2 focus:ring-orange-300 focus:border-transparent text-gray-800 text-lg"
                  placeholder="Enter your full name"
                />
              </div>
              <div>
                <label className="block text-white font-medium mb-2">Email Address</label>
                <input
                  type="email"
                  value={orderData.email}
                  onChange={(e) => updateOrderData('email', e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border border-orange-200 focus:ring-2 focus:ring-orange-300 focus:border-transparent text-gray-800 text-lg"
                  placeholder="your.email@example.com"
                />
              </div>
              <div>
                <label className="block text-white font-medium mb-2">Phone Number</label>
                <input
                  type="tel"
                  value={orderData.phone}
                  onChange={(e) => updateOrderData('phone', e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border border-orange-200 focus:ring-2 focus:ring-orange-300 focus:border-transparent text-gray-800 text-lg"
                  placeholder="+1 (555) 123-4567"
                />
              </div>
            </div>
          </div>
        );

      case 1:
        return (
          <div className="space-y-6">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold text-white mb-4">Choose Your Base</h2>
              <p className="text-orange-100 text-lg">The foundation of your perfect ice cream. Each base is crafted with premium ingredients and sets the flavor profile for your creation.</p>
            </div>
            <div className="grid gap-4">
              {baseOptions.map((base) => (
                <div
                  key={base.id}
                  onClick={() => updateOrderData('base', base.id)}
                  className={`p-6 rounded-xl border-2 cursor-pointer transition-all duration-200 hover:scale-105 ${
                    orderData.base === base.id
                      ? 'border-yellow-400 bg-white bg-opacity-20 shadow-lg'
                      : 'border-white border-opacity-30 bg-white bg-opacity-10 hover:bg-opacity-20'
                  }`}
                >
                  <div className="flex justify-between items-start mb-3">
                    <h3 className="text-xl font-bold text-white">{base.name}</h3>
                    <span className="text-yellow-300 font-bold text-lg">${base.price}</span>
                  </div>
                  <p className="text-orange-100">{base.description}</p>
                </div>
              ))}
            </div>
          </div>
        );

      case 2:
        return (
          <div className="space-y-6">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold text-white mb-4">Select Your Milk</h2>
              <p className="text-orange-100 text-lg">Choose your preferred milk base. This affects the creaminess, texture, and nutritional profile of your ice cream.</p>
            </div>
            <div className="grid gap-4">
              {milkProteinOptions.map((milk) => (
                <div
                  key={milk.id}
                  onClick={() => updateOrderData('milkProtein', milk.id)}
                  className={`p-6 rounded-xl border-2 cursor-pointer transition-all duration-200 hover:scale-105 ${
                    orderData.milkProtein === milk.id
                      ? 'border-yellow-400 bg-white bg-opacity-20 shadow-lg'
                      : 'border-white border-opacity-30 bg-white bg-opacity-10 hover:bg-opacity-20'
                  }`}
                >
                  <div className="flex justify-between items-start mb-3">
                    <h3 className="text-xl font-bold text-white">{milk.name}</h3>
                    <span className="text-yellow-300 font-bold text-lg">
                      {milk.price === 0 ? 'Included' : `+$${milk.price}`}
                    </span>
                  </div>
                  <p className="text-orange-100">{milk.description}</p>
                </div>
              ))}
            </div>
          </div>
        );

      case 3:
        return (
          <div className="space-y-6">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold text-white mb-4">Add Some Magic</h2>
              <p className="text-orange-100 text-lg">Select your favorite mix-ins to create a unique texture and flavor combination. Choose as many as you'd like - each one adds its own special touch!</p>
            </div>
            <div className="grid gap-3">
              {mixInOptions.map((mixIn) => (
                <div
                  key={mixIn.id}
                  onClick={() => {
                    const newMixIns = orderData.mixIns.includes(mixIn.id)
                      ? orderData.mixIns.filter(id => id !== mixIn.id)
                      : [...orderData.mixIns, mixIn.id];
                    updateOrderData('mixIns', newMixIns);
                  }}
                  className={`p-5 rounded-xl border-2 cursor-pointer transition-all duration-200 hover:scale-105 ${
                    orderData.mixIns.includes(mixIn.id)
                      ? 'border-yellow-400 bg-white bg-opacity-20 shadow-lg'
                      : 'border-white border-opacity-30 bg-white bg-opacity-10 hover:bg-opacity-20'
                  }`}
                >
                  <div className="flex justify-between items-center">
                    <div>
                      <h3 className="text-lg font-bold text-white mb-1">{mixIn.name}</h3>
                      <p className="text-orange-100 text-sm">{mixIn.description}</p>
                    </div>
                    <div className="text-right">
                      <span className="text-yellow-300 font-bold">+${mixIn.price}</span>
                      {orderData.mixIns.includes(mixIn.id) && (
                        <Check className="w-6 h-6 text-green-400 ml-2 inline" />
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
            {orderData.mixIns.length === 0 && (
              <div className="text-center text-orange-200 italic">
                No mix-ins selected - your ice cream will be perfectly smooth and creamy!
              </div>
            )}
          </div>
        );

      case 4:
        return (
          <div className="space-y-6">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold text-white mb-4">Sweetness Level</h2>
              <p className="text-orange-100 text-lg">How would you like to sweeten your creation? Each option brings its own unique flavor profile and natural sweetness.</p>
            </div>
            <div className="grid gap-4">
              {sweetenerOptions.map((sweetener) => (
                <div
                  key={sweetener.id}
                  onClick={() => updateOrderData('sweetener', sweetener.id)}
                  className={`p-6 rounded-xl border-2 cursor-pointer transition-all duration-200 hover:scale-105 ${
                    orderData.sweetener === sweetener.id
                      ? 'border-yellow-400 bg-white bg-opacity-20 shadow-lg'
                      : 'border-white border-opacity-30 bg-white bg-opacity-10 hover:bg-opacity-20'
                  }`}
                >
                  <div className="flex justify-between items-start mb-3">
                    <h3 className="text-xl font-bold text-white">{sweetener.name}</h3>
                    <span className="text-yellow-300 font-bold text-lg">
                      {sweetener.price === 0 ? 'Included' : `+$${sweetener.price}`}
                    </span>
                  </div>
                  <p className="text-orange-100">{sweetener.description}</p>
                </div>
              ))}
            </div>
          </div>
        );

      case 5:
        return (
          <div className="space-y-6">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold text-white mb-4">Extra Indulgence?</h2>
              <p className="text-orange-100 text-lg">Want to make it extra rich and creamy? We can add premium heavy cream and egg yolks for an ultra-luxurious texture.</p>
            </div>
            <div className="grid gap-4">
              <div
                onClick={() => updateOrderData('extraRich', false)}
                className={`p-6 rounded-xl border-2 cursor-pointer transition-all duration-200 hover:scale-105 ${
                  !orderData.extraRich
                    ? 'border-yellow-400 bg-white bg-opacity-20 shadow-lg'
                    : 'border-white border-opacity-30 bg-white bg-opacity-10 hover:bg-opacity-20'
                }`}
              >
                <h3 className="text-xl font-bold text-white mb-3">Standard Richness</h3>
                <p className="text-orange-100">Perfect balance of creaminess and lightness - our signature texture that lets all flavors shine through.</p>
                <span className="text-yellow-300 font-bold text-lg">Included</span>
              </div>
              <div
                onClick={() => updateOrderData('extraRich', true)}
                className={`p-6 rounded-xl border-2 cursor-pointer transition-all duration-200 hover:scale-105 ${
                  orderData.extraRich
                    ? 'border-yellow-400 bg-white bg-opacity-20 shadow-lg'
                    : 'border-white border-opacity-30 bg-white bg-opacity-10 hover:bg-opacity-20'
                }`}
              >
                <div className="flex justify-between items-start mb-3">
                  <h3 className="text-xl font-bold text-white">Extra Rich & Creamy</h3>
                  <span className="text-yellow-300 font-bold text-lg">+$1.50</span>
                </div>
                <p className="text-orange-100">Premium custard-style ice cream with added heavy cream and egg yolks for maximum indulgence and velvety smoothness.</p>
              </div>
            </div>
          </div>
        );

      case 6:
        return (
          <div className="space-y-6">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold text-white mb-4">Choose Your Style</h2>
              <p className="text-orange-100 text-lg">How would you like your ice cream served? Each consistency offers a unique eating experience.</p>
            </div>
            <div className="grid gap-6">
              {consistencyOptions.map((consistency) => (
                <div
                  key={consistency.id}
                  onClick={() => updateOrderData('consistency', consistency.id)}
                  className={`p-8 rounded-xl border-2 cursor-pointer transition-all duration-200 hover:scale-105 ${
                    orderData.consistency === consistency.id
                      ? 'border-yellow-400 bg-white bg-opacity-20 shadow-lg'
                      : 'border-white border-opacity-30 bg-white bg-opacity-10 hover:bg-opacity-20'
                  }`}
                >
                  <div className="text-center">
                    <div className="text-4xl mb-4">{consistency.image}</div>
                    <h3 className="text-2xl font-bold text-white mb-4">{consistency.name}</h3>
                    <p className="text-orange-100 text-lg">{consistency.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        );

      case 7:
        return (
          <div className="space-y-6">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold text-white mb-4">When Can We Prepare This?</h2>
              <p className="text-orange-100 text-lg">Choose your preferred pickup date. We'll have your custom ice cream ready and waiting!</p>
            </div>
            <div className="max-w-md mx-auto">
              <label className="block text-white font-medium mb-4 text-center">Pickup Date</label>
              <input
                type="date"
                value={orderData.pickupDate}
                onChange={(e) => updateOrderData('pickupDate', e.target.value)}
                min={new Date().toISOString().split('T')[0]}
                className="w-full px-4 py-4 rounded-xl border border-orange-200 focus:ring-2 focus:ring-orange-300 focus:border-transparent text-gray-800 text-lg text-center"
              />
              <div className="mt-6 text-center text-orange-100">
                <div className="flex items-center justify-center mb-2">
                  <Clock className="w-5 h-5 mr-2" />
                  <span>Pickup Hours: 10 AM - 8 PM</span>
                </div>
                <div className="flex items-center justify-center">
                  <MapPin className="w-5 h-5 mr-2" />
                  <span>123 Ice Cream Lane, Sweet City</span>
                </div>
              </div>
            </div>
          </div>
        );

      case 8:
        return (
          <div className="space-y-6">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold text-white mb-4">Order Summary</h2>
              <p className="text-orange-100 text-lg">Review your custom ice cream creation before confirming your order.</p>
            </div>
            
            <div className="bg-white bg-opacity-20 rounded-xl p-6 space-y-4">
              <div className="border-b border-white border-opacity-20 pb-4">
                <h3 className="text-white font-bold text-lg mb-2">Customer Information</h3>
                <p className="text-orange-100">{orderData.name}</p>
                <p className="text-orange-100">{orderData.email}</p>
                <p className="text-orange-100">{orderData.phone}</p>
              </div>

              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-white">
                    {baseOptions.find(b => b.id === orderData.base)?.name}
                  </span>
                  <span className="text-yellow-300 font-bold">
                    ${baseOptions.find(b => b.id === orderData.base)?.price}
                  </span>
                </div>

                <div className="flex justify-between items-center">
                  <span className="text-white">
                    {milkProteinOptions.find(m => m.id === orderData.milkProtein)?.name}
                  </span>
                  <span className="text-yellow-300 font-bold">
                    {milkProteinOptions.find(m => m.id === orderData.milkProtein)?.price === 0 
                      ? 'Included' 
                      : `+$${milkProteinOptions.find(m => m.id === orderData.milkProtein)?.price}`}
                  </span>
                </div>

                {orderData.mixIns.length > 0 && (
                  <>
                    <div className="text-white font-medium">Mix-Ins:</div>
                    {orderData.mixIns.map(mixInId => {
                      const mixIn = mixInOptions.find(m => m.id === mixInId);
                      return (
                        <div key={mixInId} className="flex justify-between items-center ml-4">
                          <span className="text-white">{mixIn?.name}</span>
                          <div className="flex items-center">
                            <span className="text-yellow-300 font-bold mr-2">+${mixIn?.price}</span>
                            <X 
                              className="w-4 h-4 text-red-400 cursor-pointer hover:text-red-300"
                              onClick={() => {
                                const newMixIns = orderData.mixIns.filter(id => id !== mixInId);
                                updateOrderData('mixIns', newMixIns);
                              }}
                            />
                          </div>
                        </div>
                      );
                    })}
                  </>
                )}

                <div className="flex justify-between items-center">
                  <span className="text-white">
                    {sweetenerOptions.find(s => s.id === orderData.sweetener)?.name}
                  </span>
                  <span className="text-yellow-300 font-bold">
                    {sweetenerOptions.find(s => s.id === orderData.sweetener)?.price === 0 
                      ? 'Included' 
                      : `+$${sweetenerOptions.find(s => s.id === orderData.sweetener)?.price}`}
                  </span>
                </div>

                {orderData.extraRich && (
                  <div className="flex justify-between items-center">
                    <span className="text-white">Extra Rich & Creamy</span>
                    <span className="text-yellow-300 font-bold">+$1.50</span>
                  </div>
                )}

                <div className="flex justify-between items-center">
                  <span className="text-white">
                    {consistencyOptions.find(c => c.id === orderData.consistency)?.name}
                  </span>
                  <span className="text-yellow-300 font-bold">Included</span>
                </div>

                <div className="border-t border-white border-opacity-20 pt-4">
                  <div className="flex justify-between items-center text-xl font-bold">
                    <span className="text-white">Total:</span>
                    <span className="text-yellow-300">${calculateTotal().toFixed(2)}</span>
                  </div>
                </div>

                <div className="border-t border-white border-opacity-20 pt-4">
                  <div className="text-white">
                    <strong>Pickup Date:</strong> {new Date(orderData.pickupDate).toLocaleDateString()}
                  </div>
                </div>
              </div>
            </div>

            <button className="w-full bg-gradient-to-r from-yellow-400 to-orange-500 text-white font-bold py-4 px-8 rounded-xl text-xl hover:shadow-lg transition-all duration-200 transform hover:scale-105">
              Confirm Order - ${calculateTotal().toFixed(2)}
            </button>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-400 via-orange-500 to-red-500 p-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="bg-white bg-opacity-20 rounded-full p-4 w-20 h-20 mx-auto mb-4 flex items-center justify-center">
            <div className="text-2xl font-bold text-white">BYOI</div>
          </div>
          <h1 className="text-4xl font-bold text-white mb-2">Build Your Own Ice Cream</h1>
          <p className="text-orange-100">Create your perfect frozen treat</p>
        </div>

        {/* Progress Bar */}
        <div className="bg-white bg-opacity-20 rounded-full p-2 mb-8">
          <div className="flex justify-between items-center">
            {steps.map((step, index) => (
              <div
                key={index}
                className={`flex items-center ${index < steps.length - 1 ? 'flex-1' : ''}`}
              >
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${
                    index <= currentStep
                      ? 'bg-yellow-400 text-gray-800'
                      : 'bg-white bg-opacity-20 text-white'
                  }`}
                >
                  {index < currentStep ? <Check className="w-4 h-4" /> : index + 1}
                </div>
                {index < steps.length - 1 && (
                  <div
                    className={`flex-1 h-2 mx-2 rounded-full ${
                      index < currentStep ? 'bg-yellow-400' : 'bg-white bg-opacity-20'
                    }`}
                  />
                )}
              </div>
            ))}
          </div>
          <div className="mt-2 text-center text-white text-sm">
            Step {currentStep + 1} of {steps.length}: {steps[currentStep]}
          </div>
        </div>

        {/* Current Price Display */}
        <div className="text-center mb-6">
          <div className="bg-white bg-opacity-20 rounded-xl p-4 inline-block">
            <span className="text-white text-lg">Current Total: </span>
            <span className="text-yellow-300 font-bold text-2xl">${calculateTotal().toFixed(2)}</span>
          </div>
        </div>

        {/* Main Content */}
        <div className="bg-white bg-opacity-10 rounded-2xl p-8 mb-6 backdrop-blur-sm">
          {renderStep()}
        </div>

        {/* Navigation */}
        <div className="flex justify-between items-center">
          <button
            onClick={prevStep}
            disabled={currentStep === 0}
            className={`flex items-center px-6 py-3 rounded-xl font-medium transition-all duration-200 ${
              currentStep === 0
                ? 'bg-gray-400 text-gray-600 cursor-not-allowed'
                : 'bg-white bg-opacity-20 text-white hover:bg-opacity-30'
            }`}
          >
            <ChevronLeft className="w-5 h-5 mr-2" />
            Previous
          </button>

          <button
            onClick={nextStep}
            disabled={!canProceed() || currentStep === steps.length - 1}
            className={`flex items-center px-6 py-3 rounded-xl font-medium transition-all duration-200 ${
              !canProceed() || currentStep === steps.length - 1
                ? 'bg-gray-400 text-gray-600 cursor-not-allowed'
                : 'bg-yellow-400 text-gray-800 hover:bg-yellow-300'
            }`}
          >
            Next
            <ChevronRight className="w-5 h-5 ml-2" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default BYOIOrderForm;