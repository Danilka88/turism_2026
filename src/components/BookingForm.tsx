import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Calendar, Users, Phone, Mail, User, Check, Loader2 } from 'lucide-react';

interface BookingFormProps {
  isOpen: boolean;
  onClose: () => void;
  locationTitle?: string;
}

export function BookingForm({ isOpen, onClose, locationTitle = 'маршрут' }: BookingFormProps) {
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    date: '',
    guests: '2',
    comment: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Simulate API call
    setTimeout(() => {
      setIsSubmitting(false);
      setIsSubmitted(true);
    }, 1500);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const resetAndClose = () => {
    setFormData({
      name: '',
      phone: '',
      email: '',
      date: '',
      guests: '2',
      comment: '',
    });
    setIsSubmitted(false);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[100] bg-black/80 p-4 flex items-center justify-center backdrop-blur-2xl"
          onClick={resetAndClose}
        >
          <motion.div
            initial={{ scale: 0.9, y: 20 }}
            animate={{ scale: 1, y: 0 }}
            exit={{ scale: 0.9, y: 20 }}
            className="w-full max-w-md rounded-3xl bg-gradient-to-br from-purple-900/95 to-indigo-900/95 p-6 border border-white/20 shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            {!isSubmitted ? (
              <>
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <h2 className="text-2xl font-black text-white">Бронирование</h2>
                    <p className="text-white/60 text-sm mt-1">Бронируем: {locationTitle}</p>
                  </div>
                  <button 
                    onClick={resetAndClose}
                    className="p-2 bg-white/20 rounded-full hover:bg-white/30 transition-colors"
                  >
                    <X className="w-5 h-5 text-white" />
                  </button>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                  {/* Name */}
                  <div>
                    <label className="flex items-center gap-2 text-sm font-bold text-white/80 mb-2">
                      <User className="w-4 h-4" />
                      Ваше имя *
                    </label>
                    <input
                      type="text"
                      name="name"
                      required
                      value={formData.name}
                      onChange={handleChange}
                      className="w-full p-3 bg-white/15 border border-white/30 rounded-xl text-white placeholder-white/40 focus:outline-none focus:border-purple-400 transition-colors"
                      placeholder="Как вас зовут?"
                    />
                  </div>

                  {/* Phone */}
                  <div>
                    <label className="flex items-center gap-2 text-sm font-bold text-white/80 mb-2">
                      <Phone className="w-4 h-4" />
                      Телефон *
                    </label>
                    <input
                      type="tel"
                      name="phone"
                      required
                      value={formData.phone}
                      onChange={handleChange}
                      className="w-full p-3 bg-white/15 border border-white/30 rounded-xl text-white placeholder-white/40 focus:outline-none focus:border-purple-400 transition-colors"
                      placeholder="+7 (___) ___-__-__"
                    />
                  </div>

                  {/* Email */}
                  <div>
                    <label className="flex items-center gap-2 text-sm font-bold text-white/80 mb-2">
                      <Mail className="w-4 h-4" />
                      Email
                    </label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      className="w-full p-3 bg-white/15 border border-white/30 rounded-xl text-white placeholder-white/40 focus:outline-none focus:border-purple-400 transition-colors"
                      placeholder="email@example.com"
                    />
                  </div>

                  {/* Date & Guests */}
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="flex items-center gap-2 text-sm font-bold text-white/80 mb-2">
                        <Calendar className="w-4 h-4" />
                        Дата
                      </label>
                      <input
                        type="date"
                        name="date"
                        value={formData.date}
                        onChange={handleChange}
                        className="w-full p-3 bg-white/15 border border-white/30 rounded-xl text-white focus:outline-none focus:border-purple-400 transition-colors"
                      />
                    </div>
                    <div>
                      <label className="flex items-center gap-2 text-sm font-bold text-white/80 mb-2">
                        <Users className="w-4 h-4" />
                        Гостей
                      </label>
                      <select
                        name="guests"
                        value={formData.guests}
                        onChange={handleChange}
                        className="w-full p-3 bg-white/15 border border-white/30 rounded-xl text-white focus:outline-none focus:border-purple-400 transition-colors"
                      >
                        {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((n) => (
                          <option key={n} value={n} className="bg-purple-900 text-white">
                            {n} {n === 1 ? 'гость' : n < 5 ? 'гостя' : 'гостей'}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  {/* Comment */}
                  <div>
                    <label className="text-sm font-bold text-white/80 mb-2 block">
                      Комментарий
                    </label>
                    <textarea
                      name="comment"
                      value={formData.comment}
                      onChange={handleChange}
                      rows={3}
                      className="w-full p-3 bg-white/15 border border-white/30 rounded-xl text-white placeholder-white/40 focus:outline-none focus:border-purple-400 transition-colors resize-none"
                      placeholder="Особые пожелания, вопросы..."
                    />
                  </div>

                  {/* Submit */}
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full py-4 bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 disabled:opacity-50 text-white font-bold rounded-xl transition-all flex items-center justify-center gap-2"
                  >
                    {isSubmitting ? (
                      <>
                        <Loader2 className="w-5 h-5 animate-spin" />
                        Отправляем...
                      </>
                    ) : (
                      <>
                        <Check className="w-5 h-5" />
                        Забронировать
                      </>
                    )}
                  </button>
                </form>
              </>
            ) : (
              <div className="text-center py-8">
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="w-20 h-20 mx-auto mb-6 rounded-full bg-gradient-to-br from-green-500 to-emerald-500 flex items-center justify-center"
                >
                  <Check className="w-10 h-10 text-white" />
                </motion.div>
                <h3 className="text-2xl font-black text-white mb-2">Заявка отправлена!</h3>
                <p className="text-white/70 mb-6">
                  Мы свяжемся с вами в ближайшее время для подтверждения бронирования.
                </p>
                <button
                  onClick={resetAndClose}
                  className="w-full py-3 bg-white/20 hover:bg-white/30 text-white font-bold rounded-xl transition-all"
                >
                  Отлично!
                </button>
              </div>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
