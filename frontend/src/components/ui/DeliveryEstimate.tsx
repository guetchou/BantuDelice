import React from 'react';
import type { DeliveryEstimate } from '@/services/deliveryService';

interface DeliveryEstimateProps {
  estimate: DeliveryEstimate;
  cartTotal: number;
  className?: string;
}

export default function DeliveryEstimate({ estimate, cartTotal, className = '' }: DeliveryEstimateProps) {
  const formatPrice = (cents: number) => {
    return (cents / 100).toFixed(2) + 'FCFA';
  };

  const formatTime = (minutes: number) => {
    if (minutes < 60) {
      return `${minutes} min`;
    }
    const hours = Math.floor(minutes / 60);
    const remainingMinutes = minutes % 60;
    return `${hours}h${remainingMinutes > 0 ? remainingMinutes : ''}`;
  };

  const isFreeDelivery = estimate.deliveryFee === 0;
  const savings = cartTotal >= 2500 ? estimate.deliveryFee : 0;

  return (
    <div className={`bg-white border border-gray-200 rounded-lg p-4 ${className}`}>
      <h3 className="text-lg font-semibold text-gray-900 mb-3">
        Estimation de livraison
      </h3>
      
      <div className="space-y-3">
        {/* Distance */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
            </svg>
            <span className="text-gray-700">Distance</span>
          </div>
          <span className="font-medium">{estimate.distance} km</span>
        </div>

        {/* Temps de livraison */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span className="text-gray-700">Temps estimé</span>
          </div>
          <span className="font-medium">{formatTime(estimate.duration)}</span>
        </div>

        {/* Frais de livraison */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <svg className="w-5 h-5 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
            <span className="text-gray-700">Frais de livraison</span>
          </div>
          <div className="flex items-center space-x-2">
            {isFreeDelivery ? (
              <span className="text-green-600 font-medium">Gratuit</span>
            ) : (
              <span className="font-medium">{formatPrice(estimate.deliveryFee)}</span>
            )}
          </div>
        </div>

        {/* Économies si livraison gratuite */}
        {isFreeDelivery && savings > 0 && (
          <div className="bg-green-50 border border-green-200 rounded-lg p-3">
            <div className="flex items-center space-x-2">
              <svg className="w-5 h-5 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              <span className="text-green-800 font-medium">
                Vous économisez {formatPrice(savings)} sur la livraison !
              </span>
            </div>
          </div>
        )}

        {/* Seuil pour livraison gratuite */}
        {!isFreeDelivery && cartTotal < 2500 && (
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
            <div className="flex items-center space-x-2">
              <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <div>
                <p className="text-blue-800 text-sm font-medium">
                  Livraison gratuite à partir de 25FCFA
                </p>
                <p className="text-blue-700 text-xs">
                  Plus que {formatPrice(2500 - cartTotal)} pour la livraison gratuite
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
} 