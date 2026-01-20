import { NextRequest, NextResponse } from 'next/server';
import { ChatHistory } from 'types/chat';
import { generateHotelReservationChat } from 'utils/mockData/chatMockData';

// ==============================|| API - CHAT FILTER ||============================== //

/**
 * POST /api/chat/filter - Kullanıcı chat geçmişini getir
 * 
 * Request body:
 * {
 *   user: string,        // Kullanıcı adı
 *   endpoints: 'chat'   // Endpoint tipi
 * }
 * 
 * Response: ChatHistory[]
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { user, endpoints: endpointType } = body;

    // Sadece chat endpoint'i için mock data döndür
    if (endpointType === 'chat' && user) {
      const chatHistory = generateHotelReservationChat(user);
      
      return NextResponse.json(chatHistory, { status: 200 });
    }

    // Diğer endpoint'ler için boş array döndür
    return NextResponse.json([], { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { error: 'Invalid request body' },
      { status: 400 }
    );
  }
}

