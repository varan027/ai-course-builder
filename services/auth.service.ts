import { getPrisma } from "@/lib/db"
import { users } from "@/lib/users"

export const authService = {
  async signup(email: string, password: string) {
    const prisma = await getPrisma()

    const exists = await prisma.user.findUnique({
      where: { email }
    })
    if(exists){
      throw new Error("User already exists")
    }
    
    const user = await prisma.user.create({
      data: {
        email,
        password
      }
    })

    return user;
  },

  async login(email: string, password: string){
    const prisma = await getPrisma()
    const user = await prisma.user.findUnique({
      where: { email }
    })

    if(!user || user.password !== password){
      throw new Error("Invalid credentials")
    }

    return user;
  },

}