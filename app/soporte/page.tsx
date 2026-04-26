'use client';

import { useState } from 'react';
import Link from 'next/link';
import { ChevronDown, Phone, Mail, MessageSquare } from 'lucide-react';


const FAQ_ITEMS = [
  {
    question: '¿Cuál es el horario de atención para soporte técnico?',
    answer: 'Nuestro equipo de soporte está disponible de Lunes a Viernes de 9:00 a 18:00 hs (hora de Argentina).'
  },
  {
    question: '¿Qué información necesito tener a mano al contactar soporte?',
    answer: 'Para agilizar tu consulta, te recomendamos tener a mano el modelo y número de serie de tu producto, así como una descripción detallada del problema.'
  },
  {
    question: '¿Ofrecen servicio técnico a domicilio?',
    answer: 'Actualmente, nuestro servicio técnico se realiza en nuestro centro de operaciones. Consulta por opciones de envío en caso de ser necesario.'
  },
  {
    question: '¿Cómo puedo verificar el estado de una reparación?',
    answer: 'Puedes consultar el estado de tu reparación contactándonos directamente a través de los canales de comunicación detallados en esta página.'
  },
];

interface AccordionItemProps {
  question: string;
  answer: string;
  isOpen: boolean;
  onToggle: () => void;
}

const AccordionItem: React.FC<AccordionItemProps> = ({ question, answer, isOpen, onToggle }) => {
  return (
    <div className="border border-gray-700 rounded-lg mb-4">
      <button
        className="flex justify-between items-center w-full p-5 text-lg font-medium text-left text-white bg-gray-800 hover:bg-gray-700 focus:outline-none focus-visible:ring focus-visible:ring-blue-500 focus-visible:ring-opacity-75 rounded-lg"
        onClick={onToggle}
      >
        <span>{question}</span>
        <ChevronDown
          className={`h-5 w-5 transform transition-transform duration-200 ${
            isOpen ? 'rotate-180' : ''
          }`}
        />
      </button>
      {isOpen && (
        <div className="p-5 bg-gray-900 text-gray-300 rounded-b-lg">
          <p>{answer}</p>
        </div>
      )}
    </div>
  );
};


export default function SoportePage() {
  const [openFAQ, setOpenFAQ] = useState<number | null>(null);

  const toggleFAQ = (index: number) => {
    setOpenFAQ(openFAQ === index ? null : index);
  };

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Hero-like section for the title */}
      <section className="relative h-64 flex items-center justify-center text-center px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-gray-900 to-black overflow-hidden">
        <div className="absolute inset-0 z-0 opacity-20">
          {/* Subtle background pattern or image */}
          <div className="absolute inset-0 bg-[url('/grid.svg')] bg-center [mask-image:linear-gradient(180deg,white,rgba(255,255,255,0))]"></div>
        </div>
        <div className="relative z-10">
          <h1 className="text-4xl font-bold tracking-tight sm:text-5xl lg:text-6xl text-white">
            Soporte Técnico
          </h1>
          <p className="mt-4 text-lg text-gray-300">
            Encuentra respuestas a tus preguntas y contáctanos para asistencia especializada.
          </p>
        </div>
      </section>

      <main className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        {/* Sección de Preguntas Frecuentes (FAQ) */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold text-white mb-6 border-b border-gray-700 pb-3">
            Preguntas Frecuentes (FAQ)
          </h2>
          <div className="max-w-3xl mx-auto">
            {FAQ_ITEMS.map((item, index) => (
              <AccordionItem
                key={index}
                question={item.question}
                answer={item.answer}
                isOpen={openFAQ === index}
                onToggle={() => toggleFAQ(index)}
              />
            ))}
          </div>
        </section>

        {/* Información de Garantía */}
        <section className="mb-16 text-center bg-gray-900/50 border border-gray-800 rounded-lg p-8">
          <h2 className="text-3xl font-bold text-white mb-4">Información de Garantía</h2>
          <p className="text-gray-300 text-lg mb-4">
            Todos nuestros productos cuentan con una garantía oficial de <span className="font-semibold text-blue-400">6 meses</span> directamente con el fabricante, cubriendo defectos de fábrica.
          </p>
          <p className="text-gray-400">
            Para hacer efectiva la garantía, por favor contáctanos con los detalles de tu compra y el problema que presentas.
          </p>
        </section>

        {/* Formas de Contacto */}
        <section className="text-center">
          <h2 className="text-3xl font-bold text-white mb-6 border-b border-gray-700 pb-3">
            Contáctanos
          </h2>
          <p className="text-gray-300 mb-8 max-w-2xl mx-auto">
            Nuestro equipo de soporte está listo para ayudarte. Elige la opción que mejor se adapte a tu necesidad.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
            <div className="bg-gray-900/50 border border-gray-800 rounded-lg p-6 flex flex-col items-center justify-center">
              <Phone className="h-10 w-10 text-blue-500 mb-4" />
              <h3 className="text-xl font-semibold text-white mb-2">Teléfono</h3>
              <p className="text-gray-300 text-lg">+54 9 11 7640-2148</p>
              <a href="tel:+541143730621" className="mt-3 text-blue-400 hover:underline">Llámanos ahora</a>
            </div>
            <div className="bg-gray-900/50 border border-gray-800 rounded-lg p-6 flex flex-col items-center justify-center">
              <Mail className="h-10 w-10 text-purple-500 mb-4" />
              <h3 className="text-xl font-semibold text-white mb-2">Email</h3>
              <p className="text-gray-300 text-lg">venetianarg@gmail.com</p>
              <a href="mailto:venetianarg@gmail.com" className="mt-3 text-purple-400 hover:underline">Envíanos un email</a>
            </div>
            <div className="bg-gray-900/50 border border-gray-800 rounded-lg p-6 flex flex-col items-center justify-center">
              <MessageSquare className="h-10 w-10 text-green-500 mb-4" />
              <h3 className="text-xl font-semibold text-white mb-2">WhatsApp</h3>
              <p className="text-gray-300 text-lg">Envíanos un mensaje</p>
              <a href="https://wa.me/54911xxxxxxx" target="_blank" rel="noopener noreferrer" className="mt-3 text-green-400 hover:underline">Iniciar Chat</a>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}