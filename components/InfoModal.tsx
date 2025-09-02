import React from 'react';

interface InfoModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const InfoModal: React.FC<InfoModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div 
      className="fixed inset-0 bg-black bg-opacity-60 z-50 flex justify-center items-center p-4 transition-opacity duration-300"
      onClick={onClose}
      aria-modal="true"
      role="dialog"
    >
      <div 
        className="bg-amber-50 rounded-2xl shadow-2xl p-6 md:p-8 max-w-2xl w-full text-amber-900 border-4 border-amber-200 relative transform transition-transform duration-300 scale-95 animate-modal-enter max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()} // Prevent closing when clicking inside modal
      >
        <button 
          onClick={onClose} 
          className="absolute top-4 right-4 text-3xl font-bold text-amber-700 hover:text-amber-900 transition-colors"
          aria-label="Fechar"
        >
          &times;
        </button>
        
        <h2 className="font-patrick-hand text-4xl md:text-5xl font-bold text-center mb-6">Como Jogar Soroban</h2>
        
        <div className="space-y-4 text-base md:text-lg">
          <p>O Soroban (ábaco japonês) é uma ferramenta para fazer cálculos. Ele é dividido em colunas, cada uma representando uma casa decimal (unidades, dezenas, centenas...).</p>
          
          <h3 className="text-xl md:text-2xl font-bold mt-4">As Contas (Bolas)</h3>
          <ul className="list-disc list-inside space-y-2 pl-4">
            <li>Cada coluna tem uma <strong>conta superior</strong> e quatro <strong>contas inferiores</strong>.</li>
            <li>A barra no meio é a <strong>barra de contagem</strong>. As contas só têm valor quando são movidas <strong>em direção a esta barra</strong>.</li>
            <li>A conta superior vale <strong>5</strong>.</li>
            <li>Cada conta inferior vale <strong>1</strong>.</li>
          </ul>

          <h3 className="text-xl md:text-2xl font-bold mt-4">Representando Números</h3>
          <p>Para formar um número em uma coluna, mova as contas:</p>
          <ul className="list-disc list-inside space-y-2 pl-4">
            <li><strong>Número 3:</strong> Mova 3 contas inferiores para cima, em direção à barra.</li>
            <li><strong>Número 7:</strong> Mova a conta superior para baixo (valor 5) e 2 contas inferiores para cima (valor 2). Total: 5 + 2 = 7.</li>
            <li><strong>Número 9:</strong> Mova a conta superior para baixo (5) e todas as 4 contas inferiores para cima (4). Total: 5 + 4 = 9.</li>
             <li><strong>Número 0:</strong> Nenhuma conta toca a barra de contagem.</li>
          </ul>

          <h3 className="text-xl md:text-2xl font-bold mt-4">O Desafio</h3>
          <p>
            O jogo apresentará um número. Seu objetivo é mover as contas no Soroban para representar exatamente esse número. Quando conseguir, você será parabenizado e poderá tentar um novo desafio!
          </p>
        </div>
        
        <div className="text-center mt-8">
            <button 
                onClick={onClose}
                className="px-8 py-3 bg-amber-600 text-white font-bold text-xl rounded-lg shadow-md hover:bg-amber-700 active:bg-amber-800 transition-all transform hover:scale-105"
            >
                Entendi!
            </button>
        </div>
      </div>
      <style>{`
        @keyframes modal-enter {
          from { opacity: 0; transform: scale(0.9); }
          to { opacity: 1; transform: scale(1); }
        }
        .animate-modal-enter {
          animation: modal-enter 0.3s ease-out forwards;
        }
      `}</style>
    </div>
  );
};

export default InfoModal;
