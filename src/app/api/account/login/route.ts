// next
import { NextRequest, NextResponse } from 'next/server';



// ==============================|| NEXT AUTH - ROUTES  ||============================== //

export async function POST(request: NextRequest) {
    //VERİ TABANI KONTROLLERİ
    const credentialsData = await request.json();
    console.log(credentialsData);
    const { email, password } = credentialsData;
    console.log(email, password);
    return NextResponse.json({ serviceToken: "13234545" , user: {email, name: "Yusuf"}});
}
