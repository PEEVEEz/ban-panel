import prisma from "@/lib/primsa";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";
import { authOptions } from "@/authOptions";


export async function DELETE(_: NextRequest, { params }: { params: { id: string } }) {
    const id = Number(params.id)
    const session = await getServerSession(authOptions);

    if (!session) return new NextResponse(JSON.stringify({ message: "Unauthorized" }), {
        status: 401
    })

    const server = await prisma.servers.findUnique({
        where: {
            id: id,
        },
    });

    if (!server || server.owner !== session.user.id) {
        return new NextResponse(JSON.stringify({ message: "Unauthorized" }), {
            status: 401
        })
    }


    await prisma.servers.delete({
        where: {
            id
        }
    })

    return NextResponse.json({ message: "OK" })
}