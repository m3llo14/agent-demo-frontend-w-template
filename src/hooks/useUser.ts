// next
import { useSession } from 'next-auth/react';

interface UserProps {
  name: string;
  email: string;
  avatar: string;
  thumb: string;
  role: string;
}

export default function useUser() {
  const { data: session } = useSession();
  if (session) {
    const user = session?.user;
    const provider = session?.provider;
    const email = user?.email || '';
    const fallbackName = email ? email.split('@')[0] : 'User';
    const displayName = user?.name || fallbackName;
    const avatar = user?.image || '/assets/images/users/avatar-1.png';
    const thumb = user?.image ? avatar : '/assets/images/users/avatar-thumb-1.png';
    const role = user?.backendUser?.role || user?.role || 'merchant_admin';

    const newUser: UserProps = {
      name: displayName,
      email: email || 'user@example.com',
      avatar,
      thumb,
      role
    };

    return newUser;
  }
  return false;
}
