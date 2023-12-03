import prisma from "@/lib/primsa";
import ShortUniqueId from 'short-unique-id';
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";
import { authOptions } from "@/authOptions";


const uid = new ShortUniqueId({
    length: 20
})

export async function POST(req: NextRequest) {
    const session = await getServerSession(authOptions);
    if (!session) return NextResponse.json({ message: "Unauthorized" }, {
        status: 401
    })

    const newApiKey = uid.rnd()
    const body: { id: number } = await req.json()

    const server = await prisma.servers.findUnique({
        where: {
            id: body.id,
        },
    });

    if (!server || server.owner !== session.user.id) {
        return NextResponse.json({ message: "Unauthorized" }, {
            status: 401
        })
    }


    await prisma.servers.update({
        where: {
            id: body.id
        },
        data: {
            api_key: newApiKey
        }
    })

    return NextResponse.json({ api_key: newApiKey })
}