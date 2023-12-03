import prisma from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";
import { authOptions } from "@/authOptions";

export async function DELETE(_: NextRequest, { params }: { params: { id: string } }) {
    try {
        const id = Number(params.id);

        if (isNaN(id)) {
            return NextResponse.json({ message: "Invalid ID" }, {
                status: 400
            });
        }

        const session = await getServerSession(authOptions);

        if (!session) {
            return NextResponse.json({ message: "Unauthorized" }, {
                status: 401
            });
        }

        const server = await prisma.servers.findUnique({
            where: {
                id: id,
            },
        });

        if (!server || server.owner !== session.user.id) {
            return NextResponse.json({ message: "Unauthorized" }, {
                status: 401
            });
        }

        await prisma.servers.delete({
            where: {
                id
            }
        });

        return NextResponse.json({ message: "OK" });
    } catch (error) {
        return NextResponse.json({ message: "Internal Server Error" }, {
            status: 500
        });
    }
}
