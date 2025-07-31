import React from "react";

interface ColisLabelProps {
  sender: string;
  recipient: string;
  trackingNumber: string;
}

const ColisLabel: React.FC<ColisLabelProps> = ({ sender, recipient, trackingNumber }) => {
  return (
    <div className="border-2 border-dashed border-gray-400 rounded-lg p-6 bg-white w-96 mx-auto my-4 shadow-lg">
      <div className="text-xs text-gray-500 mb-2">Étiquette Colis</div>
      <div className="font-bold text-lg mb-2">N° {trackingNumber}</div>
      <div className="mb-2">
        <span className="font-semibold">Expéditeur :</span> {sender}
      </div>
      <div className="mb-4">
        <span className="font-semibold">Destinataire :</span> {recipient}
      </div>
      <div className="flex justify-center mb-2">
        {/* Simule un code-barres */}
        <div className="bg-gray-800 h-8 w-48 rounded flex items-center justify-center text-white font-mono tracking-widest text-lg">
          {trackingNumber}
        </div>
      </div>
      <button
        className="mt-2 px-4 py-2 bg-orange-500 text-white rounded hover:bg-orange-600"
        onClick={() => window.print()}
      >
        Imprimer l'étiquette
      </button>
    </div>
  );
};

export default ColisLabel; 