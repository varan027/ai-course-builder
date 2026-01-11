import { getServerSession } from 'next-auth'
import { authOptions } from '@/app/api/auth/[...nextauth]/route'
import { redirect } from 'next/navigation';
import DashboardClient from './DashboardClient';

const page = async () => {
  const session = await getServerSession(authOptions);

  if(!session?.user){
    redirect("/")
  }

  return (
    <div>
      <DashboardClient/>
    </div>
  )
}

export default page