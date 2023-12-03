import prisma from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/authOptions";

export async function GET() {
    try {
        const session = await getServerSession();
        if (!session) {
            return NextResponse.json({ message: "Unauthorized" }, {
                status: 401
            });
        }

        const bans = await prisma.bans.findMany();

        return NextResponse.json(bans || []);
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

        const body = await req.json();

        const server = await prisma.servers.findUnique({
            where: {
                id: body.server.id
            }
        });

        if (server?.owner !== session.user.id) {
            return NextResponse.json({ message: "Unauthorized" }, {
                status: 401
            });
        }

        const data = await prisma.bans.create({
            data: {
                serverId: body.server.id,
                identifiers: body.identifiers,
                reason: body.reason,
                name: body.name,
                expires: new Date("11/12/2023")
            }
        });

        return NextResponse.json(data);
    } catch (error) {
        return NextResponse.json({ message: "Internal Server Error" }, {
            status: 500
        });
    }
}
