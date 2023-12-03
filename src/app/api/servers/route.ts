import prisma from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/authOptions";
import ShortUniqueId from "short-unique-id";

const uid = new ShortUniqueId({
    length: 20
});

export async function GET(req: NextRequest) {
    try {
        const { searchParams } = new URL(req.url);

        const session = await getServerSession(authOptions);
        if (!session) {
            return NextResponse.json({ message: "Unauthorized" }, {
                status: 401
            });
        }

        // Check if the key is "all" to fetch all servers or filter by owner
        const servers = await prisma.servers.findMany(searchParams.get("key") !== "all" ? {
            where: {
                owner: session?.user.id,
            },
        } : undefined);

        return NextResponse.json(servers || []);
    } catch (error) {
        return NextResponse.json({ message: "Internal Server Error" }, {
            status: 500
        });
    }
}

export async function POST(req: NextRequest) {
    try {
        const session = await getServerSession(authOptions);
        if (!session) {
            return NextResponse.json({ message: "Unauthorized" }, {
                status: 401
            });
        }

        const body: { name: string } = await req.json();

        if (!body || typeof body.name !== 'string') {
            return NextResponse.json({ message: "Invalid request body" }, {
                status: 400
            });
        }

        const newServer = await prisma.servers.create({
            data: {
                owner: session.user.id,
                name: body.name,
                api_key: uid.rnd()
            }
        });

        return NextResponse.json(newServer);
    } catch (error) {
        return NextResponse.json({ message: "Internal Server Error" }, {
            status: 500
        });
    }
}
