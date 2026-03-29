'use client';

import { useState } from 'react';
import { Mail, Phone, MapPin, Send, Clock, CheckCircle } from 'lucide-react';

export default function ContactoPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    company: '',
    subject: '',
    message: '',
    productInterest: '',
  });
  const [submitted, setSubmitted] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Simular envío
    console.log('Form submitted:', formData);
    setSubmitted(true);
    setTimeout(() => setSubmitted(false), 5000);
    setFormData({
      name: '',
      email: '',
      phone: '',
      company: '',
      subject: '',
      message: '',
      productInterest: '',
    });
  };

  return (
    <div className="min-h-screen bg-black">
      {/* Header */}
      <div className="border-b border-gray-900 bg-gradient-to-b from-gray-900/50 to-black">
        <div className="max-w-7xl mx-auto px-6 py-12 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl font-bold text-white">Contacto</h1>
            <p className="text-gray-400 mt-4 max-w-2xl mx-auto">
              ¿Necesitas asesoramiento técnico, una cotización personalizada o soporte post-venta? Estamos aquí para ayudarte.
            </p>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-12 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* Información de contacto */}
          <div className="lg:col-span-1">
            <div className="space-y-8">
              <div className="border border-gray-800 rounded-2xl p-6 bg-gradient-to-b from-gray-900/50 to-transparent">
                <h2 className="text-xl font-semibold text-white mb-6">Información de contacto</h2>
                <div className="space-y-6">
                  <div className="flex items-start gap-4">
                    <div className="h-12 w-12 rounded-full bg-gradient-to-r from-blue-600 to-blue-800 flex items-center justify-center flex-shrink-0">
                      <Phone className="h-6 w-6 text-white" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-white">Teléfono</h3>
                      <p className="text-gray-400">011 4373-0621</p>
                      <p className="text-sm text-gray-500">Lunes a Viernes 9-18hs</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-4">
                    <div className="h-12 w-12 rounded-full bg-gradient-to-r from-purple-600 to-purple-800 flex items-center justify-center flex-shrink-0">
                      <Mail className="h-6 w-6 text-white" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-white">Email</h3>
                      <p className="text-gray-400">ventas@dmxpro.com.ar</p>
                      <p className="text-gray-400">facturasvenetian@gmail.com</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-4">
                    <div className="h-12 w-12 rounded-full bg-gradient-to-r from-green-600 to-green-800 flex items-center justify-center flex-shrink-0">
                      <MapPin className="h-6 w-6 text-white" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-white">Dirección</h3>
                      <p className="text-gray-400">Paraná 266, CABA</p>
                      <p className="text-gray-400">Buenos Aires, Argentina</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-4">
                    <div className="h-12 w-12 rounded-full bg-gradient-to-r from-orange-600 to-orange-800 flex items-center justify-center flex-shrink-0">
                      <Clock className="h-6 w-6 text-white" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-white">Horarios de atención</h3>
                      <p className="text-gray-400">Lunes a Viernes: 9:00 - 18:00</p>
                      <p className="text-gray-400">Sábados: 10:00 - 13:00</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Soporte técnico */}
              <div className="border border-gray-800 rounded-2xl p-6 bg-gradient-to-b from-gray-900/50 to-transparent">
                <h2 className="text-xl font-semibold text-white mb-4">Soporte Técnico</h2>
                <p className="text-gray-400 mb-4">
                  Para consultas técnicas, reparaciones o garantías, contacta a nuestro equipo especializado.
                </p>
                <button className="w-full rounded-lg border border-gray-800 py-3 text-white hover:bg-gray-900 font-medium">
                  Abrir ticket de soporte
                </button>
              </div>
            </div>
          </div>

          {/* Formulario */}
          <div className="lg:col-span-2">
            <div className="border border-gray-800 rounded-2xl p-8 bg-gradient-to-b from-gray-900/50 to-transparent">
              <h2 className="text-2xl font-bold text-white mb-2">Envíanos tu consulta</h2>
              <p className="text-gray-400 mb-8">
                Completa el formulario y te responderemos en menos de 24 horas hábiles.
              </p>

              {submitted && (
                <div className="mb-8 rounded-lg bg-gradient-to-r from-green-900/30 to-green-900/10 border border-green-800 p-4 flex items-center gap-3">
                  <CheckCircle className="h-5 w-5 text-green-400" />
                  <div>
                    <p className="font-semibold text-white">¡Mensaje enviado!</p>
                    <p className="text-green-300 text-sm">
                      Nos pondremos en contacto contigo a la brevedad.
                    </p>
                  </div>
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label htmlFor="name" className="block text-sm font-medium text-gray-300 mb-2">
                      Nombre completo *
                    </label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      required
                      value={formData.name}
                      onChange={handleChange}
                      className="w-full px-4 py-3 rounded-lg border border-gray-800 bg-gray-900 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="Juan Pérez"
                    />
                  </div>
                  <div>
                    <label htmlFor="email" className="block text-sm font-medium text-gray-300 mb-2">
                      Email *
                    </label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      required
                      value={formData.email}
                      onChange={handleChange}
                      className="w-full px-4 py-3 rounded-lg border border-gray-800 bg-gray-900 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="juan@empresa.com"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label htmlFor="phone" className="block text-sm font-medium text-gray-300 mb-2">
                      Teléfono *
                    </label>
                    <input
                      type="tel"
                      id="phone"
                      name="phone"
                      required
                      value={formData.phone}
                      onChange={handleChange}
                      className="w-full px-4 py-3 rounded-lg border border-gray-800 bg-gray-900 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="11 1234-5678"
                    />
                  </div>
                  <div>
                    <label htmlFor="company" className="block text-sm font-medium text-gray-300 mb-2">
                      Empresa (opcional)
                    </label>
                    <input
                      type="text"
                      id="company"
                      name="company"
                      value={formData.company}
                      onChange={handleChange}
                      className="w-full px-4 py-3 rounded-lg border border-gray-800 bg-gray-900 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="Nombre de tu empresa"
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="subject" className="block text-sm font-medium text-gray-300 mb-2">
                    Asunto *
                  </label>
                  <select
                    id="subject"
                    name="subject"
                    required
                    value={formData.subject}
                    onChange={handleChange}
                    className="w-full px-4 py-3 rounded-lg border border-gray-800 bg-gray-900 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">Selecciona un asunto</option>
                    <option value="cotizacion">Cotización de producto</option>
                    <option value="soporte">Soporte técnico</option>
                    <option value="garantia">Consulta sobre garantía</option>
                    <option value="distribuidor">Ser distribuidor</option>
                    <option value="otro">Otro</option>
                  </select>
                </div>

                <div>
                  <label htmlFor="productInterest" className="block text-sm font-medium text-gray-300 mb-2">
                    Producto de interés (opcional)
                  </label>
                  <input
                    type="text"
                    id="productInterest"
                    name="productInterest"
                    value={formData.productInterest}
                    onChange={handleChange}
                    className="w-full px-4 py-3 rounded-lg border border-gray-800 bg-gray-900 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Ej: Mixer X32, Parlante JBL..."
                  />
                </div>

                <div>
                  <label htmlFor="message" className="block text-sm font-medium text-gray-300 mb-2">
                    Mensaje *
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    rows={5}
                    required
                    value={formData.message}
                    onChange={handleChange}
                    className="w-full px-4 py-3 rounded-lg border border-gray-800 bg-gray-900 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Describe tu consulta en detalle..."
                  />
                </div>

                <div className="flex items-center gap-4">
                  <button
                    type="submit"
                    className="rounded-lg bg-gradient-to-r from-blue-600 to-purple-600 px-8 py-4 text-lg font-semibold text-white hover:opacity-90 flex items-center gap-2"
                  >
                    <Send className="h-5 w-5" />
                    Enviar mensaje
                  </button>
                  <p className="text-sm text-gray-400">
                    Los campos marcados con * son obligatorios.
                  </p>
                </div>
              </form>
            </div>

            {/* Mapa */}
            <div className="mt-12 border border-gray-800 rounded-2xl overflow-hidden">
              <div className="aspect-[21/9] bg-gradient-to-br from-gray-900 to-black flex items-center justify-center">
                <div className="text-center">
                  <MapPin className="h-12 w-12 text-gray-700 mx-auto mb-4" />
                  <p className="text-gray-500">Mapa interactivo de ubicación</p>
                  <p className="text-sm text-gray-600 mt-2">Paraná 266, CABA, Buenos Aires</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}