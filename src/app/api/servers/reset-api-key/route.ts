import prisma from "@/lib/prisma";
import { authOptions } from "@/authOptions";
import ShortUniqueId from 'short-unique-id';
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";

const uid = new ShortUniqueId({
    length: 20
})

export async function POST(req: NextRequest) {
    try {
        const session = await getServerSession(authOptions);
        if (!session) {
            return NextResponse.json({ message: "Unauthorized" }, {
                status: 401
            });
        }

        const newApiKey = uid.rnd();
        const body: { id: number } = await req.json();

        if (!body || typeof body.id !== 'number') {
            return NextResponse.json({ message: "Invalid request body" }, {
                status: 400
            });
        }

        const server = await prisma.servers.findUnique({
            where: {
                id: body.id,
            },
        });

        if (!server || server.owner !== session.user.id) {
            return NextResponse.json({ message: "Unauthorized" }, {
                status: 401
            });
        }

        await prisma.servers.update({
            where: {
                id: body.id
            },
            data: {
                api_key: newApiKey
            }
        });

        return NextResponse.json({ api_key: newApiKey });
    } catch (error) {
        return NextResponse.json({ message: "Internal Server Error" }, {
            status: 500
        });
    }
}
