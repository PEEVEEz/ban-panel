import prisma from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function GET(_: NextRequest, { params }: { params: { api_key: string } }) {
    try {
        const server = await prisma.servers.findUnique({
            where: {
                api_key: params.api_key
            }
        });

        if (!server) {
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
