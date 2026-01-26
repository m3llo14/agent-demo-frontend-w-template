import { ChatHistory } from 'types/chat';

/**
 * Otel rezervasyonu senaryosu için chat mock data generator
 * Clean code prensiplerine uygun olarak ayrı bir dosyada tutuldu
 *
 * Senaryo: Müşteri otel rezervasyonu için bilgi istiyor,
 * AI Resepsiyonist müşterinin isteklerini yerine getirmeye çalışıyor
 */
export const generateHotelReservationChat = (customerName: string): ChatHistory[] => {
  const AI_RECEPTIONIST = 'AI Resepsiyonist';
  const CUSTOMER = customerName;

  return [
    {
      id: 1,
      from: CUSTOMER,
      to: AI_RECEPTIONIST,
      text: 'Merhaba, otel rezervasyonu yapmak istiyorum. Size nasıl yardımcı olabilirsiniz?',
      time: '09:15'
    },
    {
      id: 2,
      from: AI_RECEPTIONIST,
      to: CUSTOMER,
      text: 'Merhaba! Tabii ki, size yardımcı olmaktan mutluluk duyarım. Hangi tarihler için rezervasyon yapmak istersiniz?',
      time: '09:16'
    },
    {
      id: 3,
      from: CUSTOMER,
      to: AI_RECEPTIONIST,
      text: '15-20 Aralık tarihleri arasında, 5 gece kalış için.',
      time: '09:17'
    },
    {
      id: 4,
      from: AI_RECEPTIONIST,
      to: CUSTOMER,
      text: 'Harika! 15-20 Aralık tarihleri için müsaitlik kontrol ediyorum. Kaç kişilik bir oda istersiniz?',
      time: '09:18'
    },
    {
      id: 5,
      from: CUSTOMER,
      to: AI_RECEPTIONIST,
      text: '2 kişilik, çift kişilik yataklı bir oda lütfen. Deniz manzaralı olabilir mi?',
      time: '09:19'
    },
    {
      id: 6,
      from: AI_RECEPTIONIST,
      to: CUSTOMER,
      text: 'Tabii ki! Deniz manzaralı çift kişilik oda için size birkaç seçenek sunabilirim:\n\n1. Deluxe Deniz Manzaralı Oda - 250€/gece\n2. Suite Deniz Manzaralı - 350€/gece\n3. Premium Deniz Manzaralı Oda - 450€/gece\n\nHangisini tercih edersiniz?',
      time: '09:20'
    },
    {
      id: 7,
      from: CUSTOMER,
      to: AI_RECEPTIONIST,
      text: 'Deluxe Deniz Manzaralı Oda uygun görünüyor. Kahvaltı dahil mi?',
      time: '09:22'
    },
    {
      id: 8,
      from: AI_RECEPTIONIST,
      to: CUSTOMER,
      text: 'Evet, Deluxe odalarımızda kahvaltı dahildir. Ayrıca ücretsiz WiFi, mini bar ve oda servisi de dahil. Başka bir isteğiniz var mı?',
      time: '09:23'
    },
    {
      id: 9,
      from: CUSTOMER,
      to: AI_RECEPTIONIST,
      text: 'Mükemmel! Oda sigara içilebilir mi?',
      time: '09:24'
    },
    {
      id: 10,
      from: AI_RECEPTIONIST,
      to: CUSTOMER,
      text: 'Maalesef otelimizde tüm odalar sigara içilmeyen alan olarak belirlenmiştir. Ancak otelimizde özel sigara içme alanları mevcuttur. Bu durum sizin için sorun olur mu?',
      time: '09:25'
    },
    {
      id: 11,
      from: CUSTOMER,
      to: AI_RECEPTIONIST,
      text: 'Hayır, sorun değil. Rezervasyonu tamamlayabiliriz. Ödeme bilgilerini nasıl verebilirim?',
      time: '09:26'
    },
    {
      id: 12,
      from: AI_RECEPTIONIST,
      to: CUSTOMER,
      text: 'Harika! Rezervasyonunuzu şu şekilde özetleyebilirim:\n\n📅 Tarih: 15-20 Aralık (5 gece)\n🛏️ Oda: Deluxe Deniz Manzaralı Çift Kişilik\n💰 Fiyat: 250€/gece (Toplam: 1,250€)\n🍳 Kahvaltı: Dahil\n\nÖdeme için güvenli ödeme sayfamıza yönlendirebilirim. İsterseniz rezervasyon kodunuzu da size iletebilirim. Devam edelim mi?',
      time: '09:27'
    },
    {
      id: 13,
      from: CUSTOMER,
      to: AI_RECEPTIONIST,
      text: 'Evet, devam edelim. Rezervasyon kodunu da almak istiyorum.',
      time: '09:28'
    },
    {
      id: 14,
      from: AI_RECEPTIONIST,
      to: CUSTOMER,
      text: 'Mükemmel! Rezervasyon kodunuz: HTL-2024-12-15-001\n\nÖdeme sayfasına yönlendiriliyorsunuz. Ödeme tamamlandıktan sonra rezervasyon onay e-postası size gönderilecektir. Başka bir konuda yardımcı olabileceğim bir şey var mı?',
      time: '09:29'
    },
    {
      id: 15,
      from: CUSTOMER,
      to: AI_RECEPTIONIST,
      text: 'Hayır, teşekkürler! Çok yardımcı oldunuz. İyi günler!',
      time: '09:30'
    },
    {
      id: 16,
      from: AI_RECEPTIONIST,
      to: CUSTOMER,
      text: "Rica ederim! Size hizmet etmekten mutluluk duyduk. 15 Aralık'ta sizi ağırlamayı dört gözle bekliyoruz. İyi günler dileriz! 🏨✨",
      time: '09:31'
    }
  ];
};
