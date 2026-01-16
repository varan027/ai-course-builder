import { getPrisma } from "@/lib/db"
import { hashPassword, verifyPassword } from "@/lib/password"

export const authService = {
  async signup(email: string, password: string) {
    const prisma = await getPrisma()

    const exists = await prisma.user.findUnique({
      where: { email }
    })
    if(exists){
      throw new Error("User already exists")
    }
    
    const hashedPassword = await hashPassword(password);

    const user = await prisma.user.create({
      data: {
        email,
        password: hashedPassword
      }
    })

    return user;
  },

  async login(email: string, password: string){
    const prisma = await getPrisma()
    const user = await prisma.user.findUnique({
      where: { email }
    })

    if(!user){
      throw new Error("Invalid credentials")
    }

    const isPassValid = await verifyPassword(password, user.password)

    return user;
  },

}