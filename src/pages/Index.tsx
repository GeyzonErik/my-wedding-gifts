import React, { useState, useEffect } from 'react';

interface Present {
  nome: string;
  image: string;
  value: number;
  qrCode: string;
  pixKey: string;
  description?: string;
  message?: string;
  disable?: boolean;
}

type SortOrder = 'asc' | 'desc';

const Index = () => {
  const [presents, setPresents] = useState<Present[]>([]);
  const [selectedPresent, setSelectedPresent] = useState<Present | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isConfirmationModalOpen, setIsConfirmationModalOpen] = useState(false);
  const [copySuccess, setCopySuccess] = useState(false);
  const [sortOrder, setSortOrder] = useState<SortOrder>('asc');
  const [isPixKeyExpanded, setIsPixKeyExpanded] = useState(false);
  const [confirmationMessage, setConfirmationMessage] = useState('');

  useEffect(() => {
    fetch('/presentes.json')
      .then(response => response.json())
      .then(data => setPresents(data))
      .catch(error => console.error('Erro ao carregar presentes:', error));
  }, []);

  const openModal = (present: Present) => {
    setSelectedPresent(present);
    setIsModalOpen(true);
    setIsPixKeyExpanded(false);
    document.body.style.overflow = 'hidden';
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedPresent(null);
    setCopySuccess(false);
    setIsPixKeyExpanded(false);
    document.body.style.overflow = 'unset';
  };

  const openConfirmationModal = () => {
    if (selectedPresent) {
      setConfirmationMessage(`É uma honra fazer parte deste momento único! Este presente é um pequeno gesto do meu carinho por vocês. Que Deus abençoe esta união com muito amor e cumplicidade!`);
      setIsConfirmationModalOpen(true);
      closeModal();
    }
  };

  const closeConfirmationModal = () => {
    setIsConfirmationModalOpen(false);
    setConfirmationMessage('');
    document.body.style.overflow = 'unset';
  };

  const copyPixKey = async () => {
    if (selectedPresent?.pixKey) {
      try {
        await navigator.clipboard.writeText(selectedPresent.pixKey);
        setCopySuccess(true);
        setTimeout(() => setCopySuccess(false), 2000);
      } catch (error) {
        console.error('Erro ao copiar chave PIX:', error);
      }
    }
  };

  const sendWhatsAppMessage = () => {
    // Remove emojis da mensagem
    const cleanMessage = confirmationMessage.replace(/[\u{1F600}-\u{1F64F}]|[\u{1F300}-\u{1F5FF}]|[\u{1F680}-\u{1F6FF}]|[\u{1F1E0}-\u{1F1FF}]|[\u{2600}-\u{26FF}]|[\u{2700}-\u{27BF}]/gu, '');
    const encodedMessage = encodeURIComponent(cleanMessage);
    const whatsappUrl = `https://wa.me/5581994468804?text=${encodedMessage}`;
    window.open(whatsappUrl, '_blank');
    closeConfirmationModal();
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value);
  };

  const toggleSortOrder = () => {
    setSortOrder(prev => prev === 'asc' ? 'desc' : 'asc');
  };

  const sortedPresents = [...presents]
    .filter(present => !present.disable)
    .sort((a, b) => {
      return sortOrder === 'asc' ? a.value - b.value : b.value - a.value;
    });

  return (
    <div className="min-h-screen bg-gradient-to-br from-serenity-soft to-white">
      {/* Header com mensagem de boas-vindas */}
      <header className="text-center py-16 px-6 fade-in">
        <div className="max-w-3xl mx-auto">
          <h1 className="font-display text-4xl md:text-5xl font-medium text-serenity-text mb-6 leading-tight">
            Celebre Nosso Amor ❤️
          </h1>
          <p className="text-lg md:text-xl text-serenity-text-light leading-relaxed mb-8">
            Estamos muito felizes em celebrar esse momento com você! Aqui, você pode nos presentear 
            de forma simples e direta. Basta escolher um presente, escanear o QR Code e pronto: 
            sua contribuição fará parte da nossa nova vida juntos.
          </p>
          <div className="w-20 h-1 bg-gradient-to-r from-serenity-blue to-serenity-light mx-auto rounded-full"></div>
        </div>
      </header>

      {/* Lista de presentes */}
      <main className="max-w-6xl mx-auto px-6 pb-16">
        {/* Filtro de preço */}
        <div className="mb-8 flex justify-end">
          <button
            onClick={toggleSortOrder}
            className="wedding-button flex items-center gap-2"
          >
            {sortOrder === 'asc' ? '↑ Menor preço' : '↓ Maior preço'}
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {sortedPresents.map((present, index) => (
            <div
              key={index}
              className="wedding-card fade-in hover-lift"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <div className="aspect-video rounded-xl overflow-hidden mb-4 bg-serenity-accent">
                <img
                  src={present.image}
                  alt={present.nome}
                  className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
                  loading="lazy"
                />
              </div>
              
              <h3 className="font-display text-xl font-medium text-serenity-text mb-2">
                {present.nome}
              </h3>
              
              <p className="text-2xl font-semibold text-serenity-blue mb-3">
                {formatCurrency(present.value)}
              </p>
              
              {present.description && (
                <p className="text-serenity-text-light text-sm mb-4 leading-relaxed">
                  {present.description}
                </p>
              )}
              
              <button
                onClick={() => openModal(present)}
                className="wedding-button w-full"
              >
                💝 Presentear
              </button>
            </div>
          ))}
        </div>
      </main>

      {/* Modal */}
      {isModalOpen && selectedPresent && (
        <div className="wedding-modal" onClick={closeModal}>
          <div className="wedding-modal-content" onClick={(e) => e.stopPropagation()}>
            <button
              onClick={closeModal}
              className="close-button"
              aria-label="Fechar modal"
            >
              ✕
            </button>
            
            <div className="text-center">
              <h2 className="font-display text-2xl font-medium text-serenity-text mb-2">
                {selectedPresent.nome}
              </h2>
              
              <p className="text-2xl font-semibold text-serenity-blue mb-6">
                {formatCurrency(selectedPresent.value)}
              </p>
              
              <div className="bg-serenity-accent rounded-2xl p-6 mb-6">
                <img
                  src={selectedPresent.qrCode}
                  alt="QR Code para pagamento"
                  className="w-48 h-48 mx-auto mb-4 rounded-xl"
                />
                
                <div className="bg-white rounded-lg p-4 mb-4">
                  <p className="text-sm text-serenity-text-light mb-2">Chave PIX:</p>
                  <div className="relative">
                    <p 
                      className={`font-mono text-serenity-text break-all mb-3 transition-all duration-300 ${
                        isPixKeyExpanded ? 'max-h-none' : 'max-h-12 overflow-hidden'
                      }`}
                    >
                      {selectedPresent.pixKey}
                    </p>
                    {selectedPresent.pixKey.length > 50 && (
                      <button
                        onClick={() => setIsPixKeyExpanded(!isPixKeyExpanded)}
                        className="text-sm text-serenity-blue hover:text-serenity-blue/80 transition-colors"
                      >
                        {isPixKeyExpanded ? 'Ver menos' : 'Ver mais'}
                      </button>
                    )}
                  </div>
                  
                  <button
                    onClick={copyPixKey}
                    className={`copy-button w-full ${copySuccess ? 'bg-green-100 text-green-700' : ''}`}
                  >
                    {copySuccess ? '✓ Copiado!' : '📋 Copiar chave'}
                  </button>
                </div>
              </div>
              
              {/* Botão de confirmação de pagamento */}
              <div className="space-y-3">
                <button
                  onClick={openConfirmationModal}
                  className="wedding-button w-full bg-green-600 hover:bg-green-700"
                >
                  📱 Confirmar Pagamento via WhatsApp
                </button>
                
                <p className="text-xs text-serenity-text-light">
                  Clique aqui após fazer o pagamento para nos avisar!
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

             {/* Confirmação de pagamento */}
       {isConfirmationModalOpen && (
         <div className="wedding-modal" onClick={closeConfirmationModal}>
           <div className="wedding-modal-content" onClick={(e) => e.stopPropagation()}>
             <button
               onClick={closeConfirmationModal}
               className="close-button"
               aria-label="Fechar modal"
             >
               ✕
             </button>
             
             <div className="text-center">
               <div className="text-6xl mb-4">💝</div>
               <h2 className="font-display text-2xl font-medium text-serenity-text mb-2">
                 Confirmar Pagamento
               </h2>
               
               <p className="text-serenity-text-light mb-4">
                 Personalize sua mensagem antes de enviar:
               </p>
               
               <textarea
                 value={confirmationMessage}
                 onChange={(e) => setConfirmationMessage(e.target.value)}
                 className="confirmation-textarea mb-4"
                 rows={4}
                 placeholder="Digite sua mensagem aqui..."
               ></textarea>
               
               <div className="space-y-3">
                 <button
                   onClick={sendWhatsAppMessage}
                   className="wedding-button w-full bg-green-600 hover:bg-green-700"
                 >
                   📱 Enviar via WhatsApp
                 </button>
                 
                 <button
                   onClick={closeConfirmationModal}
                   className="wedding-button w-full bg-gray-500 hover:bg-gray-600"
                 >
                   Cancelar
                 </button>
               </div>
             </div>
           </div>
         </div>
       )}
    </div>
  );
};

export default Index;
