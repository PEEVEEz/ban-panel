import prisma from "@/lib/primsa";
import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/authOptions";
import ShortUniqueId from "short-unique-id";

const uid = new ShortUniqueId({
    length: 20
})

export async function GET(req: NextRequest) {
    const { searchParams } = new URL(req.url)

    const session = await getServerSession(authOptions);
    if (!session) return NextResponse.json({ message: "Unauthorized" }, {
        status: 401
    })

    //entiedä onko tämä hyvätapa mutta olkootny
    const servers = await prisma.servers.findMany(searchParams.get("key") !== "all" ? {
        where: {
            owner: session?.user.id,
        },
    } : undefined);

    return NextResponse.json(servers || [])
}

export async function POST(req: NextRequest) {
    const session = await getServerSession(authOptions);
    if (!session) return NextResponse.json({ message: "Unauthorized" }, {
        status: 401
    })

    const body = await req.json();

    const newServer = await prisma.servers.create({
        data: {
            owner: session.user.id,
            name: body.name,
            api_key: uid.rnd()
        }
    })

    return NextResponse.json(newServer)
}