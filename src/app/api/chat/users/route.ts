import { NextResponse } from 'next/server';
import { UserProfile } from 'types/user-profile';

// ==============================|| MOCK DATA - CHAT USERS ||============================== //

/**
 * Chat kullanıcıları için mock data
 * Otel rezervasyonu senaryosu için müşteri profilleri
 */
const mockUsers: UserProfile[] = [
  {
    id: '1',
    name: 'Ahmet Yılmaz',
    avatar: '/assets/images/users/avatar-1.png',
    role: 'Müşteri',
    about: 'Otel rezervasyonu yapmak istiyor',
    email: 'ahmet.yilmaz@example.com',
    phone: '+90 555 123 4567',
    status: 'online',
    online_status: 'online',
    lastMessage: 'Hayır, teşekkürler! Çok yardımcı oldunuz.',
    time: '09:30',
    unReadChatCount: 0
  },
  {
    id: '2',
    name: 'Ayşe Demir',
    avatar: '/assets/images/users/avatar-2.png',
    role: 'Müşteri',
    about: 'Otel rezervasyonu sorguluyor',
    email: 'ayse.demir@example.com',
    phone: '+90 555 234 5678',
    status: 'away',
    online_status: 'away',
    lastMessage: 'Deniz manzaralı oda var mı?',
    time: '10:15',
    unReadChatCount: 2
  },
  {
    id: '3',
    name: 'Mehmet Kaya',
    avatar: '/assets/images/users/avatar-3.png',
    role: 'Müşteri',
    about: 'Grup rezervasyonu için bilgi alıyor',
    email: 'mehmet.kaya@example.com',
    phone: '+90 555 345 6789',
    status: 'offline',
    online_status: 'offline',
    lastMessage: '10 kişilik grup için fiyat alabilir miyim?',
    time: 'Dün',
    unReadChatCount: 0
  },
  {
    id: '4',
    name: 'Zeynep Şahin',
    avatar: '/assets/images/users/avatar-4.png',
    role: 'Müşteri',
    about: 'Rezervasyon iptali yapmak istiyor',
    email: 'zeynep.sahin@example.com',
    phone: '+90 555 456 7890',
    status: 'online',
    online_status: 'online',
    lastMessage: 'Rezervasyonumu iptal etmek istiyorum',
    time: '11:45',
    unReadChatCount: 1
  },
  {
    id: '5',
    name: 'Can Öztürk',
    avatar: '/assets/images/users/avatar-5.png',
    role: 'Müşteri',
    about: 'Erken check-in mümkün mü?',
    email: 'can.ozturk@example.com',
    phone: '+90 555 567 8901',
    status: 'online',
    online_status: 'online',
    lastMessage: 'Sabah erken saatte gelebilir miyim?',
    time: '12:20',
    unReadChatCount: 0
  }
];

// GET /api/chat/users - Tüm chat kullanıcılarını listele
export async function GET() {
  return NextResponse.json({
    users: mockUsers
  });
}
